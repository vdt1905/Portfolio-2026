import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { Boxes, ChevronRight, Radar } from "lucide-react";
import Overlay from "../Overlay";
import Tilt from "../ui/Tilt";
import { projects } from "../../data/portfolio";
import { caseStudies } from "../../data/caseStudies";
import { useStore } from "../../store/useStore";

/**
 * ZONE 4 — Project Museum, presented as classified Mission Modules.
 * Each dossier reveals mechanically; selecting one launches its case study.
 */
export default function Projects() {
  const openProject = useStore((s) => s.openProject);
  const scope = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".mission", { x: -26, opacity: 0, scaleX: 0.96, transformOrigin: "left center", duration: 0.6, stagger: 0.09, ease: "power3.out" });
    }, scope);
    return () => ctx.revert();
  }, []);

  return (
    <Overlay kicker="Zone 04 — Mission Archive" title="Engineering Missions" accent="#00e5ff">
      <p className="mb-8 max-w-xl text-muted">
        Classified engineering dossiers. Each mission unfolds its architecture, decisions,
        challenges, and a live simulated run. Select one to deploy.
      </p>

      <div ref={scope} className="grid gap-4 md:grid-cols-2" style={{ perspective: 1200 }}>
        {projects.map((p, i) => {
          const cs = caseStudies[p.id];
          return (
            <Tilt
              key={p.id}
              max={6}
              onClick={() => openProject(p.id)}
              data-cursor="hover"
              className="mission module holo-scan group cursor-pointer p-5"
              style={{ "--mc": p.accent }}
            >
              {/* dossier header */}
              <div className="flex items-center justify-between">
                <span className="mono-id flex items-center gap-2">
                  <Radar size={12} style={{ color: p.accent }} />
                  MSN-{String(i + 1).padStart(3, "0")}
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest" style={{ color: p.accent }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.accent, boxShadow: `0 0 6px ${p.accent}` }} />
                  {cs?.status || "Archived"}
                </span>
              </div>

              <div className="mt-3 h-px w-full" style={{ background: `linear-gradient(90deg, ${p.accent}55, transparent)` }} />

              <h3 className="mt-3 font-display text-2xl font-semibold">{p.name}</h3>
              <div className="mono-id mt-0.5" style={{ color: p.accent }}>{p.tag}</div>
              <p className="mt-2 text-sm leading-relaxed text-white/75">{cs?.mission || p.summary}</p>

              {/* tech slats */}
              <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-muted">
                {p.tech.slice(0, 5).map((t, k) => (
                  <span key={t} className="flex items-center gap-3">
                    {k > 0 && <span className="text-white/15">/</span>}
                    {t}
                  </span>
                ))}
              </div>

              {/* deploy footer */}
              <div className="mt-5 flex items-center justify-between border-t border-white/6 pt-3">
                <span className="flex items-center gap-2 text-sm font-medium" style={{ color: p.accent }}>
                  <Boxes size={15} /> Open dossier
                </span>
                <ChevronRight size={16} className="text-muted transition-transform group-hover:translate-x-1" style={{ color: p.accent }} />
              </div>
            </Tilt>
          );
        })}
      </div>
    </Overlay>
  );
}
