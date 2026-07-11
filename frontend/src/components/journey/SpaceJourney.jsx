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
    if (idx !== activeRef.current) { activeRef.current = idx; setActive(idx); }
  };

  const goTo = (i) => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    el.scrollTo({ top: (i / (STOPS.length - 1)) * max, behavior: "smooth" });
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
                {stop.lesson && (
                  <div className="mt-4 border-l-2 pl-3 text-sm italic text-white/70" style={{ borderColor: stop.accent }}>
                    “{stop.lesson}”
                  </div>
                )}
              </div>
            </motion.div>
          )}
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
    "Loading planetary surfaces",
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
