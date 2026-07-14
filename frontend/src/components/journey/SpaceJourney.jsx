import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Rocket } from "lucide-react";
import * as THREE from "three";
import { useStore, QUALITY } from "../../store/useStore";
import { STOPS, CLOSING } from "../../data/journey";
import { earthTextures, gasGiantTextures, moonTextures, glowTexture } from "../../three/spaceTextures";

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

/* ============================================================ */
export default function SpaceJourney() {
  const closeZone = useStore((s) => s.closeZone);
  const quality = useStore((s) => s.quality);
  const q = QUALITY[quality] || QUALITY.high;

  const scrollRef = useRef(null);
  const progress = useRef(0);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [started, setStarted] = useState(false);
  const [deepDive, setDeepDive] = useState(null);

  // launch loader: boot animation -> mount canvas (generate textures) -> ready
  const [phase, setPhase] = useState("boot"); // boot | mounting | ready
  useEffect(() => {
    const t = setTimeout(() => setPhase("mounting"), 2200);
    return () => clearTimeout(t);
  }, []);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    const p = max > 0 ? el.scrollTop / max : 0;
    progress.current = p;
    if (!started && p > 0.002) setStarted(true);
    const idx = Math.round(p * (STOPS.length - 1));
    if (idx !== activeRef.current) { activeRef.current = idx; setActive(idx); setDeepDive(null); }
  };

  const goTo = (i) => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    el.scrollTo({ top: (i / (STOPS.length - 1)) * max, behavior: "smooth" });
    activeRef.current = i;
    setActive(i);
    setDeepDive(null);
  };

  const stop = STOPS[active];
  const isDeep = active === STOPS.length - 1;

  return (
    <motion.div
      className="pointer-events-auto fixed inset-0 z-40 overflow-hidden bg-[#02040A]"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
    >
      {/* ---------- flight scene ---------- */}
      <div className="pointer-events-none absolute inset-0">
        {phase !== "boot" && (
        <Canvas
          dpr={[1, q.dpr]} gl={{ antialias: true, powerPreference: "high-performance" }}
          camera={{ position: [7, 1.6, 15], fov: 50, near: 0.1, far: 800 }}
          onCreated={({ gl }) => { gl.setClearColor("#02040A"); setTimeout(() => setPhase("ready"), 350); }}
        >
          <Suspense fallback={null}>
            <fog attach="fog" args={["#02040A", 90, 340]} />
            <ambientLight intensity={0.16} />
            <directionalLight position={[40, 24, 50]} intensity={2.6} color="#fff4e6" />
            <Starfield count={q.stars} />
            {STOPS.map((s) => <Body key={s.id} stop={s} />)}
            <Flight progress={progress} />
            {q.effects && (
              <EffectComposer disableNormalPass multisampling={0}>
                <Bloom intensity={0.5} luminanceThreshold={0.55} luminanceSmoothing={0.9} mipmapBlur radius={0.6} />
                <Vignette offset={0.3} darkness={0.62} />
              </EffectComposer>
            )}
            <AdaptiveDpr pixelated />
          </Suspense>
        </Canvas>
        )}
      </div>

      {/* ---------- launch loader ---------- */}
      <AnimatePresence>{phase !== "ready" && <LaunchLoader />}</AnimatePresence>

      {/* ---------- scroll driver (transparent) ---------- */}
      <div ref={scrollRef} onScroll={onScroll} className="scroll-area absolute inset-0 z-10 overflow-y-auto overflow-x-hidden">
        {STOPS.map((s) => <section key={s.id} className="h-[130vh] w-full" aria-label={s.name} />)}
      </div>

      {/* ---------- HUD ---------- */}
      <div className="pointer-events-none absolute inset-0 z-20">
        {/* top bar */}
        <div className="absolute left-5 top-5 flex items-center gap-3">
          <button onClick={closeZone} className="hud-icon pointer-events-auto" aria-label="Exit" data-cursor="hover"><X size={16} /></button>
          <div>
            <div className="mono-id text-cyan">Mission Log</div>
            <div className="font-display text-sm font-semibold">Engineering Journey · 2023–2027</div>
          </div>
        </div>

        {/* progress rail */}
        <div className="pointer-events-auto absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-2.5 md:flex">
          {STOPS.map((s, i) => (
            <button key={s.id} onClick={() => goTo(i)} className="group flex items-center gap-2" data-cursor="hover">
              <span className={`font-mono text-[10px] transition-opacity ${i === active ? "opacity-100" : "opacity-0 group-hover:opacity-60"}`} style={{ color: s.accent }}>
                {s.name}
              </span>
              <span className="h-2.5 w-2.5 rotate-45 border transition-all" style={{
                borderColor: s.accent,
                background: i === active ? s.accent : "transparent",
                boxShadow: i === active ? `0 0 10px ${s.accent}` : "none",
                transform: i === active ? "rotate(45deg) scale(1.3)" : "rotate(45deg)",
              }} />
            </button>
          ))}
        </div>

        <div className="pointer-events-auto absolute bottom-4 left-1/2 hidden max-w-[78vw] -translate-x-1/2 gap-2 overflow-x-auto border border-white/10 bg-black/45 p-2 backdrop-blur md:flex">
          {STOPS.filter((s) => s.kind !== "galaxy").map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              className="shrink-0 border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition hover:bg-white/10"
              style={{
                color: active === i ? "#fff" : s.accent,
                borderColor: active === i ? s.accent : `${s.accent}66`,
                background: active === i ? `${s.accent}22` : "transparent",
                boxShadow: active === i ? `0 0 12px ${s.accent}55` : "none",
              }}
              data-cursor="hover"
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* start hint */}
        <AnimatePresence>
          {!started && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
              <div className="mb-2 flex justify-center"><Rocket size={18} className="text-cyan" /></div>
              <p className="font-mono text-xs text-muted">scroll to launch — fly the mission</p>
              <ChevronDown size={16} className="mx-auto mt-1 animate-bounce text-cyan" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* milestone HUD panel */}
        <AnimatePresence mode="wait">
          {started && !isDeep && (
            <motion.div
              key={stop.id}
              initial={{ opacity: 0, x: 60, y: 20 }} animate={{ opacity: 1, x: 0, y: 0 }} exit={{ opacity: 0, x: 40 }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              className="pointer-events-auto absolute bottom-8 left-5 w-[min(420px,88vw)] md:left-10"
            >
              <div className="module holo-scan p-6" style={{ "--mc": stop.accent }}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="mono-id" style={{ color: stop.accent }}>{stop.theme}</span>
                  <span className="font-mono text-2xl font-bold" style={{ color: stop.accent }}>{stop.year}</span>
                </div>
                <h2 className="font-display text-3xl font-semibold">{stop.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{stop.detail}</p>

                {stop.skills.length > 0 && (
                  <>
                    <div className="mt-4 mb-1.5 mono-id">Skills acquired</div>
                    <div className="flex flex-wrap gap-1.5">
                      {stop.skills.map((s) => <span key={s} className="chip">{s}</span>)}
                    </div>
                  </>
                )}
                {stop.projects.length > 0 && (
                  <>
                    <div className="mt-3 mb-1.5 mono-id">Milestones</div>
                    <div className="flex flex-wrap gap-1.5">
                      {stop.projects.map((p) => (
                        <span key={p} className="rounded-sm px-2 py-0.5 text-xs font-medium" style={{ color: stop.accent, background: `${stop.accent}18` }}>{p}</span>
                      ))}
                    </div>
                  </>
                )}
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setDeepDive(stop)}
                    className="border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
                    style={{ borderColor: stop.accent, background: `${stop.accent}22`, boxShadow: `0 0 14px ${stop.accent}44` }}
                    data-cursor="hover"
                  >
                    Deep dive
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo(Math.max(0, active - 1))}
                    className="border border-white/15 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/70 transition hover:bg-white/10"
                    data-cursor="hover"
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={() => goTo(Math.min(STOPS.length - 2, active + 1))}
                    className="border border-white/15 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/70 transition hover:bg-white/10"
                    data-cursor="hover"
                  >
                    Next
                  </button>
                </div>
                {stop.lesson && (
                  <div className="mt-4 border-l-2 pl-3 text-sm italic text-white/70" style={{ borderColor: stop.accent }}>
                    “{stop.lesson}”
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {deepDive && <DeepDiveScreen stop={deepDive} onClose={() => setDeepDive(null)} />}
        </AnimatePresence>

        {/* deep-space finale */}
        <AnimatePresence>
          {isDeep && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}
              className="absolute inset-0 grid place-items-center text-center">
              <div>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1 }}
                  className="font-display text-4xl font-semibold tracking-tight text-gradient md:text-6xl">
                  The journey has only begun.
                </motion.h1>
                <div className="mt-6 space-y-1">
                  {CLOSING.map((l, i) => (
                    <motion.p key={l} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.3 }}
                      className="font-mono text-sm tracking-widest text-cyan md:text-base">{l}</motion.p>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ============================================================
   Launch loader
   ============================================================ */
function LaunchLoader() {
  const steps = [
    "Calibrating navigation array",
    "Loading journey scenes",
    "Charting route · 2023 → 2027",
    "Spooling ion engines",
  ];
  const [done, setDone] = useState(0);
  useEffect(() => {
    const ids = steps.map((_, i) => setTimeout(() => setDone(i + 1), 350 + i * 440));
    return () => ids.forEach(clearTimeout);
  }, []);
  return (
    <motion.div
      className="absolute inset-0 z-[60] grid place-items-center bg-[#02040A]"
      initial={{ opacity: 1 }} exit={{ opacity: 0, filter: "blur(10px)" }} transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1] }}
    >
      {/* faint orbit rings behind */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center opacity-30">
        {[220, 320, 440].map((d, i) => (
          <motion.div key={d} className="absolute rounded-full border border-cyan/20"
            style={{ width: d, height: d }} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 40 + i * 20, ease: "linear" }} />
        ))}
      </div>

      <div className="relative w-[min(440px,88vw)] px-6">
        <div className="mb-6 flex items-center gap-3">
          <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}>
            <Rocket className="text-cyan" size={22} />
          </motion.div>
          <div>
            <div className="mono-id text-cyan">Engineering Journey</div>
            <div className="font-display text-lg font-semibold">Flight systems initializing…</div>
          </div>
        </div>

        <div className="space-y-1.5 font-mono text-sm">
          {steps.map((s, i) => (
            <motion.div key={s} initial={{ opacity: 0.25 }} animate={{ opacity: i < done ? 1 : 0.28 }}
              className="flex items-center gap-2">
              <span className={i < done ? "text-success" : "text-muted"}>{i < done ? "[ OK ]" : "[ ·· ]"}</span>
              <span className="text-white/80">{s}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 h-1 w-full overflow-hidden bg-white/10">
          <motion.div className="h-full" style={{ background: "#00e5ff", boxShadow: "0 0 12px #00e5ff" }}
            initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2, ease: [0.4, 0, 0.2, 1] }} />
        </div>
        <div className="mt-2 flex justify-between mono-id">
          <span>T-00 · LAUNCH SEQUENCE</span>
          <motion.span className="text-cyan" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2 }}>READY</motion.span>
        </div>
      </div>
    </motion.div>
  );
}

