import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Layers } from "lucide-react";
import { SectionHeader } from "../ui";

/**
 * Interactive system architecture: an animated node flow with glowing
 * connections, flowing data packets, hover tooltips, and layer filtering.
 */
export default function Architecture({ data }) {
  const accent = data.accent;
  const { nodes, layers } = data.architecture;
  const [activeLayer, setActiveLayer] = useState(null);
  const [openNode, setOpenNode] = useState(null);
  const [hover, setHover] = useState(null);

  const dim = (n) => activeLayer && n.layer !== activeLayer;

  return (
    <div>
      <SectionHeader
        index={2}
        kicker="System Architecture"
        title="How it fits together"
        sub="Hover a node for its role. Click to expand. Filter by layer to isolate a slice of the system."
      />

      {/* layer filters */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-muted">
          <Layers size={13} /> layers
        </span>
        <button
          onClick={() => setActiveLayer(null)}
          className={`layer-chip ${!activeLayer ? "layer-chip--on" : ""}`}
          data-cursor="hover"
        >
          All
        </button>
        {layers.map((l) => (
          <button
            key={l}
            onClick={() => setActiveLayer(activeLayer === l ? null : l)}
            className={`layer-chip ${activeLayer === l ? "layer-chip--on" : ""}`}
            style={activeLayer === l ? { borderColor: accent, color: accent } : undefined}
            data-cursor="hover"
          >
            {l}
          </button>
        ))}
      </div>

      {/* node flow */}
      <div className="scroll-area overflow-x-auto pb-4">
        <div className="flex min-w-max items-stretch gap-0">
          {nodes.map((n, i) => (
            <div key={n.id} className="flex items-center">
              <motion.button
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setOpenNode(openNode === n.id ? null : n.id)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: dim(n) ? 0.28 : 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                data-cursor="hover"
                className="relative w-40 rounded-2xl border p-4 text-left"
                style={{
                  borderColor: openNode === n.id || hover === n.id ? accent : "rgba(255,255,255,0.09)",
                  background: openNode === n.id ? `${accent}12` : "rgba(255,255,255,0.02)",
                  boxShadow: hover === n.id ? `0 0 30px -8px ${accent}` : "none",
                }}
              >
                <div className="mb-1 font-mono text-[10px] uppercase tracking-widest" style={{ color: accent }}>
                  {n.layer}
                </div>
                <div className="font-display text-sm font-semibold leading-tight">{n.label}</div>
                <div className="mt-1 font-mono text-[10px] text-muted">{n.tech}</div>

                {/* hover tooltip */}
                <AnimatePresence>
                  {hover === n.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-56 -translate-x-1/2 rounded-xl border border-white/10 bg-[#0a0d12]/95 p-3 text-xs leading-relaxed text-white/80 shadow-xl backdrop-blur"
                    >
                      {n.desc}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* connector with flowing packet */}
              {i < nodes.length - 1 && (
                <div className="relative mx-1.5 h-px w-9" style={{ background: `${accent}30` }}>
                  <motion.span
                    className="absolute -top-[3px] h-1.5 w-1.5 rounded-full"
                    style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
                    animate={{ left: ["0%", "100%"], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* expanded node detail */}
      <AnimatePresence mode="wait">
        {openNode && (
          <motion.div
            key={openNode}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 flex items-start gap-3 rounded-2xl glass p-5">
              <ChevronRight size={16} className="mt-0.5 shrink-0" style={{ color: accent }} />
              <div>
                <div className="font-display font-semibold">
                  {nodes.find((n) => n.id === openNode)?.label}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-white/80">
                  {nodes.find((n) => n.id === openNode)?.desc}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
