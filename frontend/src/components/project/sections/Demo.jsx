import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Check, Loader2 } from "lucide-react";
import { SectionHeader } from "../ui";

/**
 * Interactive Demo — a fully client-side simulated run through the
 * project's real workflow. No backend required.
 */
export default function Demo({ data }) {
  const accent = data.accent;
  const steps = data.demo.steps;
  const [current, setCurrent] = useState(-1); // -1 idle, steps.length = done
  const [running, setRunning] = useState(false);
  const timers = useRef([]);

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => () => clear(), []);

  const run = () => {
    clear();
    setRunning(true);
    setCurrent(0);
    steps.forEach((_, i) => {
      timers.current.push(setTimeout(() => setCurrent(i + 1), (i + 1) * 1000));
    });
    timers.current.push(setTimeout(() => setRunning(false), steps.length * 1000));
  };
  const reset = () => { clear(); setRunning(false); setCurrent(-1); };

  const done = current >= steps.length;

  return (
    <div>
      <SectionHeader
        index={8}
        kicker="Interactive Demo"
        title={data.demo.title}
        sub="A simulated end-to-end run of the real workflow — watch the data move through the pipeline."
      />

      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={run}
          disabled={running}
          className="btn-primary disabled:opacity-50"
          data-cursor="hover"
          style={{ background: `linear-gradient(120deg, ${accent}, ${accent}aa)`, boxShadow: `0 0 26px -6px ${accent}` }}
        >
          {running ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
          {running ? "Running…" : done ? "Run again" : "Run demo"}
        </button>
        {current > -1 && (
          <button onClick={reset} className="btn-ghost" data-cursor="hover">
            <RotateCcw size={15} /> Reset
          </button>
        )}
      </div>

      {/* pipeline */}
      <div className="module holo-scan p-5">
        <div className="space-y-2.5">
          {steps.map((s, i) => {
            const state = current > i ? "done" : current === i ? "active" : "idle";
            return (
              <div key={i} className="flex items-center gap-3">
                {/* status node */}
                <div className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full border"
                  style={{
                    borderColor: state === "idle" ? "rgba(255,255,255,0.12)" : accent,
                    background: state === "done" ? accent : state === "active" ? `${accent}22` : "transparent",
                  }}
                >
                  {state === "done" ? (
                    <Check size={15} className="text-black" />
                  ) : state === "active" ? (
                    <Loader2 size={14} className="animate-spin" style={{ color: accent }} />
                  ) : (
                    <span className="font-mono text-[11px] text-muted">{i + 1}</span>
                  )}
                  {state === "active" && (
                    <span className="absolute inset-0 animate-ping rounded-full" style={{ boxShadow: `0 0 0 2px ${accent}` }} />
                  )}
                </div>

                {/* label + output */}
                <div className="flex-1 rounded-xl border px-4 py-2.5 transition-colors"
                  style={{
                    borderColor: state === "idle" ? "rgba(255,255,255,0.06)" : `${accent}30`,
                    background: state === "idle" ? "transparent" : `${accent}0a`,
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className={`font-medium ${state === "idle" ? "text-white/45" : "text-white"}`}>{s.label}</span>
                    <AnimatePresence>
                      {state !== "idle" && (
                        <motion.span
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="font-mono text-[11px]"
                          style={{ color: accent }}
                        >
                          {s.detail}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-2 rounded-xl border px-4 py-3 font-mono text-sm"
              style={{ borderColor: `${accent}40`, background: `${accent}10`, color: accent }}
            >
              <Check size={16} /> Workflow complete — all stages passed.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