const DEEP_PLANET = {
  earth: {
    surface: "radial-gradient(circle at 34% 28%, #f2fbff 0 5%, #66b8ff 6% 18%, #1f7fbd 19% 34%, #8a815f 35% 46%, #143c61 47% 68%, #050b12 69% 100%)",
    glow: "#5fb0ff",
  },
  moon: {
    surface: "radial-gradient(circle at 35% 28%, #ffffff 0 5%, #d8dbe2 6% 24%, #8f97a5 25% 45%, #414956 46% 68%, #080a0e 69% 100%)",
    glow: "#c8ccd4",
  },
  iss: {
    surface: "linear-gradient(135deg, #080b14 0%, #26365f 34%, #dce6ff 39%, #8b7bff 45%, #101526 55%, #05070c 100%)",
    glow: "#8b7bff",
  },
  mars: {
    surface: "radial-gradient(circle at 35% 28%, #ffd0ad 0 6%, #e17245 7% 27%, #9e3c24 28% 50%, #46140c 51% 72%, #070403 73% 100%)",
    glow: "#d9603b",
  },
  jupiter: {
    surface: "repeating-linear-gradient(168deg, #27180e 0 7%, #774b2f 7% 14%, #d8a06a 14% 22%, #e8c993 22% 30%, #5d3922 30% 38%)",
    glow: "#d8a06a",
  },
  saturn: {
    surface: "radial-gradient(circle at 38% 30%, #fff4d0 0 7%, #e8d29a 8% 30%, #a98b5f 31% 50%, #372719 51% 72%, #070503 73% 100%)",
    glow: "#e8d29a",
  },
  uranus: {
    surface: "radial-gradient(circle at 35% 28%, #ecffff 0 6%, #8be8f2 7% 30%, #4c98a8 31% 54%, #14333d 55% 74%, #03080b 75% 100%)",
    glow: "#7fd6e6",
  },
  neptune: {
    surface: "radial-gradient(circle at 35% 28%, #dbe8ff 0 6%, #5f83e8 7% 30%, #2746a8 31% 56%, #0a174e 57% 76%, #02040d 77% 100%)",
    glow: "#4f7ae0",
  },
};

