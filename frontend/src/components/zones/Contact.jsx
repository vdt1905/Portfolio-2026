import { motion } from "framer-motion";
import { Mail, Code2, Contact as ContactIcon, FileText, Calendar, Send } from "lucide-react";
import Overlay from "../Overlay";
import { profile, socials } from "../../data/portfolio";

/** ZONE 9 — Contact console. Signal-transmission channels. */
export default function Contact() {
  const channels = [
    { label: "Email", icon: Mail, href: `mailto:${profile.email}`, accent: "#00e5ff", detail: profile.email },
    { label: "GitHub", icon: Code2, href: socials.github, accent: "#ffffff", detail: "See the code" },
    { label: "LinkedIn", icon: ContactIcon, href: socials.linkedin, accent: "#6c63ff", detail: "Let's connect" },
    { label: "Resume", icon: FileText, href: socials.resume, accent: "#00ff9c", detail: "Download PDF" },
    { label: "Calendar", icon: Calendar, href: socials.calendar, accent: "#00e5ff", detail: "Book a call" },
  ];

  return (
    <Overlay kicker="Zone 09 — Comms Console" title="Transmit a Signal" accent="#00ff9c">
      {/* animated signal */}
      <div className="relative mb-8 flex items-center justify-center py-8">
        <div className="relative h-24 w-24">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute inset-0 rounded-full border border-success/40"
              animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }}
            />
          ))}
          <div className="absolute inset-0 grid place-items-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-success/15 text-success" style={{ boxShadow: "0 0 30px #00ff9c" }}>
              <Send size={22} />
            </div>
          </div>
        </div>
      </div>

      <p className="mx-auto mb-8 max-w-md text-center text-muted">
        Building something ambitious, or looking for an engineer who ships? The channel is open.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {channels.map((c, i) => (
          <motion.a
            key={c.label}
            href={c.href}
            target={c.href.startsWith("mailto") ? undefined : "_blank"}
            rel="noreferrer"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            data-cursor="hover"
            className="group flex items-center gap-4 rounded-2xl glass p-5"
          >
            <div
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-transform group-hover:scale-110"
              style={{ background: `${c.accent}18`, color: c.accent, boxShadow: `0 0 20px -6px ${c.accent}` }}
            >
              <c.icon size={20} />
            </div>
            <div>
              <div className="font-display font-semibold">{c.label}</div>
              <div className="text-xs text-muted">{c.detail}</div>
            </div>
          </motion.a>
        ))}
      </div>

      <div className="mt-8 text-center font-mono text-xs text-muted">
        <span className="text-success">●</span> {profile.availability} — {profile.location}
      </div>
    </Overlay>
  );
}
