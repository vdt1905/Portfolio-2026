import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, GraduationCap, Target, User } from "lucide-react";
import Overlay from "../Overlay";
import Tilt from "../ui/Tilt";
import { profile, principles } from "../../data/portfolio";
import { STOPS } from "../../data/journey";

const stagger = { animate: { transition: { staggerChildren: 0.06 } } };
const item = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 26 } },
};

const PLANET_STYLE = {
  earth: {
    bg: "radial-gradient(circle at 35% 30%, #d9fbff 0 8%, #4fa9ff 9% 22%, #1467a8 23% 43%, #123e64 44% 62%, #04111d 63% 100%)",
    orbit: "#5fb0ff",
  },
  moon: {
    bg: "radial-gradient(circle at 34% 30%, #ffffff 0 5%, #d5d9e0 6% 24%, #8d96a3 25% 48%, #303946 49% 70%, #080b10 71% 100%)",
    orbit: "#c8ccd4",
  },
  iss: {
    bg: "linear-gradient(135deg, #0a0d18 0%, #27345f 42%, #8b7bff 45%, #dfe6ff 49%, #252f52 54%, #070912 100%)",
    orbit: "#8b7bff",
  },
  mars: {
    bg: "radial-gradient(circle at 36% 28%, #ffc29d 0 7%, #d9603b 8% 32%, #8f321e 33% 58%, #2a0c08 59% 100%)",
    orbit: "#d9603b",
  },
  jupiter: {
    bg: "repeating-linear-gradient(170deg, #2f1d12 0 9%, #8a5a3a 9% 17%, #e6c79a 17% 25%, #6b4a2a 25% 35%)",
    orbit: "#d8a06a",
  },
  saturn: {
    bg: "radial-gradient(circle at 42% 34%, #fff3cc 0 9%, #e8d29a 10% 36%, #8e724c 37% 59%, #171009 60% 100%)",
    orbit: "#e8d29a",
  },
  uranus: {
    bg: "radial-gradient(circle at 35% 30%, #e2ffff 0 7%, #7fd6e6 8% 38%, #356e7e 39% 62%, #07141a 63% 100%)",
    orbit: "#7fd6e6",
  },
  neptune: {
    bg: "radial-gradient(circle at 35% 30%, #d6e4ff 0 6%, #4f7ae0 7% 36%, #18307b 37% 64%, #050918 65% 100%)",
    orbit: "#4f7ae0",
  },
};

export default function About() {
  return (
    <Overlay kicker="Zone 03 - Identity" title="Operator Profile" accent="#6c63ff">
      <motion.div variants={stagger} initial="initial" animate="animate">
        <motion.div variants={item} className="module holo-scan mb-8 p-6 md:p-8" style={{ "--mc": "#6c63ff" }}>
          <div className="mb-4 flex items-center justify-between">
            <span className="mono-id flex items-center gap-2 text-violet"><User size={13} /> Profile // {profile.handle}</span>
            <span className="mono-id text-success">ONLINE // {profile.availability}</span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h3 className="font-display text-3xl font-semibold">{profile.name}</h3>
              <p className="mt-1 text-muted">{profile.role} <span className="text-cyan">/</span> {profile.subRole}</p>
            </div>
            <div className="grid gap-2 text-sm">
              <span className="flex items-center gap-2 text-muted"><MapPin size={14} className="text-cyan" /> {profile.location}</span>
              <span className="flex items-center gap-2 text-muted"><GraduationCap size={14} className="text-cyan" /> {profile.education.degree}</span>
            </div>
          </div>
          <div className="mt-6 flex items-start gap-3 border-l-2 pl-4" style={{ borderColor: "#6c63ff" }}>
            <Target size={16} className="mt-0.5 shrink-0 text-violet" />
            <p className="text-sm leading-relaxed text-white/80">{profile.mission}</p>
          </div>
        </motion.div>

        <motion.div variants={item} className="mb-3 mono-id text-cyan">Operating principles</motion.div>
        <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" style={{ perspective: 1000 }}>
          {principles.map((p, i) => (
            <Tilt key={p.title} max={8} className="module holo-scan p-5" style={{ "--mc": i % 2 ? "#00e5ff" : "#6c63ff" }}>
              <div className="mono-id mb-2" style={{ color: i % 2 ? "#00e5ff" : "#6c63ff" }}>P-{String(i + 1).padStart(2, "0")}</div>
              <div className="font-display text-lg font-semibold text-gradient">{p.title}.</div>
              <p className="mt-1 text-sm text-muted">{p.desc}</p>
            </Tilt>
          ))}
        </div>

        <motion.div variants={item} className="mb-5 mono-id text-cyan">Trajectory - graduation log</motion.div>
        <PlanetaryTimeline />
      </motion.div>
    </Overlay>
  );
}