const DEEP_IMAGE = {
  earth: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1800&q=85",
  moon: "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=1800&q=85",
  iss: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?auto=format&fit=crop&w=1800&q=85",
  mars: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1800&q=85",
  jupiter: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1800&q=85",
  saturn: "https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&w=1800&q=85",
  uranus: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85",
  neptune: "https://images.unsplash.com/photo-1504333638930-c8787321eee0?auto=format&fit=crop&w=1800&q=85",
};

function SciFiCard({ stop, eyebrow, title, children, image, delay = 0, action, onAction }) {
  return (
    <motion.div
      className="group relative min-h-64 overflow-hidden border bg-[#06101b]/78 p-5 backdrop-blur-xl"
      style={{
        "--mc": stop.accent,
        borderColor: `${stop.accent}66`,
        clipPath: "polygon(0 0, calc(100% - 26px) 0, 100% 26px, 100% 100%, 22px 100%, 0 calc(100% - 22px))",
        boxShadow: `0 0 34px -18px ${stop.accent}, inset 0 0 0 1px rgba(255,255,255,0.04)`,
      }}
      initial={{ opacity: 0, y: 34, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 210, damping: 24 }}
    >
      <div className="absolute inset-0 opacity-52" style={{ backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,4,10,0.16),rgba(2,4,10,0.86)_62%,rgba(2,4,10,0.96)),radial-gradient(circle_at_78%_22%,rgba(255,255,255,0.12),transparent_24%)]" />
      <div className="absolute inset-x-5 top-4 h-px" style={{ background: `linear-gradient(90deg, ${stop.accent}, transparent)` }} />
      <div className="absolute bottom-4 right-5 h-px w-24" style={{ background: `linear-gradient(90deg, transparent, ${stop.accent})` }} />

      <div className="relative flex min-h-52 flex-col">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: stop.accent }}>{eyebrow}</div>
        <h3 className="mt-1 font-display text-2xl font-semibold uppercase tracking-wide">{title}</h3>
        <div className="mt-auto pt-8 text-sm leading-relaxed text-white/78">{children}</div>
        {action && (
          <button
            type="button"
            onClick={onAction}
            className="mt-5 border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
            style={{ borderColor: `${stop.accent}AA`, background: `${stop.accent}16` }}
            data-cursor="hover"
          >
            {action}
          </button>
        )}
      </div>
    </motion.div>
  );
}

