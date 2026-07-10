import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import { X } from "lucide-react";
import { useStore } from "../../store/useStore";
import { COMMANDS, ALIASES, GROUPS, groupView, suggest } from "../../data/terminalCommands";
import { GH_USER } from "../../lib/github";
import { uid } from "../../lib/term";

const BOOT = [
  { t: "booting EngOS 2.0 …", ok: false },
  { t: "mounting engineering filesystem", ok: true },
  { t: "starting workspace daemon", ok: true },
  { t: "loading modules: nav · eng · github · ai · devops · linux", ok: true },
  { t: `establishing github uplink @${GH_USER}`, ok: true },
  { t: "input systems online", ok: true },
];

const commonPrefix = (arr) => {
  if (!arr.length) return "";
  let p = arr[0];
  for (const s of arr) { while (!s.startsWith(p)) p = p.slice(0, -1); }
  return p;
};

/** ZONE 7 — Terminal: the workspace's central command interface. */
export default function Terminal() {
  const { closeZone, openZone, openProject, setMatrix, toggleTheme, term, setTerm } = useStore();

  const [lines, setLines] = useState(() => (term.booted ? term.lines : []));
  const [input, setInput] = useState("");
  const [caret, setCaret] = useState(0);
  const [booting, setBooting] = useState(!term.booted);
  const [bootStep, setBootStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [histIdx, setHistIdx] = useState(-1);
  const [cwd, setCwd] = useState("");

  const path = `~/portfolio${cwd ? "/" + cwd : ""}`;

  const historyRef = useRef(term.history || []);
  const linesRef = useRef(lines);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const navTimer = useRef(null);

  useEffect(() => { linesRef.current = lines; }, [lines]);

  // persist the session on unmount so reopening keeps context
  useEffect(() => () => {
    setTerm({ lines: linesRef.current, history: historyRef.current, booted: true });
  }, [setTerm]);

  const append = (arr) =>
    setLines((prev) => [...prev, ...arr.filter(Boolean).map((l) => ({ ...l, id: uid() }))]);

  const makeCtx = () => ({
    actions: { openZone, openProject, setMatrix, toggleTheme },
    commands: COMMANDS,
    history: historyRef.current,
    cwd,
    setCwd,
    clear: () => setLines([]),
    print: (l) => append([l]),
    sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
    navigate: (fn, delay = 650) => { navTimer.current = setTimeout(fn, delay); },
  });

  /* ---------- boot ---------- */
  useEffect(() => {
    if (!booting) return;
    if (bootStep > BOOT.length) return;
    const id = setTimeout(() => setBootStep((s) => s + 1), bootStep === 0 ? 250 : 260);
    return () => clearTimeout(id);
  }, [booting, bootStep]);

  useEffect(() => {
    if (booting && bootStep === BOOT.length) {
      // move the boot log into scrollback so it persists after the prompt appears
      append([
        ...BOOT.map((b) => ({
          type: "node",
          node: (
            <span>
              {b.ok && <span className="text-success">[ OK ] </span>}
              <span className={b.ok ? "text-white/70" : "text-cyan"}>{b.t}</span>
            </span>
          ),
        })),
        { type: "spacer" },
        { type: "node", node: (
          <span>Welcome to <span className="text-cyan">EngOS</span> — new here? Run{" "}
            <span className="text-cyan">guide</span> for the tour, or{" "}
            <span className="text-cyan">help</span> for categories. First time? Try{" "}
            <span className="text-cyan">recruiter</span>.</span>
        ) },
      ]);
      setBooting(false);
      setTerm({ booted: true });
    }
  }, [booting, bootStep]); // eslint-disable-line

  /* ---------- run a command ---------- */
  const run = async (raw) => {
    append([{ type: "cmd", text: raw, path }]);
    const trimmed = raw.trim();
    if (!trimmed) return;
    historyRef.current = [...historyRef.current, trimmed];
    setHistIdx(-1);
    const parts = trimmed.split(/\s+/);
    let name = parts[0].toLowerCase();
    name = ALIASES[name] || name;
    const cmd = COMMANDS[name];
    if (!cmd) {
      // typing a category name opens that category (like `cd <name>`)
      if (GROUPS[name]) { setCwd(name); const out = groupView(name, COMMANDS); if (out) append(out); return; }
      const s = suggest(parts[0], COMMANDS);
      append([
        { type: "error", text: `command not found: ${parts[0]}` },
        s.length
          ? { type: "muted", text: `did you mean: ${s.join(", ")}?` }
          : { type: "muted", text: "type `help` or `guide` to get started" },
      ]);
      return;
    }
    try {
      setRunning(true);
      const res = cmd.run(parts.slice(1), makeCtx());
      const out = res instanceof Promise ? await res : res;
      if (out) append(out);
    } catch (e) {
      append([{ type: "error", text: `error: ${e?.message || e}` }]);
    } finally {
      setRunning(false);
    }
  };

  /* ---------- tab autocomplete ---------- */
  const complete = () => {
    const val = input;
    const parts = val.split(/\s+/);
    const publicNames = [...Object.keys(COMMANDS).filter((c) => !COMMANDS[c].hidden), ...Object.keys(GROUPS), ...Object.keys(ALIASES)];

    if (parts.length <= 1) {
      const pre = parts[0] || "";
      const matches = publicNames.filter((n) => n.startsWith(pre)).sort();
      if (!matches.length) return;
      if (matches.length === 1) { setInput(matches[0] + " "); return; }
      append([{ type: "cmd", text: val }, { type: "node", node: <span className="text-white/60">{matches.join("  ")}</span> }]);
      setInput(commonPrefix(matches));
    } else {
      const cmd = COMMANDS[ALIASES[parts[0]] || parts[0]];
      const cands = cmd?.args ? cmd.args(makeCtx()) : [];
      const pre = parts[parts.length - 1];
      const matches = cands.filter((c) => c.startsWith(pre)).sort();
      if (!matches.length) return;
      const head = parts.slice(0, -1).join(" ");
      if (matches.length === 1) { setInput(`${head} ${matches[0]} `); return; }
      append([{ type: "cmd", text: val }, { type: "node", node: <span className="text-white/60">{matches.join("  ")}</span> }]);
      setInput(`${head} ${commonPrefix(matches)}`);
    }
  };

  /* ---------- keyboard ---------- */
  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const v = input; setInput(""); setCaret(0);
      run(v);
    } else if (e.key === "Tab") {
      e.preventDefault(); complete();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const h = historyRef.current;
      if (!h.length) return;
      const ni = histIdx < 0 ? h.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(ni); setInput(h[ni]); queueMicrotask(() => moveCaretEnd());
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const h = historyRef.current;
      const ni = histIdx + 1;
      if (histIdx < 0) return;
      if (ni >= h.length) { setHistIdx(-1); setInput(""); }
      else { setHistIdx(ni); setInput(h[ni]); }
    } else if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault(); setLines([]);
    } else if (e.ctrlKey && e.key.toLowerCase() === "c") {
      e.preventDefault(); append([{ type: "cmd", text: input + " ^C" }]); setInput(""); setCaret(0);
    } else if (e.ctrlKey && e.key.toLowerCase() === "u") {
      e.preventDefault(); setInput(""); setCaret(0);
    } else if (e.ctrlKey && e.key.toLowerCase() === "a") {
      e.preventDefault(); inputRef.current?.setSelectionRange(0, 0); setCaret(0);
    } else if (e.ctrlKey && e.key.toLowerCase() === "e") {
      e.preventDefault(); moveCaretEnd();
    } else if (e.key === "Escape") {
      closeZone();
    }
  };

  const moveCaretEnd = () => {
    const el = inputRef.current; if (!el) return;
    const n = el.value.length; el.setSelectionRange(n, n); setCaret(n);
  };
  const syncCaret = () => setCaret(inputRef.current?.selectionStart ?? 0);

  /* ---------- autoscroll + focus ---------- */
  useEffect(() => { bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight }); }, [lines, bootStep, running]);
  useEffect(() => { if (!booting) inputRef.current?.focus(); }, [booting]);
  useEffect(() => () => clearTimeout(navTimer.current), []);

  const pre = input.slice(0, caret);
  const curChar = input[caret] ?? " ";
  const post = input.slice(caret + 1);

  return (
    <motion.div
      className="pointer-events-auto fixed inset-0 z-40 flex items-center justify-center p-3 md:p-8"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && closeZone()}
    >
      <motion.div
        className="term-window flex h-[86vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl"
        initial={{ opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }} transition={{ type: "spring", stiffness: 260, damping: 30 }}
      >
        {/* title bar */}
        <div className="flex items-center gap-2 border-b border-white/8 bg-white/[0.03] px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-2 flex-1 text-center font-mono text-xs text-muted">
            {GH_USER}@workspace: ~/portfolio — vansh-sh
          </span>
          <button onClick={closeZone} className="text-muted hover:text-white" aria-label="Close" data-cursor="hover"><X size={15} /></button>
        </div>

        {/* body */}
        <div
          ref={bodyRef}
          onClick={() => inputRef.current?.focus()}
          className="scroll-area scanline relative flex-1 overflow-y-auto bg-black/50 p-4 font-mono text-[13px] leading-6"
        >
          {/* boot */}
          {booting && (
            <div>
              {BOOT.slice(0, bootStep).map((b, i) => (
                <div key={i}>
                  {b.ok && <span className="text-success">[ OK ] </span>}
                  <TypedText text={b.t} className={b.ok ? "text-white/70" : "text-cyan"} />
                </div>
              ))}
              <span className="term-caret">&nbsp;</span>
            </div>
          )}

          {/* output */}
          {lines.map((l) => <OutputLine key={l.id} line={l} />)}

          {/* prompt */}
          {!booting && (
            <div className="mt-1 flex items-start gap-2">
              <Prompt path={path} />
              <div className="relative min-w-0 flex-1">
                <div className="whitespace-pre-wrap break-words text-white">
                  {pre}
                  <span className={running ? "term-caret term-caret--busy" : "term-caret"}>{curChar}</span>
                  {post}
                </div>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => { setInput(e.target.value); syncCaret(); }}
                  onKeyDown={onKeyDown}
                  onKeyUp={syncCaret}
                  onClick={syncCaret}
                  spellCheck={false} autoComplete="off" autoCapitalize="off"
                  className="absolute inset-0 h-full w-full resize-none bg-transparent text-transparent caret-transparent outline-none"
                  aria-label="terminal input"
                />
              </div>
            </div>
          )}
        </div>

        {/* hint bar */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-white/8 bg-white/[0.02] px-4 py-2 font-mono text-[10px] text-muted">
          <span><span className="text-cyan">⇥</span> autocomplete</span>
          <span><span className="text-cyan">↑↓</span> history</span>
          <span><span className="text-cyan">^L</span> clear</span>
          <span><span className="text-cyan">esc</span> exit</span>
          <span className="ml-auto">start with <span className="text-cyan">guide</span> · <span className="text-cyan">ls</span> · <span className="text-cyan">recruiter</span></span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
function Prompt({ path = "~/portfolio" }) {
  return (
    <span className="shrink-0 whitespace-nowrap select-none">
      <span className="text-success">{GH_USER}@core</span>
      <span className="text-muted">:</span>
      <span className="text-cyan">{path}</span>
      <span className="text-violet"> ➜ </span>
    </span>
  );
}

function TypedText({ text, speed = 12, className }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= text.length) return;
    const id = setTimeout(() => setN(n + 1), speed);
    return () => clearTimeout(id);
  }, [n, text, speed]);
  return <span className={className}>{text.slice(0, n)}</span>;
}

