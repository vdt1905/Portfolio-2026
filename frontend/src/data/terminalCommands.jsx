import { L, resolveProject } from "../lib/term";
import { github, GH_USER } from "../lib/github";
import { profile, socials, projects, timeline, achievements } from "./portfolio";
import { caseStudies } from "./caseStudies";
import { domains, coreTimeline } from "./engineeringCore";

/* ----------------------------- small helpers ----------------------------- */
const arrow = " → ";
const flow = (arr) => arr.join(arrow);

/* Command categories — these double as "folders" you can `cd` into. */
export const GROUPS = {
  navigation: { label: "Navigation", desc: "move around the portfolio" },
  engineering: { label: "Engineering", desc: "architecture · stack · timeline" },
  github: { label: "GitHub", desc: "live repo + contribution data" },
  ai: { label: "AI", desc: "agents · models · pipelines" },
  devops: { label: "DevOps", desc: "docker · deploy · ci · infra" },
  linux: { label: "Linux", desc: "filesystem + shell basics" },
  contextual: { label: "Contextual", desc: "smart: open · explain · recruiter" },
};
export const GROUP_ORDER = ["navigation", "engineering", "github", "ai", "devops", "linux", "contextual"];

/** Commands belonging to a group (excluding hidden). */
export function groupCommands(gid, commands) {
  return Object.entries(commands).filter(([, c]) => c.group === gid && !c.hidden);
}

/** A friendly listing of one category's commands with descriptions. */
export function groupView(gid, commands) {
  const g = GROUPS[gid];
  if (!g) return null;
  const items = groupCommands(gid, commands);
  return [
    L.head(`${g.label} — ${g.desc}`),
    ...items.map(([n, c]) => L.node(
      <span>
        <span className="text-cyan inline-block w-40">{c.usage || n}</span>
        <span className="text-white/50">{c.desc}</span>
      </span>
    )),
    L.spacer(),
    L.muted("run a command above · `cd ..` to go back"),
  ];
}

/* tiny Levenshtein for "did you mean" */
function lev(a, b) {
  const m = a.length, n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}

/** Closest command/category names to a mistyped token. */
export function suggest(input, commands) {
  const names = [
    ...Object.keys(commands).filter((n) => !commands[n].hidden),
    ...Object.keys(GROUPS),
    ...Object.keys(ALIASES),
  ];
  const t = input.toLowerCase();
  const scored = names.map((n) => {
    if (n === t) return [n, 0];
    if (n.startsWith(t) || t.startsWith(n)) return [n, 1];
    if (n.includes(t) || t.includes(n)) return [n, 2];
    return [n, lev(t, n)];
  });
  return [...new Set(scored.filter(([, s]) => s <= 3).sort((a, b) => a[1] - b[1]).slice(0, 4).map((x) => x[0]))];
}

function projectLine(p) {
  const cs = caseStudies[p.id];
  return L.node(
    <span>
      <span style={{ color: p.accent }}>◈ {p.name}</span>
      <span className="text-white/40"> — {p.tag}</span>
      {cs?.status && <span className="text-white/30"> · {cs.status}</span>}
    </span>
  );
}

const JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "There are 10 kinds of people: those who understand binary and those who don't.",
  "A SQL query walks into a bar, goes up to two tables and asks: 'Can I join you?'",
  "It works on my machine. — every developer, ever.",
  "I would tell you a UDP joke, but you might not get it.",
];
const QUOTES = [
  "First, solve the problem. Then, write the code.",
  "Make it work, make it right, make it fast.",
  "Simplicity is the soul of efficiency.",
  "The best error message is the one that never shows up.",
  "Ship it. Then make it better.",
];

