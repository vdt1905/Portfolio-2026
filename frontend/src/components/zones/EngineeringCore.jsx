import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MonitorSmartphone, Server, BrainCircuit, Database, Boxes, Binary, Wrench,
  ArrowRight, ChevronDown, Route, Layers3, Blocks,
} from "lucide-react";
import Overlay from "../Overlay";
import CoreCanvas from "../core/CoreCanvas";
import { domains, STATUS, coreTimeline } from "../../data/engineeringCore";
import { BrandIcon, hasBrand } from "../../data/techIcons";

const ICONS = { MonitorSmartphone, Server, BrainCircuit, Database, Boxes, Binary, Wrench };

/** ZONE 06 — Engineering Core. Domains orbit a 3D core; each expands to evidence. */
export default function EngineeringCore() {
  const [activeId, setActiveId] = useState(domains[0].id);
  const domain = domains.find((d) => d.id === activeId);

  return (
    <Overlay kicker="Zone 06 — Engineering Core" title="Engineering Core" accent="#00e5ff">
      <p className="mb-5 max-w-2xl text-muted">
        The central intelligence of the workspace. Technologies are grouped by engineering
        domain — every one answers <span className="text-white">where and how it's actually been applied.</span>
      </p>

      {/* status legend */}
      <div className="mb-6 flex flex-wrap gap-4">
        {Object.entries(STATUS).map(([k, s]) => (
          <span key={k} className="flex items-center gap-2 font-mono text-[11px] text-muted">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color, boxShadow: `0 0 8px ${s.color}` }} />
            {s.label}
          </span>
        ))}
      </div>

      {/* domain selector chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        {domains.map((d) => {
          const Icon = ICONS[d.icon] || Blocks;
          const on = d.id === activeId;
          return (
            <button
              key={d.id}
              onClick={() => setActiveId(d.id)}
              data-cursor="hover"
              className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors"
              style={{
                borderColor: on ? d.color : "rgba(255,255,255,0.08)",
                background: on ? `${d.color}14` : "rgba(255,255,255,0.02)",
                color: on ? "#fff" : "rgba(255,255,255,0.6)",
                boxShadow: on ? `0 0 24px -10px ${d.color}` : "none",
              }}
            >
              <Icon size={15} style={{ color: d.color }} />
              {d.short}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        {/* 3D core */}
        <CoreCanvas domains={domains} activeId={activeId} onSelect={setActiveId} />

        {/* domain panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={domain.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3 }}
          >
            <DomainPanel domain={domain} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* engineering timeline */}
      <Timeline />
    </Overlay>
  );
}