const CLR = {
  text: "text-white/85", muted: "text-muted", success: "text-success",
  error: "text-[#ff6b6b]", warn: "text-[#ffb454]", accent: "text-cyan",
};

function OutputLine({ line }) {
  const base = "min-h-[2px]";
  const content = (() => {
    switch (line.type) {
      case "cmd":
        return (<div className="flex gap-2"><Prompt path={line.path} /><span className="text-white break-words">{line.text}</span></div>);
      case "head":
        return <div className="mt-1 font-semibold text-cyan">▎ {line.text}</div>;
      case "ascii":
        return <pre className="whitespace-pre text-cyan leading-tight">{line.text}</pre>;
      case "spacer":
        return <div className="h-2" />;
      case "accent":
        return <div style={{ color: line.color || "#00e5ff" }}>{line.text}</div>;
      case "node":
        return <div>{line.node}</div>;
      case "link":
        return <a href={line.href} target="_blank" rel="noreferrer" className="text-cyan underline" data-cursor="hover">{line.label}</a>;
      case "code":
        return <CodeBlock code={line.text} lang={line.lang} />;
      default:
        return <div className={`${CLR[line.type] || "text-white/85"} break-words`}>{line.text}</div>;
    }
  })();
  return (
    <motion.div initial={{ opacity: 0, y: 2 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }} className={base}>
      {content}
    </motion.div>
  );
}

function CodeBlock({ code, lang }) {
  return (
    <Highlight theme={themes.vsDark} code={code.trim()} language={lang}>
      {({ tokens, getLineProps, getTokenProps }) => (
        <pre className="my-1 overflow-x-auto rounded-lg border border-white/8 bg-black/60 p-3 text-[12px] leading-5">
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, k) => <span key={k} {...getTokenProps({ token })} />)}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
