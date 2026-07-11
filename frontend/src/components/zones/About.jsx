import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, GraduationCap, Target, User } from "lucide-react";
import Overlay from "../Overlay";
import Tilt from "../ui/Tilt";
import { profile, principles, timeline } from "../../data/portfolio";

const stagger = { animate: { transition: { staggerChildren: 0.06 } } };
const item = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 26 } },
};

export default function About() {
  return (
    <Overlay kicker="Zone 03 — Identity" title="Operator Profile" accent="#6c63ff">
      <motion.div variants={stagger} initial="initial" animate="animate">
        {/* identity console */}
        <motion.div variants={item} className="module holo-scan mb-8 p-6 md:p-8" style={{ "--mc": "#6c63ff" }}>
          <div className="mb-4 flex items-center justify-between">
            <span className="mono-id flex items-center gap-2 text-violet"><User size={13} /> Profile // {profile.handle}</span>
            <span className="mono-id text-success">● {profile.availability}</span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h3 className="font-display text-3xl font-semibold">{profile.name}</h3>
              <p className="mt-1 text-muted">{profile.role} <span className="text-cyan">·</span> {profile.subRole}</p>
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

        {/* operating principles */}
        <motion.div variants={item} className="mb-3 mono-id text-cyan">◈ Operating principles</motion.div>
        <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" style={{ perspective: 1000 }}>
          {principles.map((p, i) => (
            <Tilt key={p.title} max={8} className="module holo-scan p-5" style={{ "--mc": i % 2 ? "#00e5ff" : "#6c63ff" }}>
              <div className="mono-id mb-2" style={{ color: i % 2 ? "#00e5ff" : "#6c63ff" }}>P-{String(i + 1).padStart(2, "0")}</div>
              <div className="font-display text-lg font-semibold text-gradient">{p.title}.</div>
              <p className="mt-1 text-sm text-muted">{p.desc}</p>
            </Tilt>
          ))}
        </div>

        {/* orbital timeline */}
        <motion.div variants={item} className="mb-5 mono-id text-cyan">◈ Trajectory — docking log</motion.div>
        <OrbitalTimeline />
      </motion.div>
    </Overlay>
  );
}

/* ---------- orbital checkpoints along an illuminated path ---------- */
function OrbitalTimeline() {
  const [open, setOpen] = useState(0);
  return (
    <div className="relative pl-8">
      {/* illuminated orbital path */}
      <div className="absolute bottom-2 left-[13px] top-2 w-px" style={{ background: "linear-gradient(#00e5ff, #6c63ff, transparent)" }} />
      {timeline.map((t, i) => {
        const active = open === i;
        const accent = i % 2 ? "#6c63ff" : "#00e5ff";
        return (
          <div key={t.title} className="relative mb-4">
            {/* docking station node */}
            <button
              onMouseEnter={() => setOpen(i)} onClick={() => setOpen(i)} data-cursor="hover"
              className="absolute -left-[28px] top-2 grid h-6 w-6 place-items-center"
              style={{ transform: "rotate(45deg)", background: active ? accent : "#050810", border: `1px solid ${accent}`, boxShadow: active ? `0 0 12px ${accent}` : "none" }}
              aria-label={t.title}
            />
            <motion.div
              className="checkpoint holo-scan p-4" style={{ "--mc": accent }}
              animate={{ borderColor: active ? `${accent}80` : "rgba(255,255,255,0.09)" }}
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs" style={{ color: accent }}>{t.year}</span>
                <h4 className="font-display text-lg font-semibold">{t.title}</h4>
                <span className="ml-auto mono-id">DOCK-{String(i + 1).padStart(2, "0")}</span>
              </div>
              <motion.div initial={false} animate={{ height: active ? "auto" : 0, opacity: active ? 1 : 0 }} className="overflow-hidden">
                <p className="pt-2 text-sm text-muted">{t.desc}</p>
              </motion.div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
