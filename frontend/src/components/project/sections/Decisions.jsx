import { motion } from "framer-motion";
import { Check, Scale, GitCompareArrows } from "lucide-react";
import { SectionHeader } from "../ui";

/** Engineering decisions: why each tech, the trade-off, the alternative. */
export default function Decisions({ data }) {
  const accent = data.accent;
  return (
    <div>
      <SectionHeader
        index={3}
        kicker="Engineering Decisions"
        title="Why it's built this way"
        sub="Every stack choice is a trade-off. Here's the reasoning, honestly — including what was left on the table."
      />

      <div className="grid gap-4">
        {data.decisions.map((d, i) => (
          <motion.div
            key={d.tech}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-6"
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: accent, boxShadow: `0 0 10px ${accent}` }} />
              <h3 className="font-display text-xl font-semibold">{d.tech}</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Field icon={Check} label="Why" color={accent} body={d.why} />
              <Field icon={Scale} label="Trade-off" color="#ffb454" body={d.tradeoff} />
              <Field icon={GitCompareArrows} label="Alternative" color="#a0a0a0" body={d.alt} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, color, body }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest" style={{ color }}>
        <Icon size={13} /> {label}
      </div>
      <p className="text-sm leading-relaxed text-white/75">{body}</p>
    </div>
  );
}