function PlanetArt({ stop, active, large = false, layoutId }) {
  const style = PLANET_STYLE[stop.id] || PLANET_STYLE.earth;
  return (
    <motion.div
      layoutId={layoutId}
      className={`pointer-events-none relative shrink-0 rounded-full ${large ? "h-40 w-40 md:h-52 md:w-52" : "h-16 w-16"}`}
      style={{
        background: style.bg,
        boxShadow: active
          ? `0 0 24px ${stop.accent}88, inset -18px -18px 34px rgba(0,0,0,0.48)`
          : "inset -12px -12px 22px rgba(0,0,0,0.5)",
      }}
    >
      <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_28%_24%,rgba(255,255,255,0.45),transparent_24%,rgba(0,0,0,0.18)_72%)]" />
      {stop.rings && (
        <span
          className="absolute left-1/2 top-1/2 h-[28%] w-[150%] -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded-full border"
          style={{ borderColor: `${stop.accent}AA`, boxShadow: `0 0 16px ${stop.accent}55` }}
        />
      )}
      {stop.kind === "station" && (
        <span className="absolute left-1/2 top-1/2 h-2 w-[145%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 shadow-[0_0_16px_rgba(139,123,255,0.9)]" />
      )}
      <span className="absolute -inset-2 rounded-full border opacity-60" style={{ borderColor: style.orbit }} />
    </motion.div>
  );
}

