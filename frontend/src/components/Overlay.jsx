import { useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useStore } from "../store/useStore";

/**
 * Glass panel that content zones render into. Slides up over the
 * (blurred, pushed-back) 3D world. ESC or the close button dismisses.
 */
export default function Overlay({ title, kicker, children, accent = "#00e5ff" }) {
  const closeZone = useStore((s) => s.closeZone);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeZone();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeZone]);

  return (
    <motion.div
      className="pointer-events-auto fixed inset-0 z-40 flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={(e) => e.target === e.currentTarget && closeZone()}
    >
      <motion.section
        className="console holo-scan scroll-area relative flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden"
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        style={{ "--mc": accent }}
      >
        {/* HUD title bar */}
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/8 bg-black/20 px-6 pb-4 pt-5 md:px-10 md:pt-6">
          <div className="pointer-events-none absolute left-0 top-0 h-[2px] w-24" style={{ background: accent, boxShadow: `0 0 12px ${accent}` }} />
          <div className="flex items-start gap-3">
            <span className="mt-1 hidden font-mono text-[10px] leading-4 text-muted md:block">▚▚</span>
            <div>
              {kicker && (
                <div className="mb-1 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em]" style={{ color: accent }}>
                  <span className="inline-block h-1.5 w-1.5" style={{ background: accent, boxShadow: `0 0 6px ${accent}` }} />
                  {kicker}
                </div>
              )}
              <h2 className="font-display text-2xl font-semibold tracking-tight md:text-4xl">{title}</h2>
            </div>
          </div>
          <button onClick={closeZone} className="hud-icon shrink-0" aria-label="Close" data-cursor="hover">
            <X size={16} />
          </button>
        </header>

        <div className="scroll-area flex-1 overflow-y-auto px-6 pb-10 pt-4 md:px-10">{children}</div>
      </motion.section>
    </motion.div>
  );
}
