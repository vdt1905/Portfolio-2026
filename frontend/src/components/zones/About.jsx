import { motion } from "framer-motion";
import { MapPin, GraduationCap, Target } from "lucide-react";
import Overlay from "../Overlay";
import { profile, principles, timeline } from "../../data/portfolio";

const stagger = { animate: { transition: { staggerChildren: 0.06 } } };
const item = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 26 } },
};

export default function About() {
  return (
    <Overlay kicker="Zone 03 — Identity" title="About Me" accent="#6c63ff">
      {/* holographic profile card */}
      <motion.div variants={stagger} initial="initial" animate="animate">
        <motion.div variants={item} className="glass mb-8 rounded-2xl p-6 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-mono text-xs text-cyan">// profile</div>
              <h3 className="mt-1 font-display text-3xl font-semibold">
                {profile.name}
              </h3>
              <p className="mt-1 text-muted">
                {profile.role} <span className="text-cyan">·</span> {profile.subRole}
              </p>
            </div>
            <div className="grid gap-2 text-sm">
              <span className="flex items-center gap-2 text-muted">
                <MapPin size={14} className="text-cyan" /> {profile.location}
              </span>
              <span className="flex items-center gap-2 text-muted">
                <GraduationCap size={14} className="text-cyan" /> {profile.education.degree}
              </span>
            </div>
          </div>
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <Target size={16} className="mt-0.5 shrink-0 text-violet" />
            <p className="text-sm leading-relaxed text-white/80">{profile.mission}</p>
          </div>
        </motion.div>

        {/* principles */}
        <motion.div variants={item} className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-muted">
          operating principles
        </motion.div>
        <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((p) => (
            <motion.div
              key={p.title}
              variants={item}
              whileHover={{ y: -4 }}
              className="glass rounded-xl p-5"
            >
              <div className="font-display text-lg font-semibold text-gradient">{p.title}.</div>
              <p className="mt-1 text-sm text-muted">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* timeline */}
        <motion.div variants={item} className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-muted">
          the journey
        </motion.div>
        <div className="relative pl-6">
          <div className="absolute bottom-2 left-[7px] top-2 w-px bg-gradient-to-b from-cyan via-violet to-transparent" />
          {timeline.map((t) => (
            <motion.div key={t.title} variants={item} className="relative mb-6 last:mb-0">
              <span className="absolute -left-[22px] top-1.5 h-3 w-3 rounded-full border-2 border-cyan bg-[#050505]" />
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-cyan">{t.year}</span>
                <h4 className="font-display text-lg font-semibold">{t.title}</h4>
              </div>
              <p className="mt-0.5 text-sm text-muted">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Overlay>
  );
}
