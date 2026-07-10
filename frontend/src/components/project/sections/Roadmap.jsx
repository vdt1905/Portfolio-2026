import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "../ui";

/** Future roadmap: planned improvements, DevOps, scaling. */
export default function Roadmap({ data }) {
  const accent = data.accent;
  return (
    <div>
      <SectionHeader
        index={9}
        kicker="Future Roadmap"
        title="Where it goes next"
        sub="What I'd build with more time — product depth, DevOps maturity, and scale."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {data.roadmap.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-2xl glass p-5"
          >
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-25" style={{ background: accent }} />
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded-md px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest" style={{ color: accent, background: `${accent}14` }}>
                {r.tag}
              </span>
              <ArrowUpRight size={16} className="text-muted transition-colors group-hover:text-white" />
            </div>
            <h3 className="font-display text-lg font-semibold">{r.title}</h3>
            <p className="mt-1 text-sm text-muted">{r.detail}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
