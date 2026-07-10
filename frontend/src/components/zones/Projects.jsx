import { motion } from "framer-motion";
import { ArrowRight, Boxes } from "lucide-react";
import Overlay from "../Overlay";
import { projects } from "../../data/portfolio";
import { caseStudies } from "../../data/caseStudies";
import { useStore } from "../../store/useStore";

/**
 * ZONE 4 — Project Museum (gallery).
 * Each card launches the immersive Engineering Showcase for that project.
 */
export default function Projects() {
  const openProject = useStore((s) => s.openProject);

  return (
    <Overlay kicker="Zone 04 — Project Museum" title="Engineering Showcase" accent="#00e5ff">
      <p className="mb-8 max-w-xl text-muted">
        Not a card wall — each project is a standalone case study. Pick one to step into its
        architecture, decisions, challenges, and a live simulated demo.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((p, i) => {
          const cs = caseStudies[p.id];
          return (
            <motion.button
              key={p.id}
              onClick={() => openProject(p.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -6 }}
              data-cursor="hover"
              className="group relative overflow-hidden rounded-2xl glass p-6 text-left"
            >
              <div
                className="absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-45"
                style={{ background: p.accent }}
              />
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: p.accent }}>
                  {p.tag}
                </span>
                {cs?.status && (
                  <span className="rounded-full px-2.5 py-0.5 font-mono text-[10px]" style={{ color: p.accent, background: `${p.accent}14` }}>
                    {cs.status}
                  </span>
                )}
              </div>

              <h3 className="mt-2 font-display text-2xl font-semibold">{p.name}</h3>
              <p className="mt-2 text-sm text-muted">{cs?.mission || p.summary}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.tech.slice(0, 5).map((t) => (
                  <span key={t} className="chip">{t}</span>
                ))}
              </div>

              <div className="mt-5 flex items-center gap-2 text-sm font-medium" style={{ color: p.accent }}>
                <Boxes size={15} /> Enter case study
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </Overlay>
  );
}
