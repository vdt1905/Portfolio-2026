import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import { Folder, FolderOpen, FileCode2, Info } from "lucide-react";
import { SectionHeader } from "../ui";

/** Code Explorer: interactive folder tree + syntax-highlighted snippets. */
export default function CodeExplorer({ data }) {
  const accent = data.accent;
  const { tree, snippets } = data.code;
  const firstWithSnippet = useMemo(() => snippets[0]?.id, [snippets]);
  const [active, setActive] = useState(firstWithSnippet);
  const snippet = snippets.find((s) => s.id === active);

  return (
    <div>
      <SectionHeader
        index={7}
        kicker="Code Explorer"
        title="Inside the codebase"
        sub="Browse the structure. Files with a highlight open a real snippet and the reasoning behind it."
      />

      <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
        {/* tree */}
        <div className="module holo-scan p-3 font-mono text-sm">
          <Tree nodes={tree} accent={accent} active={active} onPick={setActive} depth={0} />
        </div>

        {/* snippet */}
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            {snippet ? (
              <motion.div
                key={snippet.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <div className="flex items-center gap-2 rounded-t-2xl border border-b-0 border-white/8 bg-black/50 px-4 py-2.5 font-mono text-xs text-muted">
                  <FileCode2 size={13} style={{ color: accent }} />
                  {snippet.file}
                  <span className="ml-auto rounded px-2 py-0.5" style={{ color: accent, background: `${accent}14` }}>
                    {snippet.lang}
                  </span>
                </div>
                <Highlight theme={themes.vsDark} code={snippet.code.trim()} language={snippet.lang}>
                  {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre
                      className={`${className} scroll-area overflow-x-auto rounded-b-2xl border border-t-0 border-white/8 p-4 text-[13px] leading-6`}
                      style={{ ...style, background: "rgba(0,0,0,0.55)" }}
                    >
                      {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line })}>
                          <span className="mr-4 inline-block w-5 select-none text-right text-white/25">{i + 1}</span>
                          {line.map((token, k) => (
                            <span key={k} {...getTokenProps({ token })} />
                          ))}
                        </div>
                      ))}
                    </pre>
                  )}
                </Highlight>
                <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-white/6 bg-white/[0.02] p-4">
                  <Info size={15} className="mt-0.5 shrink-0" style={{ color: accent }} />
                  <p className="text-sm leading-relaxed text-white/80">{snippet.note}</p>
                </div>
              </motion.div>
            ) : (
              <div className="grid h-full min-h-40 place-items-center module holo-scan text-sm text-muted">
                Select a highlighted file to view its code.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Tree({ nodes, accent, active, onPick, depth }) {
  return (
    <ul style={{ paddingLeft: depth ? 14 : 0 }}>
      {nodes.map((n) => (
        <TreeNode key={n.name} node={n} accent={accent} active={active} onPick={onPick} depth={depth} />
      ))}
    </ul>
  );
}

function TreeNode({ node, accent, active, onPick, depth }) {
  const [open, setOpen] = useState(true);
  if (node.type === "folder") {
    return (
      <li>
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left text-white/70 hover:text-white"
          data-cursor="hover"
        >
          {open ? <FolderOpen size={14} style={{ color: accent }} /> : <Folder size={14} style={{ color: accent }} />}
          {node.name}
        </button>
        {open && <Tree nodes={node.children} accent={accent} active={active} onPick={onPick} depth={depth + 1} />}
      </li>
    );
  }
  const selectable = !!node.snippet;
  const isActive = node.snippet === active;
  return (
    <li>
      <button
        onClick={() => selectable && onPick(node.snippet)}
        disabled={!selectable}
        className={`flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left ${
          selectable ? "hover:text-white" : "cursor-default"
        }`}
        style={{
          color: isActive ? accent : selectable ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.32)",
          background: isActive ? `${accent}12` : "transparent",
        }}
        data-cursor={selectable ? "hover" : undefined}
      >
        <FileCode2 size={13} className="shrink-0" />
        {node.name}
        {selectable && !isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full" style={{ background: accent }} />}
      </button>
    </li>
  );
}
