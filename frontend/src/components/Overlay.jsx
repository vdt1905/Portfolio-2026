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
        className="glass-strong scroll-area relative flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl"
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
      >
        {/* accent header line */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />

        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 px-6 pb-4 pt-5 md:px-10 md:pt-7">
          <div>
            {kicker && (
              <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.25em]" style={{ color: accent }}>
                {kicker}
              </div>
            )}
            <h2 className="font-display text-2xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          </div>
          <button onClick={closeZone} className="hud-icon shrink-0" aria-label="Close" data-cursor="hover">
            <X size={16} />
          </button>
        </header>

        <div className="scroll-area flex-1 overflow-y-auto px-6 pb-10 md:px-10">{children}</div>
      </motion.section>
    </motion.div>
  );
}
