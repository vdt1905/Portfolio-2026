import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowRight, Rocket } from "lucide-react";
import Overlay from "../Overlay";
import HudCard from "../ui/HudCard";
import { BrandIcon, hasBrand } from "../../data/techIcons";
import { projects } from "../../data/portfolio";
import { caseStudies } from "../../data/caseStudies";
import { useStore } from "../../store/useStore";

/** ZONE 4 — Project missions as premium HUD console cards. */
export default function Projects() {
  const openProject = useStore((s) => s.openProject);
  const scope = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".mission", { x: -24, opacity: 0, duration: 0.6, stagger: 0.09, ease: "power3.out" });
    }, scope);
    return () => ctx.revert();
  }, []);

  return (
    <Overlay kicker="Zone 04 — Mission Archive" title="Engineering Missions" accent="#00e5ff">
      <p className="mb-8 max-w-xl text-muted">
        Classified engineering dossiers. Each mission carries its architecture, decisions,
        challenges, and a live simulated run. Launch one to deploy.
      </p>

      <div ref={scope} className="grid gap-5 md:grid-cols-2" style={{ perspective: 1400 }}>
        {projects.map((p) => {
          const cs = caseStudies[p.id];
          return (
            <div key={p.id} className="mission">
              <HudCard
                accent={p.accent}
                tilt
                kicker="Project"
                title={p.name}
                subtitle={p.tag}
                badge={
                  <span className="hud-badge" style={{ color: cs?.status?.toLowerCase().includes("live") ? "#00ffb2" : p.accent }}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: "currentColor", boxShadow: "0 0 6px currentColor" }} />
                    {cs?.status || "Archived"}
                  </span>
                }
                actions={[
                  { label: "View mission", onClick: () => openProject(p.id) },
                  { label: "Launch", icon: <Rocket size={13} />, onClick: () => openProject(p.id) },
                ]}
              >
                <div className="mono-id mb-1" style={{ color: p.accent }}>Mission overview</div>
                <p className="text-sm leading-relaxed text-white/75">{cs?.mission || p.summary}</p>

                <div className="mono-id mb-2 mt-4">Tech stack</div>
                <div className="flex flex-wrap gap-2">
                  {p.tech.slice(0, 5).map((t) => (
                    <span key={t} className="tech-box" style={{ "--mc": p.accent }} title={t}>
                      {hasBrand(t) ? <BrandIcon name={t} size={22} /> : (
                        <span className="font-mono text-[10px] font-semibold" style={{ color: p.accent }}>
                          {t.replace(/[^A-Za-z0-9]/g, "").slice(0, 3).toUpperCase()}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </HudCard>
            </div>
          );
        })}
      </div>
    </Overlay>
  );
}
