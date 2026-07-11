import { motion } from "framer-motion";
import { Code2, ExternalLink, FileText, BookOpen, Sparkles } from "lucide-react";
import { SectionHeader } from "../ui";
import { socials } from "../../../data/portfolio";

const KIND = {
  github: { icon: Code2, label: "Source code" },
  demo: { icon: ExternalLink, label: "Try it live" },
  pdf: { icon: FileText, label: "Architecture PDF" },
  docs: { icon: BookOpen, label: "Documentation" },
};

/** Project resources: GitHub, demo, docs, architecture PDF, resume highlight. */
export default function Resources({ data }) {
  const accent = data.accent;

  const resolve = (r) => {
    if (r.key === "github") return data.links?.github || socials.github;
    if (r.key === "demo") return data.links?.demo || "";
    return r.href || "";
  };

  return (
    <div>
      <SectionHeader index={10} kicker="Project Resources" title="Go deeper" sub="Everything to explore or verify this project." />

      <div className="grid gap-3 sm:grid-cols-2">
        {data.resources.map((r, i) => {
          const href = resolve(r);
          const meta = KIND[r.kind] || KIND.docs;
          const disabled = !href;
          return (
            <motion.a
              key={r.label}
              href={disabled ? undefined : href}
              target={disabled ? undefined : "_blank"}
              rel="noreferrer"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={disabled ? undefined : { y: -4 }}
              data-cursor={disabled ? undefined : "hover"}
              className={`group flex items-center gap-4 module holo-scan p-5 ${disabled ? "opacity-45" : ""}`}
              onClick={(e) => disabled && e.preventDefault()}
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-transform group-hover:scale-110"
                style={{ background: `${accent}18`, color: accent }}>
                <meta.icon size={20} />
              </div>
              <div>
                <div className="font-display font-semibold">{r.label}</div>
                <div className="text-xs text-muted">{disabled ? "Link coming soon" : meta.label}</div>
              </div>
            </motion.a>
          );
        })}
      </div>

      {/* resume highlight */}
      <div className="mt-6 flex items-start gap-3 rounded-2xl border p-5" style={{ borderColor: `${accent}30`, background: `${accent}0a` }}>
        <Sparkles size={18} className="mt-0.5 shrink-0" style={{ color: accent }} />
        <div>
          <div className="mb-1 font-mono text-[11px] uppercase tracking-widest" style={{ color: accent }}>Résumé highlight</div>
          <p className="text-sm leading-relaxed text-white/85">
            <span className="font-semibold">{data.name}</span> — {data.mission} <span className="text-muted">({data.status})</span>
          </p>
        </div>
      </div>
    </div>
  );
}