/* ------------------------------ command list ------------------------------ */
export const COMMANDS = {
  /* ============ META ============ */
  help: {
    group: "meta", desc: "quick help + categories", usage: "help [command|category]",
    run: (args, ctx) => {
      const q = (args[0] || "").toLowerCase();
      // help <group> → list that category
      if (GROUPS[q]) return groupView(q, ctx.commands);
      // help <command> → detail
      if (q) {
        const name = ALIASES[q] || q;
        const c = ctx.commands[name];
        if (!c) { const s = suggest(q, ctx.commands); return [L.err(`no help for '${args[0]}'`), s.length && L.muted(`did you mean: ${s.join(", ")}?`)].filter(Boolean); }
        return [L.accent(name, "#00e5ff"), L.muted(`  ${c.desc}`), c.usage && L.muted(`  usage: ${c.usage}`)].filter(Boolean);
      }
      // overview — guided, not a wall of names
      return [
        L.head("EngOS — quick help"),
        L.node(<span className="text-white/70">Categories (type the name, or <span className="text-cyan">cd &lt;name&gt;</span>, to open):</span>),
        L.spacer(),
        ...GROUP_ORDER.map((g) => L.node(
          <span>
            <span className="text-cyan inline-block w-32">{g}/</span>
            <span className="text-white/50">{GROUPS[g].desc}</span>
          </span>
        )),
        L.spacer(),
        L.node(<span className="text-white/70">Popular: <span className="text-cyan">about</span> · <span className="text-cyan">projects</span> · <span className="text-cyan">repos</span> · <span className="text-cyan">open shushrut</span> · <span className="text-cyan">recruiter</span></span>),
        L.node(<span className="text-white/50">Full walkthrough: <span className="text-cyan">guide</span> · list files: <span className="text-cyan">ls</span> · detail: <span className="text-cyan">help &lt;command&gt;</span></span>),
      ];
    },
  },
  guide: {
    group: "meta", desc: "friendly getting-started walkthrough",
    run: () => [
      L.head("Welcome to EngOS — here's the tour"),
      L.spacer(),
      L.accent("① This terminal navigates the whole portfolio.", "#00e5ff"),
      L.node(<span className="text-white/70">Commands like <span className="text-cyan">about</span>, <span className="text-cyan">projects</span>, <span className="text-cyan">skills</span>, <span className="text-cyan">contact</span> fly you into that 3D zone.</span>),
      L.spacer(),
      L.accent("② Explore by category — they work like folders.", "#00e5ff"),
      L.node(<span className="text-white/70"><span className="text-cyan">ls</span> to see them, <span className="text-cyan">cd ai</span> to open one, <span className="text-cyan">cd ..</span> to go back.</span>),
      L.spacer(),
      L.accent("③ Try these to get a feel:", "#00e5ff"),
      L.node(<span className="text-white/70"><span className="text-cyan">recruiter</span> — the 30-second pitch</span>),
      L.node(<span className="text-white/70"><span className="text-cyan">open shushrut</span> — enter a full case study</span>),
      L.node(<span className="text-white/70"><span className="text-cyan">repos</span> · <span className="text-cyan">stats</span> — live GitHub data</span>),
      L.node(<span className="text-white/70"><span className="text-cyan">assistant</span> what should I look at? — just ask</span>),
      L.spacer(),
      L.accent("④ Shortcuts:", "#00e5ff"),
      L.node(<span className="text-white/70"><span className="text-cyan">Tab</span> autocompletes · <span className="text-cyan">↑/↓</span> history · <span className="text-cyan">Ctrl+L</span> clears · <span className="text-cyan">Esc</span> exits</span>),
      L.spacer(),
      L.muted("…and there are a few hidden commands. curiosity is rewarded."),
    ],
  },
  cd: {
    group: "linux", desc: "open a category (cd <name>)", usage: "cd <category>",
    args: () => Object.keys(GROUPS),
    run: (args, ctx) => {
      const t = (args[0] || "").toLowerCase().replace(/\/$/, "");
      if (!t || t === "~" || t === ".." || t === "/") { ctx.setCwd(""); return [L.muted("→ ~/portfolio")]; }
      if (GROUPS[t]) { ctx.setCwd(t); return groupView(t, ctx.commands); }
      const s = suggest(t, ctx.commands).filter((n) => GROUPS[n]);
      return [L.err(`cd: ${args[0]}: no such category`), L.muted(`categories: ${Object.keys(GROUPS).join(", ")}`), s.length && L.muted(`did you mean: ${s.join(", ")}?`)].filter(Boolean);
    },
  },
  clear: { group: "linux", desc: "clear the screen", run: (a, ctx) => { ctx.clear(); return null; } },
  theme: {
    group: "meta", desc: "toggle light / dark theme",
    run: (a, ctx) => { ctx.actions.toggleTheme(); return [L.ok("→ theme toggled")]; },
  },

  /* ============ NAVIGATION ============ */
  about: {
    group: "navigation", desc: "who I am", run: (a, ctx) => {
      ctx.navigate(() => ctx.actions.openZone("about"));
      return [
        L.head(profile.name),
        L.muted(`${profile.role} · ${profile.subRole} — ${profile.location}`),
        L.text(profile.mission),
        L.muted("opening profile…"),
      ];
    },
  },
  projects: {
    group: "navigation", desc: "list project museum",
    run: (a, ctx) => {
      ctx.navigate(() => ctx.actions.openZone("projects"));
      return [L.head("Projects"), ...projects.map(projectLine), L.spacer(), L.muted("tip: `open <name>` · `explain <name>` · `architecture <name>`")];
    },
  },
  skills: {
    group: "navigation", desc: "engineering core (skills)",
    run: (a, ctx) => { ctx.navigate(() => ctx.actions.openZone("skills")); return [L.head("Engineering Core"), L.muted("opening domains…")]; },
  },
  resume: {
    group: "navigation", desc: "open résumé (PDF)",
    run: () => { window.open(socials.resume, "_blank"); return [L.ok("→ opening resume.pdf")]; },
  },
  contact: {
    group: "navigation", desc: "reach me",
    run: (a, ctx) => {
      ctx.navigate(() => ctx.actions.openZone("contact"));
      return [L.head("Contact"), L.node(<span>email <span className="text-cyan">{profile.email}</span></span>), L.muted("opening comms console…")];
    },
  },
  github: {
    group: "navigation", desc: "open GitHub profile",
    run: () => { window.open(socials.github, "_blank"); return [L.ok(`→ launching github.com/${GH_USER}`)]; },
  },
  linkedin: {
    group: "navigation", desc: "open LinkedIn", hidden: true,
    run: () => { window.open(socials.linkedin, "_blank"); return [L.ok("→ launching LinkedIn")]; },
  },

  /* ============ ENGINEERING ============ */
  stack: {
    group: "engineering", desc: "tech stack by domain",
    run: () => {
      const out = [L.head("Stack")];
      domains.forEach((d) => {
        out.push(L.node(
          <span><span style={{ color: d.color }}>{d.short.padEnd(10)}</span>
            <span className="text-white/60">{d.tech.map((t) => t.name).join(", ")}</span></span>
        ));
      });
      return out;
    },
  },
  architecture: {
    group: "engineering", desc: "system architecture of a project", usage: "architecture <project>",
    args: () => projects.map((p) => p.id),
    run: (args, ctx) => {
      const id = resolveProject(args[0], projects);
      if (!id) return [L.err("usage: architecture <shushrut|docling|finagent|innomate>")];
      const p = projects.find((x) => x.id === id);
      const cs = caseStudies[id];
      ctx.navigate(() => ctx.actions.openProject(id), 800);
      return [
        L.head(`${p.name} — architecture`),
        L.accent(flow(cs.architecture.nodes.map((n) => n.label)), p.accent),
        L.spacer(),
        ...cs.architecture.nodes.map((n) => L.node(
          <span><span style={{ color: p.accent }}>{n.label}</span><span className="text-white/40"> — {n.desc}</span></span>
        )),
        L.spacer(), L.muted("launching interactive case study…"),
      ];
    },
  },
  timeline: {
    group: "engineering", desc: "how my skills evolved",
    run: () => [L.head("Engineering Timeline"), ...coreTimeline.map((t) => L.node(
      <span><span className="text-cyan">{t.year.padEnd(6)}</span><span className="text-white/85">{t.title}</span>
        <span className="text-white/40"> — {t.detail}</span></span>
    ))],
  },
  experience: {
    group: "engineering", desc: "journey + achievements",
    run: () => [
      L.head("Experience"),
      ...timeline.map((t) => L.node(<span><span className="text-cyan">{t.year.padEnd(6)}</span><span className="text-white/70">{t.title} — {t.desc}</span></span>)),
      L.spacer(), L.accent("Achievements", "#00ff9c"),
      ...achievements.map((a) => L.node(<span><span className="text-success">★ </span>{a.title} <span className="text-white/40">— {a.org} · {a.year}</span></span>)),
    ],
  },

  /* ============ GITHUB (live) ============ */
  repos: {
    group: "github", desc: "live: top repositories",
    run: async (a, ctx) => {
      try {
        const repos = (await github.repos())
          .filter((r) => !r.fork).sort((x, y) => y.stargazers_count - x.stargazers_count || new Date(y.updated_at) - new Date(x.updated_at)).slice(0, 8);
        if (!repos.length) return [L.muted("no public repos found.")];
        return [L.head(`Repositories — @${GH_USER}`), ...repos.map((r) => L.node(
          <a href={r.html_url} target="_blank" rel="noreferrer" className="block hover:bg-white/5 rounded px-1 -mx-1" data-cursor="hover">
            <span className="text-cyan">{r.name}</span>
            {r.language && <span className="text-white/40"> · {r.language}</span>}
            <span className="text-white/40"> · ★{r.stargazers_count}</span>
            {r.description && <span className="text-white/50"> — {r.description.slice(0, 60)}</span>}
          </a>
        ))];
      } catch (e) { return ghError(e); }
    },
  },
  commits: {
    group: "github", desc: "live: recent commits",
    run: async () => {
      try {
        const commits = await github.recentCommits(8);
        if (!commits.length) return [L.muted("no recent public commits.")];
        return [L.head("Recent commits"), ...commits.map((c) => L.node(
          <span><span className="text-success">{c.sha}</span><span className="text-white/40"> {c.repo} </span><span className="text-white/80">{c.message.slice(0, 64)}</span></span>
        ))];
      } catch (e) { return ghError(e); }
    },
  },
  stats: {
    group: "github", desc: "live: GitHub stats",
    run: async () => {
      try {
        const { user, repos, stars, forks, topLangs } = await github.stats();
        return [
          L.head(`@${GH_USER}`),
          L.node(<span className="text-white/80">{user.name || GH_USER} · {user.public_repos} repos · {user.followers} followers</span>),
          L.node(<span className="text-white/60">★ {stars} stars · ⑂ {forks} forks across {repos.length} repos</span>),
          L.spacer(),
          L.accent("top languages", "#00e5ff"),
          ...topLangs.map(([lang, n]) => L.node(
            <span><span className="text-white/80 inline-block w-28">{lang}</span><span className="text-cyan">{"█".repeat(Math.min(n, 18))}</span><span className="text-white/40"> {n}</span></span>
          )),
        ];
      } catch (e) { return ghError(e); }
    },
  },
  activity: {
    group: "github", desc: "live: recent contribution activity",
    run: async () => {
      try {
        const { buckets, byType, total } = await github.activity();
        const max = Math.max(1, ...buckets);
        const spark = buckets.map((v) => "▁▂▃▄▅▆▇█"[Math.min(7, Math.floor((v / max) * 7))]).join("");
        return [
          L.head("Activity — last 14 days"),
          L.node(<span className="text-success text-lg tracking-tight">{spark}</span>),
          L.muted(`${total} public events`),
          L.spacer(),
          ...Object.entries(byType).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t, n]) =>
            L.node(<span><span className="text-white/70 inline-block w-40">{t.replace("Event", "")}</span><span className="text-cyan">{n}</span></span>)),
        ];
      } catch (e) { return ghError(e); }
    },
  },

  /* ============ AI ============ */
  agents: {
    group: "ai", desc: "multi-agent systems I've built",
    run: () => {
      const ai = projects.filter((p) => ["shushrutai", "docling", "finagent"].includes(p.id));
      return [L.head("Multi-Agent Systems"),
        L.text("I architect agentic pipelines — orchestration, safety gates, and schema-constrained output."),
        L.spacer(),
        ...ai.map((p) => { const cs = caseStudies[p.id]; return L.node(
          <span><span style={{ color: p.accent }}>{p.name}</span><span className="text-white/40"> — {cs.architecture.nodes.length} stages, human-in-the-loop</span></span>
        ); })];
    },
  },
  models: {
    group: "ai", desc: "AI models & techniques used",
    run: () => [L.head("Models & Techniques"),
      L.node(<span><span className="text-violet inline-block w-40">Gemini 2.0</span><span className="text-white/60">multimodal vision + text (ShushrutAI)</span></span>),
      L.node(<span><span className="text-violet inline-block w-40">LLMs</span><span className="text-white/60">structure detection, intent (DocLing, FinAgent)</span></span>),
      L.node(<span><span className="text-violet inline-block w-40">NLP</span><span className="text-white/60">citation parsing, text normalization</span></span>),
      L.node(<span><span className="text-violet inline-block w-40">Prompt Engineering</span><span className="text-white/60">schema-constrained, grounded output</span></span>),
      L.spacer(), L.muted("learning next: RAG + vector search")],
  },
  pipeline: {
    group: "ai", desc: "agent orchestration pipeline",
    run: () => {
      const cs = caseStudies.shushrutai;
      return [L.head("Agent Pipeline — ShushrutAI"),
        L.accent(flow(cs.architecture.nodes.map((n) => n.label)), "#6c63ff"),
        L.spacer(), L.muted("agents run concurrently where independent; output is schema-validated before release.")];
    },
  },
  explain: {
    group: "contextual", desc: "explain a project in plain terms", usage: "explain <project>",
    args: () => projects.map((p) => p.id),
    run: (args) => {
      const id = resolveProject(args[0], projects);
      if (!id) return [L.err("usage: explain <shushrut|docling|finagent|innomate>")];
      const p = projects.find((x) => x.id === id); const cs = caseStudies[id];
      return [L.head(p.name), L.accent(cs.mission, p.accent), L.text(p.summary), L.spacer(),
        L.accent("why it's interesting", p.accent),
        ...p.features.slice(0, 3).map((f) => L.node(<span><span style={{ color: p.accent }}>▹ </span><span className="text-white/80">{f}</span></span>)),
        L.spacer(), L.muted(`stack: ${p.tech.join(", ")}`)];
    },
  },

  /* ============ DEVOPS ============ */
  docker: {
    group: "devops", desc: "container setup",
    run: () => [L.head("Docker"),
      L.text("Every service is containerized for reproducible builds — 'works on my machine', deleted."),
      L.spacer(), L.code(`# multi-stage, slim final image
FROM python:3.11-slim AS base
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app:app", "--host", "0.0.0.0"]`, "docker")],
  },
  deploy: {
    group: "devops", desc: "simulate a deployment",
    run: async (a, ctx) => {
      const steps = [
        ["→ building image", "docker build -t app:latest ."],
        ["→ running tests", "12 passed in 3.4s"],
        ["→ pushing image", "sha256:9f2c… pushed"],
        ["→ rolling out", "app · 3/3 healthy"],
      ];
      for (const [head, detail] of steps) {
        ctx.print(L.node(<span><span className="text-cyan">{head}</span><span className="text-white/40"> — {detail}</span></span>));
        await ctx.sleep(600);
      }
      return [L.ok("deploy complete — all services healthy ✓")];
    },
  },
  ci: {
    group: "devops", desc: "CI/CD pipeline",
    run: () => [L.head("CI/CD"),
      L.accent(flow(["commit", "lint", "test", "build", "docker", "deploy"]), "#00e5ff"),
      L.spacer(), L.code(`name: ci
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm test && npm run build`, "yaml"),
      L.muted("status: actively learning — building real pipelines now.")],
  },
  infra: {
    group: "devops", desc: "infrastructure toolbelt",
    run: () => {
      const d = domains.find((x) => x.id === "devops");
      return [L.head("Infrastructure"),
        ...d.tech.map((t) => L.node(
          <span><span className="text-white/80 inline-block w-36">{t.name}</span>
            <span style={{ color: t.status === "production" ? "#00ff9c" : t.status === "learning" ? "#00e5ff" : "#6c63ff" }}>{t.status}</span></span>
        ))];
    },
  },

  /* ============ LINUX ============ */
  pwd: { group: "linux", desc: "print working directory", run: () => [L.text(`/home/${GH_USER}/portfolio`)] },
  whoami: { group: "linux", desc: "current user", run: () => [L.node(<span className="text-cyan">{GH_USER}</span>), L.muted(`${profile.role} · ${profile.subRole}`)] },
  date: { group: "linux", desc: "current date/time", run: () => [L.text(new Date().toString())] },
  history: {
    group: "linux", desc: "command history",
    run: (a, ctx) => ctx.history.length ? ctx.history.map((h, i) => L.node(<span><span className="text-white/30 mr-3">{String(i + 1).padStart(3)}</span>{h}</span>)) : [L.muted("no history yet")],
  },
  ls: {
    group: "linux", desc: "list categories & files", usage: "ls [category]",
    args: () => Object.keys(GROUPS),
    run: (args, ctx) => {
      const dir = (args[0] || ctx.cwd || "").toLowerCase().replace(/\/$/, "");
      // inside a category → list its commands
      if (GROUPS[dir]) {
        const items = groupCommands(dir, ctx.commands);
        return [L.muted(`${dir}/`), L.node(<span className="flex flex-wrap gap-x-5 gap-y-0.5">
          {items.map(([n]) => <span key={n} className="text-cyan">{n}</span>)}
        </span>)];
      }
      if (dir) return [L.err(`ls: ${args[0]}: no such category`)];
      // home → categories (folders) + files
      return [L.node(<span className="flex flex-wrap gap-x-5 gap-y-0.5">
        {GROUP_ORDER.map((g) => <span key={g} className="text-cyan">{g}/</span>)}
        <span className="text-white/80">about.md</span>
        <span className="text-success">resume.pdf</span>
        <span className="text-white/80">contact.md</span>
      </span>), L.muted("`cd <category>` to open · `cat about.md` to read")];
    },
  },
  tree: {
    group: "linux", desc: "show the full command tree",
    run: (a, ctx) => {
      const out = [L.node(<span className="text-cyan">~/portfolio</span>)];
      GROUP_ORDER.forEach((g, gi) => {
        const last = gi === GROUP_ORDER.length - 1 && false; // files come after
        out.push(L.node(<span><span className="text-white/40">{last ? "└──" : "├──"} </span><span className="text-cyan">{g}/</span></span>));
        const cmds = groupCommands(g, ctx.commands);
        cmds.forEach(([n], i) => {
          const l = i === cmds.length - 1;
          out.push(L.node(<span className="text-white/70"><span className="text-white/30">{"│   " + (l ? "└── " : "├── ")}</span>{n}</span>));
        });
      });
      ["about.md", "resume.pdf", "contact.md"].forEach((f, i, arr) =>
        out.push(L.node(<span><span className="text-white/40">{i === arr.length - 1 ? "└── " : "├── "}</span><span className={f.endsWith(".pdf") ? "text-success" : "text-white/80"}>{f}</span></span>)));
      return out;
    },
  },
  cat: {
    group: "linux", desc: "print a file", usage: "cat <file>",
    args: () => ["about.md", "contact.md", "resume.pdf", "projects/shushrutai.md", "devops/Dockerfile"],
    run: (args, ctx) => {
      const f = (args[0] || "").toLowerCase();
      if (!f) return [L.err("usage: cat <file>")];
      if (f.includes("about")) return ctx.commands.about.run([], ctx);
      if (f.includes("contact")) return ctx.commands.contact.run([], ctx);
      if (f.includes("resume")) { window.open(socials.resume, "_blank"); return [L.ok("→ opening resume.pdf")]; }
      if (f.includes("dockerfile")) return ctx.commands.docker.run([], ctx);
      if (f.includes("ci.yml")) return ctx.commands.ci.run([], ctx);
      const pid = resolveProject(f.split("/").pop().replace(".md", ""), projects);
      if (pid) return ctx.commands.explain.run([pid], ctx);
      return [L.err(`cat: ${args[0]}: no such file`)];
    },
  },
  neofetch: {
    group: "linux", desc: "system + author info",
    run: () => [L.node(
      <div className="flex gap-5">
        <pre className="text-cyan leading-tight text-[11px]">{`   ⟨ / ⟩
  ╱     ╲
 │  ◉ ◉  │
  ╲  ▽  ╱
   ╲___╱`}</pre>
        <div className="text-[13px] leading-6">
          <div><span className="text-cyan">{GH_USER}</span>@<span className="text-cyan">engos</span></div>
          <div className="text-white/40">───────────────</div>
          <div><span className="text-violet">host</span> {profile.name}</div>
          <div><span className="text-violet">role</span> {profile.role}</div>
          <div><span className="text-violet">os</span>   EngOS 2.0</div>
          <div><span className="text-violet">shell</span> vansh-sh</div>
          <div><span className="text-violet">stack</span> React · Node · Python · Docker</div>
          <div><span className="text-violet">uptime</span> always shipping</div>
        </div>
      </div>
    )],
  },

  /* ============ CONTEXTUAL ============ */
  open: {
    group: "contextual", desc: "open a project case study", usage: "open <project>",
    args: () => projects.map((p) => p.id),
    run: (args, ctx) => {
      const id = resolveProject(args[0], projects);
      if (!id) return [L.err("usage: open <shushrut|docling|finagent|innomate>")];
      const p = projects.find((x) => x.id === id);
      ctx.navigate(() => ctx.actions.openProject(id), 700);
      return [L.ok(`→ entering ${p.name} case study…`)];
    },
  },
  search: {
    group: "contextual", desc: "search projects & skills", usage: "search <term>",
    run: (args) => {
      const q = (args.join(" ") || "").toLowerCase();
      if (!q) return [L.err("usage: search <term>")];
      const hits = [];
      projects.forEach((p) => {
        const hay = `${p.name} ${p.tag} ${p.summary} ${p.tech.join(" ")}`.toLowerCase();
        if (hay.includes(q)) hits.push(L.node(<span><span className="text-cyan">project</span> <span style={{ color: p.accent }}>{p.name}</span> <span className="text-white/40">— matched "{q}"</span></span>));
      });
      domains.forEach((d) => {
        const hay = `${d.name} ${d.tech.map((t) => t.name).join(" ")} ${d.concepts.join(" ")}`.toLowerCase();
        if (hay.includes(q)) hits.push(L.node(<span><span className="text-violet">domain</span> <span style={{ color: d.color }}>{d.name}</span></span>));
      });
      return hits.length ? [L.head(`results for "${q}"`), ...hits] : [L.muted(`no matches for "${q}"`)];
    },
  },
  recruiter: {
    group: "contextual", desc: "the 30-second pitch for recruiters",
    run: () => [
      L.node(<div className="rounded-lg border border-cyan/30 bg-cyan/5 p-3">
        <div className="text-cyan font-semibold mb-1">▎ Recruiter Briefing — {profile.name}</div>
        <div className="text-white/85 text-sm">{profile.role} & {profile.subRole}. Ships real products: agentic AI, full-stack, and DevOps.</div>
      </div>),
      L.spacer(), L.accent("highlights", "#00ff9c"),
      ...achievements.map((a) => L.node(<span><span className="text-success">✓ </span>{a.title} <span className="text-white/40">— {a.org}</span></span>)),
      L.spacer(), L.accent("proof of work", "#00e5ff"),
      ...projects.map((p) => L.node(<span><span style={{ color: p.accent }}>◈ {p.name}</span> <span className="text-white/40">— {caseStudies[p.id]?.mission}</span></span>)),
      L.spacer(),
      L.node(<span>next: <span className="text-cyan">resume</span> · <span className="text-cyan">contact</span> · <span className="text-cyan">open shushrut</span></span>),
    ],
  },
  assistant: {
    group: "contextual", desc: "ask the workspace assistant", usage: "assistant <question>",
    run: (args) => {
      const q = args.join(" ").toLowerCase();
      if (!q) return [L.node(<span><span className="text-violet">◇ assistant</span> <span className="text-white/70">— ask me anything. e.g. `assistant what did you build with AI?`</span></span>),
        L.muted("try: 'best project', 'devops', 'hire', 'ai'")];
      let a;
      if (/hire|recruit|job|available/.test(q)) a = "Vansh is open to SDE / DevOps roles. Run `recruiter` for the pitch, `resume` for the CV, `contact` to reach him.";
      else if (/ai|agent|llm|gemini/.test(q)) a = "AI is his core: multi-agent systems on Gemini & LLMs — ShushrutAI, DocLing, FinAgent. Try `agents` or `open shushrut`.";
      else if (/devops|docker|deploy|ci/.test(q)) a = "Docker + Git in production; CI/CD actively learning. Try `docker`, `deploy`, or `ci`.";
      else if (/best|favorite|proud/.test(q)) a = "ShushrutAI — an agentic dermatology platform (Gemini 2.0). Try `open shushrut`.";
      else if (/stack|tech|skill/.test(q)) a = "React · Node · Python · MongoDB · Docker. Run `stack` or `skills`.";
      else a = "I can route you anywhere. Try `help`, or ask about 'ai', 'devops', 'projects', or 'hiring'.";
      return [L.node(<span><span className="text-violet">◇ </span><span className="text-white/85">{a}</span></span>)];
    },
  },

  /* ============ EASTER EGGS (hidden) ============ */
  sudo: {
    group: "meta", hidden: true, desc: "superuser",
    run: (args, ctx) => {
      const rest = args.join(" ").toLowerCase();
      if (rest.includes("hire vansh")) {
        ctx.navigate(() => ctx.actions.openZone("contact"), 1100);
        return [L.ok("[sudo] authenticating… ACCESS GRANTED."), L.node(<span className="text-success">✓ Excellent decision. Routing you to contact…</span>)];
      }
      return [L.err("sudo: permission is earned, not granted."), L.muted("hint: try `sudo hire vansh`")];
    },
  },
  matrix: {
    group: "meta", hidden: true, desc: "there is no spoon",
    run: (a, ctx) => { ctx.actions.setMatrix(true); setTimeout(() => ctx.actions.setMatrix(false), 6000); return [L.ok("wake up, Neo… (6s)")]; },
  },
  konami: {
    group: "meta", hidden: true, desc: "↑↑↓↓←→←→BA",
    run: (a, ctx) => { ctx.actions.setMatrix(true); setTimeout(() => ctx.actions.setMatrix(false), 6000); return [L.ok("30 lives granted. 🕹️")]; },
  },
  coffee: {
    group: "meta", hidden: true, desc: "fuel",
    run: () => [L.ascii(
`      ( (
       ) )
    ........
    |      |]
    \\      /
     '----'   ☕ brewing... deploy imminent.`)],
  },
  joke: { group: "meta", hidden: true, desc: "dev humor", run: () => [L.text(JOKES[Math.floor(Math.random() * JOKES.length)])] },
  motivation: { group: "meta", hidden: true, desc: "a nudge", run: () => [L.accent(QUOTES[Math.floor(Math.random() * QUOTES.length)], "#00ff9c")] },
};

function ghError(e) {
  if (e.message === "rate-limit")
    return [L.warn("GitHub rate limit reached (unauthenticated). Try again in a bit."), L.muted(`meanwhile: github.com/${GH_USER}`)];
  return [L.err("couldn't reach GitHub right now."), L.muted(`open directly: github.com/${GH_USER}`)];
}

/* alias map → canonical command */
export const ALIASES = {
  ll: "ls", dir: "ls", man: "help", "?": "help", cls: "clear",
  gh: "github", cv: "resume", me: "about", who: "whoami",
  menu: "guide", tour: "guide", start: "guide", "help()": "help",
};
