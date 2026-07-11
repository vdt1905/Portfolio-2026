import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Code2, Contact as ContactIcon, Calendar, Send, Printer, Download, Loader2 } from "lucide-react";
import Overlay from "../Overlay";
import { profile, socials } from "../../data/portfolio";

/** ZONE 9 — Communication console + resume fabrication unit. */
export default function Contact() {
  const channels = [
    { label: "Email", icon: Mail, href: `mailto:${profile.email}`, accent: "#00e5ff", detail: profile.email },
    { label: "GitHub", icon: Code2, href: socials.github, accent: "#8cf8ff", detail: "See the code" },
    { label: "LinkedIn", icon: ContactIcon, href: socials.linkedin, accent: "#6c63ff", detail: "Let's connect" },
    { label: "Calendar", icon: Calendar, href: socials.calendar, accent: "#00ffb2", detail: "Book a call" },
  ];

  return (
    <Overlay kicker="Zone 09 — Comms Console" title="Open a Channel" accent="#00ffb2">
      {/* signal transmitter */}
      <div className="relative mb-8 flex items-center justify-center py-6">
        <div className="relative h-24 w-24">
          {[0, 1, 2].map((i) => (
            <motion.span key={i} className="absolute inset-0 rounded-full border border-success/40"
              animate={{ scale: [1, 2.2], opacity: [0.6, 0] }} transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }} />
          ))}
          <div className="absolute inset-0 grid place-items-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-success/15 text-success" style={{ boxShadow: "0 0 30px #00ffb2" }}>
              <Send size={22} />
            </div>
          </div>
        </div>
      </div>

      <p className="mx-auto mb-8 max-w-md text-center text-muted">
        Building something ambitious, or hiring an engineer who ships? The channel is open.
      </p>

      {/* transmission panels */}
      <div className="grid gap-3 sm:grid-cols-2">
        {channels.map((c, i) => (
          <motion.a
            key={c.label} href={c.href} target={c.href.startsWith("mailto") ? undefined : "_blank"} rel="noreferrer"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            data-cursor="hover"
            className="transmit holo-scan group flex items-center gap-4 p-4" style={{ "--mc": c.accent }}
          >
            <div className="grid h-11 w-11 shrink-0 place-items-center border transition-transform group-hover:scale-110"
              style={{ background: `${c.accent}15`, color: c.accent, borderColor: `${c.accent}40`, clipPath: "polygon(0 0,100% 0,100% 70%,70% 100%,0 100%)" }}>
              <c.icon size={20} />
            </div>
            <div className="flex-1">
              <div className="font-display font-semibold">{c.label}</div>
              <div className="text-xs text-muted">{c.detail}</div>
            </div>
            <span className="mono-id opacity-0 transition-opacity group-hover:opacity-100" style={{ color: c.accent }}>TX ▸</span>
          </motion.a>
        ))}
      </div>

      <ResumePrinter />

      <div className="mt-8 text-center mono-id">
        <span className="text-success">●</span> {profile.availability} — {profile.location}
      </div>
    </Overlay>
  );
}

/* ---------- engineering resume fabrication unit ---------- */
function ResumePrinter() {
  const [state, setState] = useState("idle"); // idle · printing · ready
  const run = () => { if (state !== "idle") return; setState("printing"); setTimeout(() => setState("ready"), 2400); };

  return (
    <div className="module holo-scan mt-6 p-6" style={{ "--mc": "#00e5ff" }}>
      <div className="mb-4 flex items-center justify-between">
        <span className="mono-id flex items-center gap-2 text-cyan"><Printer size={13} /> Fabrication Unit — resume.pdf</span>
        <span className="mono-id" style={{ color: state === "ready" ? "#00ffb2" : "#a9b1c7" }}>
          {state === "idle" ? "STANDBY" : state === "printing" ? "FABRICATING…" : "READY"}
        </span>
      </div>

      <div className="mx-auto w-60">
        {/* printer body + slot */}
        <div className="relative z-10 border border-white/10 bg-gradient-to-b from-white/5 to-transparent px-4 pb-3 pt-4"
          style={{ clipPath: "polygon(0 0,100% 0,100% 100%,0 100%)" }}>
          <div className="mb-2 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            <span className="h-1.5 w-1.5 rounded-full bg-cyan/60" />
            <span className="ml-auto mono-id">V.TANDEL // CV</span>
          </div>
          <div className="printer-slot" />
        </div>

        {/* emerging sheet */}
        <div className="relative mx-6 h-[150px] overflow-hidden">
          <motion.div
            initial={{ height: 0 }} animate={{ height: state === "idle" ? 0 : 150 }}
            transition={{ duration: 2, ease: [0.7, 0, 0.2, 1] }}
            className="printer-sheet absolute left-0 right-0 top-0 overflow-hidden"
          >
            <div className="p-3">
              <div className="font-mono text-[10px] text-cyan">VANSH TANDEL</div>
              <div className="mono-id mb-2">SDE // DevOps &amp; Full Stack</div>
              {[0.9, 0.6, 0.75, 0.5, 0.8, 0.65, 0.4].map((w, i) => (
                <div key={i} className="mb-1.5 h-1 rounded bg-white/15" style={{ width: `${w * 100}%` }} />
              ))}
            </div>
            {state === "printing" && (
              <motion.div className="absolute inset-x-0 h-6" style={{ background: "linear-gradient(180deg, transparent, rgba(0,229,255,0.25), transparent)" }}
                animate={{ top: ["-10%", "110%"] }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} />
            )}
          </motion.div>
        </div>

        {/* control */}
        <div className="mt-3 flex justify-center">
          <AnimatePresence mode="wait">
            {state !== "ready" ? (
              <motion.button key="fab" onClick={run} disabled={state === "printing"} data-cursor="hover"
                className="btn-primary disabled:opacity-60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {state === "printing" ? <Loader2 size={16} className="animate-spin" /> : <Printer size={16} />}
                {state === "printing" ? "Fabricating…" : "Fabricate résumé"}
              </motion.button>
            ) : (
              <motion.a key="dl" href={socials.resume} target="_blank" rel="noreferrer" data-cursor="hover"
                className="btn-primary" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                <Download size={16} /> Download résumé
              </motion.a>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