function DeepDiveScreen({ stop, onClose }) {
  const heroImage = DEEP_IMAGE[stop.id] || DEEP_IMAGE.earth;

  return (
    <motion.div
      className="pointer-events-auto absolute inset-0 z-40 overflow-hidden bg-[#02040A]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.28, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.12, opacity: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(255,255,255,0.16),transparent_18%),radial-gradient(circle_at_20%_70%,rgba(0,229,255,0.08),transparent_28%)]" />
        <div className="absolute inset-0 opacity-45" style={{ backgroundImage: `url(${heroImage})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-[#02040A]/40" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,4,10,0.74)_0%,rgba(2,4,10,0.56)_42%,rgba(2,4,10,0.88)_100%)]" />
      </motion.div>

      <div className="relative z-10 flex h-full flex-col overflow-y-auto p-5 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mono-id" style={{ color: stop.accent }}>{stop.year} // {stop.theme}</div>
            <h1 className="mt-2 font-display text-4xl font-semibold md:text-6xl">{stop.name}</h1>
          </div>
          <button onClick={onClose} className="hud-icon" aria-label="Close deep dive" data-cursor="hover"><X size={16} /></button>
        </div>

        <div className="mt-10 grid gap-4 pb-8 md:ml-auto md:w-[min(920px,66vw)] md:grid-cols-2 xl:grid-cols-3">
          <SciFiCard stop={stop} eyebrow="Mission Overview" title={stop.name} image={heroImage} delay={0.18} action="Continue timeline" onAction={onClose}>
            {stop.detail}
          </SciFiCard>

          <SciFiCard stop={stop} eyebrow="Skill Module" title="Capabilities" image={DEEP_IMAGE.jupiter} delay={0.26}>
            <div className="flex flex-wrap gap-2">
              {stop.skills.map((s) => <span key={s} className="chip">{s}</span>)}
            </div>
          </SciFiCard>

          <SciFiCard stop={stop} eyebrow="Milestones" title="Progress Log" image={DEEP_IMAGE.saturn} delay={0.34}>
            <div className="flex flex-wrap gap-2">
              {stop.projects.map((p) => <span key={p} className="rounded-sm px-2 py-1 text-xs font-medium" style={{ color: stop.accent, background: `${stop.accent}18` }}>{p}</span>)}
            </div>
          </SciFiCard>

          <SciFiCard stop={stop} eyebrow="Experience Log" title="Lesson" image={DEEP_IMAGE.iss} delay={0.42} action="Close deep dive" onAction={onClose}>
            <span className="italic">"{stop.lesson || "Still in progress."}"</span>
          </SciFiCard>
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================================
   Bodies
   ============================================================ */
function Body({ stop }) {
  if (stop.kind === "galaxy") return <Galaxy pos={stop.pos} />;
  if (stop.kind === "station") return <ISS pos={stop.pos} spin={stop.spin} />;
  return <Planet stop={stop} />;
}

function AtmoTight({ radius, color, intensity }) {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uIntensity: { value: intensity } },
    vertexShader: `varying vec3 vN; varying vec3 vP; void main(){ vN=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(position,1.0); vP=mv.xyz; gl_Position=projectionMatrix*mv; }`,
    fragmentShader: `varying vec3 vN; varying vec3 vP; uniform vec3 uColor; uniform float uIntensity; void main(){ vec3 v=normalize(-vP); float f=pow(1.0-max(dot(vN,v),0.0),6.0); gl_FragColor=vec4(uColor*f*uIntensity,f); }`,
    transparent: true, blending: THREE.AdditiveBlending, side: THREE.BackSide, depthWrite: false, fog: false,
  }), [color, intensity]);
  return <mesh scale={radius * 1.03}><sphereGeometry args={[1, 40, 40]} /><primitive object={mat} attach="material" /></mesh>;
}

function Planet({ stop }) {
  const surf = useRef(), cloud = useRef();
  const t = useMemo(() => {
    if (stop.kind === "earth") return earthTextures(768, 384);
    if (stop.kind === "mars") return moonTextures();
    return gasGiantTextures(512, 256, stop.palette);
  }, [stop.kind, stop.palette]);
  useFrame((_, d) => {
    if (surf.current) surf.current.rotation.y += d * stop.spin;
    if (cloud.current) cloud.current.rotation.y += d * stop.spin * 1.3;
  });
  const isEarth = stop.kind === "earth";
  const isMars = stop.kind === "mars";
  return (
    <group position={stop.pos} rotation={[0.3, 0, 0.12]}>
      {(isEarth || stop.kind === "gas") && <AtmoTight radius={stop.radius} color={stop.accent} intensity={isEarth ? 0.5 : 0.35} />}
      <mesh ref={surf}>
        <sphereGeometry args={[stop.radius, 64, 64]} />
        <meshStandardMaterial
          map={t.map} normalMap={t.normalMap} normalScale={[0.5, 0.5]}
          roughnessMap={t.roughnessMap || null}
          color={isMars ? "#b8603f" : "#ffffff"}
          emissiveMap={isEarth ? t.night : null}
          emissive={isEarth ? "#ffcf8c" : "#000000"} emissiveIntensity={isEarth ? 1.0 : 0}
          roughness={1} metalness={0} fog={false}
        />
      </mesh>
      {isEarth && t.clouds && (
        <mesh ref={cloud} scale={1.012}><sphereGeometry args={[stop.radius, 48, 48]} />
          <meshStandardMaterial map={t.clouds} transparent depthWrite={false} roughness={1} metalness={0} color="#d6dde6" fog={false} /></mesh>
      )}
      {stop.rings && (
        <group rotation={[Math.PI / 2.1, 0, 0.28]}>
          <mesh><ringGeometry args={[stop.radius * 1.4, stop.radius * 2.0, 128]} /><meshBasicMaterial color={stop.accent} transparent opacity={0.35} side={THREE.DoubleSide} depthWrite={false} fog={false} /></mesh>
          <mesh><ringGeometry args={[stop.radius * 2.1, stop.radius * 2.45, 128]} /><meshBasicMaterial color={stop.accent} transparent opacity={0.18} side={THREE.DoubleSide} depthWrite={false} fog={false} /></mesh>
        </group>
      )}
    </group>
  );
}

function ISS({ pos, spin }) {
  const g = useRef();
  useFrame((_, d) => { if (g.current) g.current.rotation.y += d * spin; });
  return (
    <group ref={g} position={pos} scale={0.9}>
      <mesh><boxGeometry args={[0.5, 0.5, 3]} /><meshStandardMaterial color="#d6d9e0" metalness={0.6} roughness={0.4} fog={false} /></mesh>
      <mesh><boxGeometry args={[5, 0.08, 0.08]} /><meshStandardMaterial color="#9aa2b0" metalness={0.6} roughness={0.4} fog={false} /></mesh>
      {[-2, -1.1, 1.1, 2].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]}><boxGeometry args={[0.8, 0.02, 1.6]} />
          <meshStandardMaterial color="#0a2a4a" emissive="#2b6cff" emissiveIntensity={0.4} metalness={0.3} roughness={0.5} toneMapped={false} fog={false} /></mesh>
      ))}
      <mesh position={[0, 0, 1.7]}><cylinderGeometry args={[0.4, 0.4, 0.8, 16]} /><meshStandardMaterial color="#c2c6d0" metalness={0.6} roughness={0.4} fog={false} /></mesh>
      <pointLight position={[0, 0, 1.9]} intensity={2} distance={6} color="#8b7bff" />
    </group>
  );
}

function Galaxy({ pos }) {
  const tex = useMemo(() => glowTexture("#bcd0ff", 0.42), []);
  return (
    <sprite position={pos} scale={[60, 22, 1]}>
      <spriteMaterial map={tex} transparent opacity={0.5} rotation={0.4} depthWrite={false} blending={THREE.AdditiveBlending} fog={false} />
    </sprite>
  );
}

/* ============================================================
   Starfield + flight camera
   ============================================================ */
function Starfield({ count = 3000 }) {
  const geo = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 120 + Math.random() * 300;
      const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.cos(ph);
      pos[i * 3 + 2] = -Math.abs(r * Math.sin(ph) * Math.sin(th)) - 20; // bias down the flight path
    }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); return g;
  }, [count]);
  return <points geometry={geo}><pointsMaterial size={0.5} color="#cfe0ff" transparent opacity={0.75} sizeAttenuation depthWrite={false} fog={false} /></points>;
}

function Flight({ progress }) {
  const cur = useRef(0);
  useFrame((state, d) => {
    const cam = state.camera;
    cur.current += (progress.current - cur.current) * Math.min(1, d * 2.2);
    const p = cur.current;
    const N = STOPS.length - 1;
    const f = clamp(p * N, 0, N - 1e-4);
    const i = Math.floor(f), t = f - i;
    const e = t * t * (3 - 2 * t);
    const a = STOPS[i].cam, b = STOPS[i + 1].cam;
    const time = state.clock.elapsedTime;
    cam.position.set(
      lerp(a.pos[0], b.pos[0], e) + Math.sin(time * 0.3) * 0.25,
      lerp(a.pos[1], b.pos[1], e) + Math.sin(time * 0.4) * 0.2,
      lerp(a.pos[2], b.pos[2], e)
    );
    cam.lookAt(
      lerp(a.look[0], b.look[0], e),
      lerp(a.look[1], b.look[1], e),
      lerp(a.look[2], b.look[2], e)
    );
    const roll = clamp((b.pos[0] - a.pos[0]) * 0.006, -0.12, 0.12) * Math.sin(t * Math.PI);
    cam.rotateZ(roll);
  });
  return null;
}
