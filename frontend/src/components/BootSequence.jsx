import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store/useStore";
import { bootLines, profile } from "../data/portfolio";

/**
 * ZONE 1 — SYSTEM BOOT
 * Dark screen -> glowing dot -> terminal boot log -> "Enter workspace".
 * Flipping `booted` triggers the camera fly-in handled by CameraRig.
 */
export default function BootSequence() {
  const setBooted = useStore((s) => s.setBooted);
  const reducedMotion = useStore((s) => s.reducedMotion);
  const [phase, setPhase] = useState("dot"); // dot -> log -> ready -> gone
  const [lines, setLines] = useState([]);
  const [dismissed, setDismissed] = useState(false);
  const timers = useRef([]);

  useEffect(() => {
    const add = (fn, ms) => {
      const id = setTimeout(fn, reducedMotion ? Math.min(ms, 300) : ms);
      timers.current.push(id);
    };

    add(() => setPhase("log"), 1100);

    const step = reducedMotion ? 90 : 520;
    bootLines.forEach((line, i) => {
      add(() => setLines((prev) => [...prev, line]), 1100 + 420 + i * step);
    });
    add(() => setPhase("ready"), 1100 + 420 + bootLines.length * step + 250);

    return () => timers.current.forEach(clearTimeout);
  }, [reducedMotion]);

  const enter = () => {
    setBooted(true);
    setDismissed(true);
  };

  // allow Enter/click to skip once ready
  useEffect(() => {
    if (phase !== "ready") return;
    const onKey = (e) => {
      if (e.key === "Enter") enter();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase]);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#050505]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 1, ease: [0.7, 0, 0.2, 1] }}
        >
          {/* glowing dot */}
          <AnimatePresence>
            {phase === "dot" && (
              <motion.div
                key="dot"
                className="h-3 w-3 rounded-full bg-cyan"
                style={{ boxShadow: "0 0 40px 8px #00e5ff" }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.4, 1], opacity: 1 }}
                exit={{ scale: 40, opacity: 0 }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
              />
            )}
          </AnimatePresence>

          {/* terminal */}
          {phase !== "dot" && (
            <motion.div
              className="w-[min(640px,90vw)] px-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 flex items-center gap-2 font-mono text-xs text-muted">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-2 opacity-70">workspace — boot</span>
              </div>

              <div className="font-mono text-sm leading-7">
                {lines.map((l, i) => {
                  const done = l === "Loading Complete.";
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={done ? "text-success" : "text-cyan/90"}
                    >
                      <span className="mr-2 text-muted">{done ? "✓" : "›"}</span>
                      {l}
                    </motion.div>
                  );
                })}
                {phase !== "ready" && <span className="cursor-blink text-cyan">▊</span>}
              </div>

              <AnimatePresence>
                {phase === "ready" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-10"
                  >
                    <div className="mb-5 font-display text-3xl font-semibold tracking-tight">
                      <span className="text-gradient">{profile.name}</span>
                    </div>
                    <button onClick={enter} className="boot-enter" data-cursor="hover">
                      <span>Enter Workspace</span>
                      <span className="boot-enter__arrow">↵</span>
                    </button>
                    <p className="mt-4 font-mono text-xs text-muted">
                      press <span className="text-cyan">enter</span> or click to continue
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