function PlanetaryTimeline() {
  const stops = STOPS.filter((s) => s.id !== "deep");
  const [open, setOpen] = useState(0);
  const active = stops[open];

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.15fr]">
      <div className="module holo-scan pointer-events-auto overflow-hidden p-4" style={{ "--mc": active.accent }}>
        <div className="mb-4 flex items-center justify-between">
          <span className="mono-id" style={{ color: active.accent }}>Select a milestone</span>
          <span className="mono-id">{stops.length} stops</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          {stops.map((stop, i) => {
            const selected = open === i;
            const select = (e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(i);
            };
            return (
              <div
                key={stop.id}
                className="group relative z-20 min-h-48 overflow-hidden border border-white/10 bg-white/[0.03] p-3 text-left transition hover:-translate-y-1 pointer-events-auto"
                style={{
                  borderColor: selected ? `${stop.accent}AA` : "rgba(255,255,255,0.1)",
                  boxShadow: selected ? `0 0 22px ${stop.accent}33` : "none",
                }}
              >
                <div className="pointer-events-none absolute inset-0 opacity-30" style={{ background: `radial-gradient(circle at 50% 0%, ${stop.accent}55, transparent 52%)` }} />
                <div className="relative flex justify-center py-2">
                  <PlanetArt stop={stop} active={selected} layoutId={`about-planet-${stop.id}`} />
                </div>
                <div className="relative mt-2">
                  <div className="font-mono text-[10px]" style={{ color: stop.accent }}>{stop.year} // {stop.theme}</div>
                  <div className="font-display text-base font-semibold">{stop.name}</div>
                </div>
                <button
                  type="button"
                  onPointerDown={select}
                  onClick={select}
                  data-cursor="hover"
                  className="relative mt-3 flex w-full items-center justify-center gap-2 border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
                  style={{
                    borderColor: selected ? stop.accent : `${stop.accent}66`,
                    background: selected ? `${stop.accent}22` : "rgba(255,255,255,0.04)",
                    boxShadow: selected ? `0 0 14px ${stop.accent}55` : "none",
                  }}
                >
                  {selected ? "Viewing" : "Deep dive"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="module holo-scan relative min-h-[520px] overflow-hidden p-6 md:p-8"
          style={{ "--mc": active.accent }}
        >
          <div className="pointer-events-none absolute inset-0 opacity-25" style={{ background: PLANET_STYLE[active.id]?.bg }} />
          <motion.div
            key={`${active.id}-bg`}
            initial={{ opacity: 0, scale: 0.78, x: 80 }}
            animate={{ opacity: 0.28, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 1.08, x: -60 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute -right-24 -top-20 h-72 w-72 rounded-full md:h-[30rem] md:w-[30rem]"
            style={{
              background: PLANET_STYLE[active.id]?.bg,
              boxShadow: `0 0 70px ${active.accent}55, inset -45px -45px 80px rgba(0,0,0,0.58)`,
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_18%,rgba(255,255,255,0.18),transparent_24%),linear-gradient(90deg,#02040A_0%,rgba(2,4,10,0.78)_45%,rgba(2,4,10,0.95)_100%)]" />

          <div className="relative grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
            <motion.div
              key={`${active.id}-zoom`}
              initial={{ scale: 0.35, opacity: 0, rotate: -18 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 1.25, opacity: 0, rotate: 10 }}
              transition={{ type: "spring", stiffness: 170, damping: 20 }}
            >
              <PlanetArt stop={active} active large layoutId={`about-planet-${active.id}`} />
            </motion.div>
            <div>
              <div className="mb-2 font-mono text-xs uppercase tracking-[0.24em]" style={{ color: active.accent }}>{active.year} // {active.theme}</div>
              <h3 className="font-display text-4xl font-semibold">{active.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/78">{active.detail}</p>
              {active.lesson && (
                <p className="mt-4 border-l-2 pl-4 text-sm italic text-white/72" style={{ borderColor: active.accent }}>
                  "{active.lesson}"
                </p>
              )}
            </div>
          </div>

          <div className="relative mt-8 grid gap-5 md:grid-cols-2">
            <div>
              <div className="mb-2 mono-id">Skills unlocked</div>
              <div className="flex flex-wrap gap-1.5">
                {active.skills.map((s) => <span key={s} className="chip">{s}</span>)}
              </div>
            </div>
            <div>
              <div className="mb-2 mono-id">Milestones</div>
              <div className="flex flex-wrap gap-1.5">
                {active.projects.map((p) => (
                  <span key={p} className="rounded-md px-2.5 py-1 text-xs font-medium" style={{ color: active.accent, background: `${active.accent}18` }}>{p}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="relative mt-8 h-2 overflow-hidden bg-white/10">
            <motion.div
              className="h-full"
              style={{ background: active.accent, boxShadow: `0 0 14px ${active.accent}` }}
              initial={{ width: 0 }}
              animate={{ width: `${((open + 1) / stops.length) * 100}%` }}
            />
          </div>

          <div className="relative mt-5 flex flex-wrap gap-2">
            {stops.map((stop, i) => (
              <button
                key={stop.id}
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen(i);
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen(i);
                }}
                data-cursor="hover"
                className="border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition hover:bg-white/10"
                style={{
                  color: open === i ? "#fff" : stop.accent,
                  borderColor: open === i ? stop.accent : `${stop.accent}55`,
                  background: open === i ? `${stop.accent}22` : "rgba(255,255,255,0.03)",
                }}
              >
                {stop.name}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
