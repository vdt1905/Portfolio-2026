import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Star, BadgeCheck, Activity } from "lucide-react";
import Overlay from "../Overlay";
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

      {/* trophy capsules */}
      <div className="mb-3 mt-8 mono-id text-cyan">◈ Honors — hover to unseal</div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {achievements.map((a, i) => {
          const Icon = KIND[a.kind] || Trophy;
          const accent = i % 2 ? "#6c63ff" : "#00e5ff";
          return (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="capsule holo-scan min-h-[184px]" style={{ "--mc": accent }}
            >
              {/* medallion hidden under the lid */}
              <div className="absolute inset-x-0 top-0 z-[1] grid h-[42%] place-items-center">
                <div className="float-y grid h-12 w-12 place-items-center rounded-full border" style={{ borderColor: `${accent}55`, background: `${accent}12`, color: accent }}>
                  <Icon size={22} />
                </div>
              </div>
              <div className="capsule__lid z-[3]">
                <div className="grid h-full place-items-center">
                  <span className="mono-id" style={{ color: accent }}>SEALED</span>
                </div>
              </div>
              <div className="capsule__seam z-[4]" />
              {/* revealed record */}
              <div className="relative z-[2] mt-[42%] p-4 text-center">
                <div className="font-display text-sm font-semibold leading-tight">{a.title}</div>
                <div className="mt-1 text-xs text-muted">{a.org}</div>
                <div className="mt-1 font-mono text-[10px]" style={{ color: accent }}>{a.year}</div>
              </div>
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
