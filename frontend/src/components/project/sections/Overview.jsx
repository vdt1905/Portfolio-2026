import { motion } from "framer-motion";
import { Activity, UserRound, CalendarRange } from "lucide-react";
import { SectionHeader } from "../ui";

const item = {
  initial: { opacity: 0, y: 18 },
  animate: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, type: "spring", stiffness: 300, damping: 26 } }),
};

export default function Overview({ data }) {
  const meta = [
    { icon: Activity, label: "Status", value: data.status },
    { icon: UserRound, label: "Role", value: data.role },
    { icon: CalendarRange, label: "Timeline", value: data.timeline },
  ];
  return (
    <div>
      <SectionHeader index={1} kicker="Overview" title={data.name} />

      <motion.p
        custom={0} variants={item} initial="initial" animate="animate"
        className="max-w-3xl font-display text-2xl leading-snug text-white/90 md:text-3xl"
      >
        {data.mission}
      </motion.p>
      <motion.p custom={1} variants={item} initial="initial" animate="animate" className="mt-4 max-w-2xl text-muted">
        {data.summary}
      </motion.p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {meta.map((m, i) => (
          <motion.div key={m.label} custom={i + 2} variants={item} initial="initial" animate="animate" className="glass rounded-2xl p-5">
            <div className="mb-2 flex items-center gap-2 text-muted">
              <m.icon size={15} style={{ color: data.accent }} />
              <span className="font-mono text-[11px] uppercase tracking-widest">{m.label}</span>
            </div>
            <div className="font-display text-lg font-semibold">{m.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6">
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">Technologies</div>
        <div className="flex flex-wrap gap-2">
          {data.tech.map((t, i) => (
            <motion.span
              key={t} custom={i} variants={item} initial="initial" animate="animate"
              className="rounded-lg px-3 py-1.5 text-sm font-medium"
              style={{ color: data.accent, background: `${data.accent}14`, border: `1px solid ${data.accent}30` }}
            >
              {t}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}
