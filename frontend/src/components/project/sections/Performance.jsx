import { motion } from "framer-motion";
import { SectionHeader, Counter } from "../ui";

/** Performance dashboard: animated counters, commit activity, code makeup. */
export default function Performance({ data }) {
  const accent = data.accent;
  const { counters, commits, languages } = data.perf;
  const max = Math.max(...commits);

  return (
    <div>
      <SectionHeader
        index={6}
        kicker="Performance Dashboard"
        title="The numbers"
        sub="Representative telemetry and repository signals for the project."
      />

      {/* counters */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {counters.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="module holo-scan p-5"
          >
            <div className="font-display text-3xl font-bold" style={{ color: accent }}>
              <Counter to={c.value} suffix={c.suffix} decimals={c.decimals || 0} />
            </div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted">{c.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* commit activity */}
        <div className="module holo-scan p-5">
          <div className="mb-4 font-mono text-[11px] uppercase tracking-widest text-muted">commit activity</div>
          <div className="flex h-32 items-end gap-1.5">
            {commits.map((v, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t"
                style={{ background: `linear-gradient(${accent}, ${accent}30)` }}
                initial={{ height: 0 }}
                whileInView={{ height: `${(v / max) * 100}%` }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04, type: "spring", stiffness: 200, damping: 20 }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between font-mono text-[10px] text-muted">
            <span>12 weeks ago</span><span>now</span>
          </div>
        </div>

        {/* language breakdown */}
        <div className="module holo-scan p-5">
          <div className="mb-4 font-mono text-[11px] uppercase tracking-widest text-muted">codebase</div>
          <div className="mb-4 flex h-2.5 overflow-hidden rounded-full">
            {languages.map((l) => (
              <motion.div
                key={l.name}
                style={{ background: l.color }}
                initial={{ width: 0 }}
                whileInView={{ width: `${l.pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              />
            ))}
          </div>
          <div className="space-y-2">
            {languages.map((l) => (
              <div key={l.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: l.color }} />
                  {l.name}
                </span>
                <span className="font-mono text-muted">{l.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
