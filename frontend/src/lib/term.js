/** Line factory helpers for terminal output. Each returns a line object
 *  the <Terminal/> renderer knows how to draw. */
let _id = 0;
export const uid = () => `l${++_id}`;

export const L = {
  text: (text) => ({ type: "text", text }),
  muted: (text) => ({ type: "muted", text }),
  ok: (text) => ({ type: "success", text }),
  err: (text) => ({ type: "error", text }),
  warn: (text) => ({ type: "warn", text }),
  accent: (text, color) => ({ type: "accent", text, color }),
  head: (text) => ({ type: "head", text }),
  ascii: (text) => ({ type: "ascii", text }),
  node: (node) => ({ type: "node", node }),
  spacer: () => ({ type: "spacer" }),
  cmd: (text) => ({ type: "cmd", text }),
  code: (text, lang = "bash") => ({ type: "code", text, lang }),
  link: (label, href) => ({ type: "link", label, href }),
};

/** Resolve a fuzzy project name/alias to a project id. */
export function resolveProject(term, projects) {
  if (!term) return null;
  const t = term.toLowerCase();
  const alias = {
    hushrut: "shushrutai", shushrut: "shushrutai", shushrutai: "shushrutai", derma: "shushrutai",
    docling: "docling", doc: "docling",
    finagent: "finagent", fin: "finagent", finance: "finagent",
    innomate: "innomate", inno: "innomate",
  };
  if (alias[t]) return alias[t];
  const hit = projects.find((p) => p.id === t || p.name.toLowerCase() === t);
  return hit?.id || null;
}
