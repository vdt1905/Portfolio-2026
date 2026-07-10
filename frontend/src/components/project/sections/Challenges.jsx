import { motion } from "framer-motion";
import { AlertTriangle, Search, Wrench, Lightbulb } from "lucide-react";
import { SectionHeader } from "../ui";

/** Technical challenges: problem → root cause → solution → lesson. */
export default function Challenges({ data }) {
  const accent = data.accent;
  const rows = [
    { icon: AlertTriangle, label: "Problem", key: "problem", color: "#ff6b6b" },
    { icon: Search, label: "Root cause", key: "cause", color: "#ffb454" },
    { icon: Wrench, label: "Solution", key: "solution", color: accent },
    { icon: Lightbulb, label: "Lesson", key: "lesson", color: "#00ff9c" },
  ];

  return (
    <div>
      <SectionHeader
        index={5}
        kicker="Technical Challenges"
        title="What broke, and why it doesn't anymore"
        sub="The hard parts — traced from symptom to root cause to fix to the lesson that stuck."
      />

      <div className="grid gap-4">
        {data.challenges.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.05 }}
            className="glass overflow-hidden rounded-2xl"
          >
            <div className="grid md:grid-cols-2">
              {rows.map((r) => (
                <div key={r.key} className="border-b border-white/5 p-5 md:[&:nth-child(odd)]:border-r">
                  <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest" style={{ color: r.color }}>
                    <r.icon size={13} /> {r.label}
                  </div>
                  <p className="text-sm leading-relaxed text-white/80">{c[r.key]}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
