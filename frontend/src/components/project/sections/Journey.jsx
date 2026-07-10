import { motion } from "framer-motion";
import { SectionHeader } from "../ui";

/** Development journey: Research → Design → Dev → Testing → Deploy → Reflection. */
export default function Journey({ data }) {
  const accent = data.accent;
  return (
    <div>
      <SectionHeader
        index={4}
        kicker="Development Journey"
        title="From question to shipped"
        sub="The path the project actually took — not a straight line, but a deliberate one."
      />

      <div className="relative pl-8">
        {/* spine */}
        <div className="absolute bottom-2 left-[11px] top-2 w-px" style={{ background: `linear-gradient(${accent}, transparent)` }} />
        {data.journey.map((p, i) => (
          <motion.div
            key={p.phase}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: i * 0.05 }}
            className="relative mb-7 last:mb-0"
          >
            <span
              className="absolute -left-[27px] top-1 grid h-6 w-6 place-items-center rounded-full border-2 bg-[#050505] font-mono text-[10px]"
              style={{ borderColor: accent, color: accent }}
            >
              {i + 1}
            </span>
            <h3 className="font-display text-lg font-semibold" style={{ color: accent }}>{p.phase}</h3>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-white/80">{p.detail}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
