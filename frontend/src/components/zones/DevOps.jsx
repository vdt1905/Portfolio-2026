import { motion } from "framer-motion";
import { GitBranch, Box, CheckCircle2, Activity } from "lucide-react";
import Overlay from "../Overlay";
import { pipeline, devopsStack } from "../../data/portfolio";

/** ZONE 5 — DevOps Lab. Animated CI/CD pipeline + infra stack. */
export default function DevOps() {
  return (
    <Overlay kicker="Zone 05 — DevOps Lab" title="Infrastructure" accent="#00ff9c">
      <p className="max-w-xl text-muted">
        Where code becomes production. Every commit flows through an automated pipeline —
        built, tested, containerized, and shipped without a human touching a server.
      </p>

      {/* animated pipeline */}
      <div className="mt-8 overflow-x-auto pb-2">
        <div className="flex min-w-max items-stretch gap-0">
          {pipeline.map((s, i) => (
            <motion.div
              key={s.stage}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center"
            >
              <div className="relative w-32 rounded-xl glass p-4 text-center">
                <div className="font-display text-sm font-semibold text-success">{s.stage}</div>
                <div className="mt-1 text-[11px] text-muted">{s.detail}</div>
                {/* flowing packet */}
              </div>
              {i < pipeline.length - 1 && (
                <div className="relative mx-1 h-px w-8 bg-white/10">
                  <motion.span
                    className="absolute -top-[3px] h-1.5 w-1.5 rounded-full bg-success"
                    style={{ boxShadow: "0 0 8px #00ff9c" }}
                    animate={{ left: ["0%", "100%"], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* live-ish panels */}
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <Panel icon={GitBranch} title="Branch Strategy" accent="#6c63ff">
          <div className="font-mono text-xs leading-6 text-muted">
            <div><span className="text-violet">main</span> ────●────●────●─▶</div>
            <div className="pl-8">╲__ feat/agent ●─▶</div>
            <div className="pl-8">╲__ fix/latency ●─▶</div>
          </div>
        </Panel>

        <Panel icon={Box} title="Containers" accent="#00e5ff">
          {["api", "worker", "web", "redis"].map((c) => (
            <div key={c} className="flex items-center justify-between font-mono text-xs">
              <span className="text-white/70">{c}</span>
              <span className="flex items-center gap-1.5 text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> running
              </span>
            </div>
          ))}
        </Panel>

        <Panel icon={Activity} title="Monitoring" accent="#00ff9c">
          <div className="flex items-end gap-1 h-14">
            {[40, 65, 50, 80, 60, 90, 70, 85, 55, 75].map((h, i) => (
              <motion.span
                key={i}
                className="flex-1 rounded-sm bg-success/50"
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.05, type: "spring" }}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center gap-1.5 font-mono text-xs text-success">
            <CheckCircle2 size={13} /> 99.9% uptime
          </div>
        </Panel>
      </div>

      {/* logs */}
      <div className="mt-6 rounded-xl border border-white/8 bg-black/40 p-4 font-mono text-xs leading-6">
        <span className="text-muted">$ docker compose up -d --build</span>
        <div className="text-white/60">{"[+] Building 12.4s ... => exporting layers"}</div>
        <div className="text-white/60">✔ Container api      Started</div>
        <div className="text-white/60">✔ Container web      Started</div>
        <div className="text-success">deploy complete — all services healthy ✓</div>
      </div>

      {/* stack */}
      <div className="mt-8 mb-2 font-mono text-xs uppercase tracking-[0.25em] text-muted">toolbelt</div>
      <div className="flex flex-wrap gap-1.5">
        {devopsStack.map((t) => <span key={t} className="chip">{t}</span>)}
      </div>
    </Overlay>
  );
}

function Panel({ icon: Icon, title, accent, children }) {
  return (
    <div className="glass rounded-xl p-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold" style={{ color: accent }}>
        <Icon size={15} /> {title}
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}
