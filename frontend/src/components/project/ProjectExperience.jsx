import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ArrowLeft, X, ChevronUp, ChevronDown } from "lucide-react";
import { useStore } from "../../store/useStore";
import { projects } from "../../data/portfolio";
import { caseStudies } from "../../data/caseStudies";

import Overview from "./sections/Overview";
import Architecture from "./sections/Architecture";
import Decisions from "./sections/Decisions";
import Journey from "./sections/Journey";
import Challenges from "./sections/Challenges";
import Performance from "./sections/Performance";
import CodeExplorer from "./sections/CodeExplorer";
import Demo from "./sections/Demo";
import Roadmap from "./sections/Roadmap";
import Resources from "./sections/Resources";

const SECTIONS = [
  { id: "overview", label: "Overview", C: Overview },
  { id: "architecture", label: "Architecture", C: Architecture },
  { id: "decisions", label: "Decisions", C: Decisions },
  { id: "journey", label: "Journey", C: Journey },
  { id: "challenges", label: "Challenges", C: Challenges },
  { id: "performance", label: "Performance", C: Performance },
  
  { id: "roadmap", label: "Roadmap", C: Roadmap },
  { id: "resources", label: "Resources", C: Resources },
];

export default function ProjectExperience() {
  const activeProject = useStore((s) => s.activeProject);
  const closeProject = useStore((s) => s.closeProject);
  const openZone = useStore((s) => s.openZone);
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const scope = useRef(null);
  const scrollRef = useRef(null);

  // Retain the last opened id so the exit animation still has content
  // to render after the store's activeProject is cleared.
  const [pid, setPid] = useState(activeProject);
  useEffect(() => { if (activeProject) setPid(activeProject); }, [activeProject]);

  const project = projects.find((p) => p.id === pid);
  const data = useMemo(() => {
    if (!project) return null;
    return { ...project, ...caseStudies[project.id] };
  }, [project]);

  const go = (i) => {
    if (i < 0 || i >= SECTIONS.length || i === index) return;
    setDir(i > index ? 1 : -1);
    setIndex(i);
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const back = () => { closeProject(); openZone("projects"); };

  // reset to first section when switching projects
  useEffect(() => { setIndex(0); }, [pid]);

  // keyboard: esc back to gallery, arrows navigate sections
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") back();
      else if (e.key === "ArrowDown" || e.key === "ArrowRight") go(index + 1);
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // GSAP entrance for the chrome
  useLayoutEffect(() => {
    if (!data) return;
    const ctx = gsap.context(() => {
      gsap.from(".pe-title", { y: 24, opacity: 0, duration: 0.7, ease: "power3.out" });
      gsap.from(".pe-rail-item", { x: -18, opacity: 0, duration: 0.5, stagger: 0.04, ease: "power2.out", delay: 0.1 });
      gsap.from(".pe-content", { opacity: 0, y: 20, duration: 0.6, ease: "power2.out", delay: 0.15 });
    }, scope);
    return () => ctx.revert();
  }, [pid, data]);

  if (!data) return null;
  const accent = data.accent;
  const Section = SECTIONS[index].C;

  return (
    <motion.div
      ref={scope}
      initial={{ opacity: 0, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.7, 0, 0.2, 1] }}
      className="pointer-events-auto fixed inset-0 z-50 flex flex-col bg-[#050505]/80 backdrop-blur-xl md:flex-row"
    >
      {/* accent ambience */}
      <div className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: `radial-gradient(700px circle at 15% 0%, ${accent}14, transparent 55%), radial-gradient(600px circle at 100% 100%, ${accent}0d, transparent 50%)` }} />

      {/* ============ LEFT RAIL (desktop) ============ */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/8 p-6 md:flex">
        <button onClick={back} className="mb-8 flex items-center gap-2 text-sm text-muted hover:text-white" data-cursor="hover">
          <ArrowLeft size={16} /> All projects
        </button>

        <div className="pe-title mb-8">
          <div className="font-mono text-[11px] uppercase tracking-widest" style={{ color: accent }}>{data.tag}</div>
          <h1 className="mt-1 font-display text-2xl font-semibold leading-tight">{data.name}</h1>
          <span className="mt-2 inline-block rounded-full px-2.5 py-0.5 font-mono text-[10px]" style={{ color: accent, background: `${accent}14` }}>
            {data.status}
          </span>
        </div>

        <nav className="scroll-area -mx-2 flex-1 space-y-0.5 overflow-y-auto px-2">
          {SECTIONS.map((s, i) => {
            const on = i === index;
            return (
              <button
                key={s.id}
                onClick={() => go(i)}
                className="pe-rail-item group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors"
                style={{ color: on ? "#fff" : "rgba(255,255,255,0.5)", background: on ? `${accent}12` : "transparent" }}
                data-cursor="hover"
              >
                <span className="font-mono text-[11px] tabular-nums" style={{ color: on ? accent : "rgba(255,255,255,0.3)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.label}
                {on && <span className="ml-auto h-1.5 w-1.5 rounded-full" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />}
              </button>
            );
          })}
        </nav>

        <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/8">
          <motion.div className="h-full rounded-full" style={{ background: accent }}
            animate={{ width: `${((index + 1) / SECTIONS.length) * 100}%` }} />
        </div>
      </aside>

      {/* ============ MOBILE TOP BAR ============ */}
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-3 md:hidden">
        <button onClick={back} className="flex items-center gap-2 text-sm text-muted" data-cursor="hover">
          <ArrowLeft size={16} /> {data.name}
        </button>
        <button onClick={closeProject} className="hud-icon" aria-label="Close"><X size={16} /></button>
      </div>
      <div className="scroll-area flex gap-1.5 overflow-x-auto border-b border-white/8 px-4 py-2 md:hidden">
        {SECTIONS.map((s, i) => (
          <button key={s.id} onClick={() => go(i)}
            className="shrink-0 rounded-full px-3 py-1 font-mono text-[11px]"
            style={{ color: i === index ? accent : "rgba(255,255,255,0.5)", background: i === index ? `${accent}14` : "rgba(255,255,255,0.03)" }}
            data-cursor="hover">
            {String(i + 1).padStart(2, "0")} {s.label}
          </button>
        ))}
      </div>

      {/* ============ CONTENT ============ */}
      <main className="relative flex-1 overflow-hidden">
        {/* desktop close */}
        <button onClick={closeProject} className="hud-icon absolute right-6 top-6 z-20 hidden md:grid" aria-label="Close workspace" data-cursor="hover">
          <X size={16} />
        </button>

        <div ref={scrollRef} className="scroll-area h-full overflow-y-auto px-5 py-8 md:px-12 md:py-12">
          <div className="pe-content mx-auto max-w-4xl pb-24">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={SECTIONS[index].id}
                custom={dir}
                initial={{ opacity: 0, y: dir * 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: dir * -24 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              >
                <Section data={data} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* prev / next */}
        <div className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 md:left-auto md:right-6 md:translate-x-0">
          <button onClick={() => go(index - 1)} disabled={index === 0}
            className="pointer-events-auto hud-icon disabled:opacity-30" aria-label="Previous section" data-cursor="hover">
            <ChevronUp size={16} />
          </button>
          <span className="pointer-events-auto rounded-full glass px-3 py-1.5 font-mono text-[11px] text-muted">
            {String(index + 1).padStart(2, "0")} / {SECTIONS.length}
          </span>
          <button onClick={() => go(index + 1)} disabled={index === SECTIONS.length - 1}
            className="pointer-events-auto hud-icon disabled:opacity-30" aria-label="Next section" data-cursor="hover">
            <ChevronDown size={16} />
          </button>
        </div>
      </main>
    </motion.div>
  );
}