/* ------------------------------------------------------------------ */
function DomainPanel({ domain }) {
  const Icon = ICONS[domain.icon] || Blocks;
  const c = domain.color;
  return (
    <div>
      <div className="flex items-start gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl" style={{ background: `${c}18`, color: c, boxShadow: `0 0 24px -8px ${c}` }}>
          <Icon size={24} />
        </span>
        <div>
          <h3 className="font-display text-2xl font-semibold">{domain.name}</h3>
          <p className="text-sm text-muted">{domain.tagline}</p>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-white/6 bg-white/[0.02] p-3">
        <Route size={15} className="mt-0.5 shrink-0" style={{ color: c }} />
        <p className="text-sm leading-relaxed text-white/80"><span className="text-muted">Architectural role — </span>{domain.role}</p>
      </div>

      {/* evidence stats */}
      {domain.evidence?.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {domain.evidence.map((e) => (
            <div key={e.label} className="rounded-xl glass p-3">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted">{e.label}</div>
              <div className="mt-0.5 text-sm font-semibold" style={{ color: c }}>{e.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* DevOps pipeline */}
      {domain.pipeline && <Pipeline steps={domain.pipeline} />}

      {/* CS concept modules */}
      {domain.conceptModules && <ConceptModules modules={domain.conceptModules} color={c} />}

      {/* tech with real logos + status */}
      <Label>Technologies</Label>
      <div className="flex flex-wrap gap-1.5">
        {domain.tech.map((t) => (
          <span key={t.name} className="flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/[0.02] px-2.5 py-1 text-xs">
            {hasBrand(t.name) ? (
              <BrandIcon name={t.name} size={13} />
            ) : (
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: STATUS[t.status].color }} />
            )}
            {t.name}
            {hasBrand(t.name) && <span className="h-1.5 w-1.5 rounded-full" style={{ background: STATUS[t.status].color }} />}
          </span>
        ))}
      </div>

      {/* responsibilities */}
      {domain.responsibilities?.length > 0 && (
        <>
          <Label>Responsibilities</Label>
          <ul className="space-y-1.5">
            {domain.responsibilities.map((r) => (
              <li key={r} className="flex gap-2 text-sm text-white/80"><span style={{ color: c }}>▹</span>{r}</li>
            ))}
          </ul>
        </>
      )}

      {/* concepts */}
      <Label>Concepts mastered</Label>
      <div className="flex flex-wrap gap-1.5">
        {domain.concepts.map((x) => <span key={x} className="chip">{x}</span>)}
      </div>

      {/* projects + related */}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <Label className="!mt-0">Applied in</Label>
          <div className="flex flex-wrap gap-1.5">
            {domain.projects.map((p) => (
              <span key={p} className="rounded-md px-2.5 py-1 text-xs font-medium" style={{ color: c, background: `${c}14` }}>{p}</span>
            ))}
          </div>
        </div>
        <div>
          <Label className="!mt-0">Related</Label>
          <div className="flex flex-wrap gap-1.5">
            {domain.related.map((p) => <span key={p} className="chip">{p}</span>)}
          </div>
        </div>
      </div>

      {/* roadmap */}
      <Label>Future roadmap</Label>
      <div className="space-y-1.5">
        {domain.roadmap.map((r) => (
          <div key={r} className="flex items-center gap-2 text-sm text-muted">
            <ArrowRight size={14} style={{ color: c }} /> {r}
          </div>
        ))}
      </div>
    </div>
  );
}

function Label({ children, className = "" }) {
  return <div className={`mb-2 mt-5 font-mono text-[11px] uppercase tracking-[0.25em] text-muted ${className}`}>{children}</div>;
}

/* DevOps deployment pipeline */
function Pipeline({ steps }) {
  return (
    <>
      <Label>Deployment pipeline</Label>
      <div className="flex items-center overflow-x-auto pb-1">
        {steps.map((s, i) => {
          const col = STATUS[s.status].color;
          return (
            <div key={s.stage} className="flex items-center">
              <div className="rounded-xl border px-3 py-2 text-center" style={{ borderColor: `${col}40`, background: `${col}0e` }}>
                <div className="text-xs font-semibold" style={{ color: col }}>{s.stage}</div>
                <div className="mt-0.5 font-mono text-[9px] uppercase tracking-wide text-muted">{s.status}</div>
              </div>
              {i < steps.length - 1 && (
                <div className="relative mx-1 h-px w-6 bg-white/12">
                  <motion.span className="absolute -top-[3px] h-1.5 w-1.5 rounded-full" style={{ background: col, boxShadow: `0 0 6px ${col}` }}
                    animate={{ left: ["0%", "100%"], opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

/* CS Fundamentals interactive concept modules */
function ConceptModules({ modules, color }) {
  const [open, setOpen] = useState(modules[0].name);
  return (
    <>
      <Label>Concept modules</Label>
      <div className="space-y-2">
        {modules.map((m) => {
          const isOpen = open === m.name;
          return (
            <div key={m.name} className="overflow-hidden rounded-xl border border-white/8 bg-white/[0.02]">
              <button onClick={() => setOpen(isOpen ? null : m.name)} className="flex w-full items-center justify-between px-4 py-3 text-left" data-cursor="hover">
                <span className="flex items-center gap-2.5">
                  <Layers3 size={15} style={{ color }} />
                  <span className="font-display font-semibold">{m.name}</span>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: STATUS[m.status].color }} />
                </span>
                <ChevronDown size={16} className="text-muted transition-transform" style={{ transform: isOpen ? "rotate(180deg)" : "none" }} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="px-4 pb-4">
                      <p className="mb-2 text-sm text-muted">{m.blurb}</p>
                      <ul className="space-y-1">
                        {m.points.map((p) => (
                          <li key={p} className="flex gap-2 text-sm text-white/80"><span style={{ color }}>·</span>{p}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* Engineering evolution timeline */
function Timeline() {
  return (
    <div className="mt-10 border-t border-white/8 pt-8">
      <div className="mb-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
        <Blocks size={14} className="text-cyan" /> Engineering timeline
      </div>
      <div className="grid gap-3 md:grid-cols-5">
        {coreTimeline.map((t, i) => (
          <motion.div
            key={t.year}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="relative rounded-2xl glass p-4"
          >
            <div className="font-mono text-xs text-cyan">{t.year}</div>
            <div className="mt-1 font-display font-semibold">{t.title}</div>
            <p className="mt-1 text-xs text-muted">{t.detail}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {t.unlock.map((u) => (
                <span key={u} className="rounded px-1.5 py-0.5 font-mono text-[9px] text-white/70" style={{ background: "rgba(255,255,255,0.05)" }}>{u}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      <p className="mt-3 font-mono text-[10px] text-muted">* actively learning / planned</p>
    </div>
  );
}
