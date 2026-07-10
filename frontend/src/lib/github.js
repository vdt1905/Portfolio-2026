/**
 * Minimal live GitHub client for the terminal.
 * Unauthenticated (60 req/hr) — plenty for a portfolio. Responses are
 * cached in-memory for the session so repeated commands are instant.
 */
import { socials } from "../data/portfolio";

export const GH_USER =
  socials.github?.split("/").filter(Boolean).pop() || "vdt1905";

const API = "https://api.github.com";
const cache = new Map();

async function get(path) {
  if (cache.has(path)) return cache.get(path);
  const res = await fetch(`${API}${path}`, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) {
    const err = new Error(res.status === 403 ? "rate-limit" : `http-${res.status}`);
    err.status = res.status;
    throw err;
  }
  const data = await res.json();
  cache.set(path, data);
  return data;
}

export const github = {
  user: () => get(`/users/${GH_USER}`),
  repos: () => get(`/users/${GH_USER}/repos?sort=updated&per_page=100`),
  events: () => get(`/users/${GH_USER}/events/public?per_page=60`),

  /** Aggregate stats derived from repos. */
  async stats() {
    const [user, repos] = await Promise.all([this.user(), this.repos()]);
    const stars = repos.reduce((n, r) => n + (r.stargazers_count || 0), 0);
    const forks = repos.reduce((n, r) => n + (r.forks_count || 0), 0);
    const langs = {};
    repos.forEach((r) => r.language && (langs[r.language] = (langs[r.language] || 0) + 1));
    const topLangs = Object.entries(langs).sort((a, b) => b[1] - a[1]).slice(0, 6);
    return { user, repos, stars, forks, topLangs };
  },

  /** Recent push commits pulled from the public events feed. */
  async recentCommits(limit = 8) {
    const events = await this.events();
    const commits = [];
    for (const e of events) {
      if (e.type !== "PushEvent") continue;
      const repo = e.repo?.name?.split("/").pop();
      for (const c of e.payload?.commits || []) {
        commits.push({ repo, message: c.message.split("\n")[0], sha: c.sha?.slice(0, 7), date: e.created_at });
      }
      if (commits.length >= limit) break;
    }
    return commits.slice(0, limit);
  },

  /** Last ~14 days of activity, bucketed by day, from public events. */
  async activity() {
    const events = await this.events();
    const days = 14;
    const buckets = Array.from({ length: days }, () => 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const byType = {};
    for (const e of events) {
      byType[e.type] = (byType[e.type] || 0) + 1;
      const d = new Date(e.created_at);
      d.setHours(0, 0, 0, 0);
      const diff = Math.floor((today - d) / 86400000);
      if (diff >= 0 && diff < days) buckets[days - 1 - diff] += 1;
    }
    return { buckets, byType, total: events.length };
  },
};
