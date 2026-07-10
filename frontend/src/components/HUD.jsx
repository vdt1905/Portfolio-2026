import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, FolderGit2, Server, Cpu, SquareTerminal, Trophy, Radio,
  Sun, Moon, Volume2, VolumeX, Gauge,
} from "lucide-react";
import { useStore } from "../store/useStore";
import { ZONES, NAV_ORDER } from "../data/zones";
import { profile } from "../data/portfolio";

const ICONS = { Bot, FolderGit2, Server, Cpu, SquareTerminal, Trophy, Radio };
const QLABEL = { high: "HIGH", medium: "MED", low: "LOW" };

/** Mission-control HUD: identity, live telemetry, module status, nav dock. */
export default function HUD() {
  const { booted, activeZone, openZone, closeZone, hovered, theme, toggleTheme, muted, toggleMuted, quality, cycleQuality } = useStore();
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString("en-GB"));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!booted) return null;

  const moduleName = activeZone ? ZONES[activeZone]?.label : "Engineering Workspace";

  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      {/* ---------- top bar ---------- */}
      <motion.div
        initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="pointer-events-auto absolute left-0 right-0 top-0 flex items-center justify-between px-6 py-5 md:px-10"
      >
        <button onClick={() => closeZone()} className="group flex items-center gap-3" data-cursor="hover">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
          </span>
          <span className="font-display text-sm font-semibold tracking-tight">{profile.name}</span>
          <span className="hidden font-mono text-[11px] text-muted lg:inline">/ NEXUS ORBITAL STATION</span>
        </button>

        <div className="flex items-center gap-2">
          {/* telemetry chips */}
          <div className="mr-1 hidden items-center gap-1.5 md:flex">
            <Telemetry label="STATUS" value="ONLINE" dot="#00ffb2" />
            <Telemetry label="SYS" value="100%" dot="#00e5ff" />
            <Telemetry label="GITHUB" value="SYNCED" dot="#6c63ff" />
            <Telemetry label="UTC" value={clock} mono />
          </div>
          <button onClick={cycleQuality} className="hud-icon !w-auto gap-1.5 px-2.5" aria-label="Render quality" data-cursor="hover">
            <Gauge size={15} /><span className="font-mono text-[10px]">{QLABEL[quality]}</span>
          </button>
          <button onClick={toggleMuted} className="hud-icon" aria-label="Toggle sound" data-cursor="hover">
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button onClick={toggleTheme} className="hud-icon" aria-label="Toggle theme" data-cursor="hover">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </motion.div>

      {/* ---------- bottom-left mission readout ---------- */}
      <motion.div
        initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
        className="absolute bottom-6 left-6 hidden md:block"
      >
        <div className="hud-bracket px-4 py-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">Current Module</div>
          <div className="mt-0.5 font-display text-sm font-semibold text-cyan">{moduleName}</div>
          <div className="mt-1 font-mono text-[10px] text-muted">
            TARGET <span className="text-highlight">{hovered || "—"}</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 font-mono text-[10px] text-muted">
            <span className="h-1 w-1 rounded-full bg-success" /> VISITOR <span className="text-success">CONNECTED</span>
          </div>
        </div>
      </motion.div>

      {/* ---------- hovered readout (mobile / center) ---------- */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 md:bottom-32">
        <AnimatePresence mode="wait">
          {hovered && !activeZone && (
            <motion.div key={hovered} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="glass rounded-full px-4 py-1.5 font-mono text-xs text-cyan md:hidden">
              ◦ {hovered}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {!activeZone && !hovered && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 1.2 }}
            className="absolute bottom-28 left-1/2 -translate-x-1/2 text-center md:bottom-32">
            <p className="font-mono text-xs text-muted">hover a console · click to dock · or use the dock ↓</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- navigation dock ---------- */}
      <motion.nav
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="pointer-events-auto absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-2xl glass-strong px-2 py-2 md:gap-1.5"
      >
        {NAV_ORDER.map((id) => {
          const zone = ZONES[id];
          const Icon = ICONS[zone.icon];
          const active = activeZone === id;
          return (
            <button key={id} onClick={() => openZone(id)} className={`dock-btn ${active ? "dock-btn--active" : ""}`} data-cursor="hover" aria-label={zone.label}>
              <Icon size={18} strokeWidth={1.6} />
              <span className="dock-tip">{zone.label}</span>
            </button>
          );
        })}
      </motion.nav>
    </div>
  );
}

function Telemetry({ label, value, dot, mono }) {
  return (
    <div className="hud-bracket flex items-center gap-2 px-2.5 py-1.5">
      {dot && <span className="h-1.5 w-1.5 rounded-full" style={{ background: dot, boxShadow: `0 0 6px ${dot}` }} />}
      <span className="font-mono text-[9px] uppercase tracking-widest text-muted">{label}</span>
      <span className={`font-mono text-[10px] text-white ${mono ? "tabular-nums" : ""}`}>{value}</span>
    </div>
  );
}
