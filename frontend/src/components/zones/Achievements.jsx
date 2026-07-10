import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Star, BadgeCheck } from "lucide-react";
import Overlay from "../Overlay";
import { achievements, stats, certifications } from "../../data/portfolio";

const KIND = { trophy: Trophy, star: Star, badge: BadgeCheck };

/** Count-up number used in the stat holograms. */
function Counter({ to, suffix, decimals = 0 }) {
  const [n, setN] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const dur = 1100;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(to * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [to]);
  const display = decimals
    ? n.toFixed(decimals)
    : Math.round(n).toLocaleString();
  return <>{display}{suffix}</>;
}

/** ZONE 8 — Achievements. Floating holographic trophies + animated stats. */
export default function Achievements() {
  return (
    <Overlay kicker="Zone 08 — Hall of Records" title="Achievements" accent="#00e5ff">
      {/* stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-2xl p-5 text-center"
          >
            <div className="font-display text-3xl font-bold text-gradient">
              <Counter to={s.value} suffix={s.suffix} decimals={s.decimals || 0} />
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-wider text-muted">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* trophies */}
      <div className="mt-8 mb-3 font-mono text-xs uppercase tracking-[0.25em] text-muted">honors</div>
      <div className="grid gap-4 sm:grid-cols-2">
        {achievements.map((a, i) => {
          const Icon = KIND[a.kind] || Trophy;
          return (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="group relative flex items-center gap-4 overflow-hidden rounded-2xl glass p-5"
            >
              <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-cyan/10 blur-2xl transition-opacity group-hover:opacity-70" />
              <div className="float-y grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-cyan/30 bg-cyan/5 text-cyan">
                <Icon size={24} />
              </div>
              <div>
                <div className="font-display text-lg font-semibold">{a.title}</div>
                <div className="text-sm text-muted">{a.org} · {a.year}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* certifications */}
      <div className="mt-8 mb-3 font-mono text-xs uppercase tracking-[0.25em] text-muted">certifications</div>
      <div className="grid gap-2 sm:grid-cols-2">
        {certifications.map((c, i) => (
          <motion.div
            key={c}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-2.5 rounded-xl border border-white/6 bg-white/[0.02] px-4 py-2.5 text-sm text-white/80"
          >
            <BadgeCheck size={15} className="shrink-0 text-cyan" /> {c}
          </motion.div>
        ))}
      </div>

      {/* contribution graph */}
      <div className="mt-8 mb-3 font-mono text-xs uppercase tracking-[0.25em] text-muted">contribution graph</div>
      <div className="glass overflow-x-auto rounded-2xl p-5">
        <div className="flex min-w-max gap-[3px]">
          {Array.from({ length: 40 }).map((_, x) => (
            <div key={x} className="flex flex-col gap-[3px]">
              {Array.from({ length: 7 }).map((_, y) => {
                const v = Math.random();
                const a = v > 0.82 ? 0.9 : v > 0.6 ? 0.55 : v > 0.35 ? 0.28 : 0.08;
                return (
                  <span key={y} className="h-3 w-3 rounded-[3px]" style={{ background: `rgba(0,255,156,${a})` }} />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </Overlay>
  );
}
