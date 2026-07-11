import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Star, BadgeCheck, Activity } from "lucide-react";
import Overlay from "../Overlay";
import HudCard from "../ui/HudCard";
import { achievements, stats, certifications } from "../../data/portfolio";

const KIND = { trophy: Trophy, star: Star, badge: BadgeCheck };

/** Count-up used in the stat gauges. */
function Counter({ to, suffix, decimals = 0 }) {
  const [n, setN] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const dur = 1100, t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      setN(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [to]);
  return <>{decimals ? n.toFixed(decimals) : Math.round(n).toLocaleString()}{suffix}</>;
}

/** ZONE 8 — Hall of Records: HUD gauges + mechanical trophy capsules. */
export default function Achievements() {
  return (
    <Overlay kicker="Zone 08 — Hall of Records" title="Records & Honors" accent="#00e5ff">
      {/* stat gauges */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="module holo-scan gauge" style={{ "--mc": "#00e5ff" }}
          >
            <div className="font-display text-3xl font-bold text-gradient">
              <Counter to={s.value} suffix={s.suffix} decimals={s.decimals || 0} />
            </div>
            <div className="mt-1 mono-id">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* honor cards */}
      <div className="mb-3 mt-8 mono-id text-cyan">◈ Honors</div>
      <div className="grid gap-4 sm:grid-cols-2">
        {achievements.map((a, i) => {
          const Icon = KIND[a.kind] || Trophy;
          const accent = i % 2 ? "#6c63ff" : "#00e5ff";
          return (
            <motion.div key={a.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <HudCard
                accent={accent}
                kicker="Achievement"
                title={a.title}
                subtitle={a.org}
                badge={
                  <span className="tech-box float-y" style={{ "--mc": accent, width: 40, height: 40 }}>
                    <Icon size={19} style={{ color: accent }} />
                  </span>
                }
              >
                <div className="flex items-center justify-between border-t border-white/6 pt-3">
                  <span className="mono-id">Recorded</span>
                  <span className="font-mono text-lg font-bold" style={{ color: accent }}>{a.year}</span>
                </div>
              </HudCard>
            </motion.div>
          );
        })}
      </div>

      {/* certifications as data slats */}
      <div className="mb-3 mt-8 mono-id text-cyan">◈ Certifications</div>
      <div className="grid gap-2 sm:grid-cols-2">
        {certifications.map((c, i) => (
          <motion.div
            key={c}
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className="module flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/80" style={{ "--mc": "#00ffb2" }}
          >
            <BadgeCheck size={15} className="shrink-0 text-success" /> {c}
          </motion.div>
        ))}
      </div>

      {/* contribution telemetry */}
      <div className="mb-3 mt-8 flex items-center gap-2 mono-id text-cyan"><Activity size={13} /> Contribution telemetry</div>
      <div className="module holo-scan overflow-x-auto p-5" style={{ "--mc": "#00ffb2" }}>
        <div className="flex min-w-max gap-[3px]">
          {Array.from({ length: 40 }).map((_, x) => (
            <div key={x} className="flex flex-col gap-[3px]">
              {Array.from({ length: 7 }).map((_, y) => {
                const v = Math.random();
                const a = v > 0.82 ? 0.9 : v > 0.6 ? 0.55 : v > 0.35 ? 0.28 : 0.08;
                return <span key={y} className="h-3 w-3" style={{ background: `rgba(0,255,178,${a})` }} />;
              })}
            </div>
          ))}
        </div>
      </div>
    </Overlay>
  );
}
