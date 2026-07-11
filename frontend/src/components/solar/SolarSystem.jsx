import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, AdaptiveDpr } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { X, RotateCcw, MousePointer2, ZoomIn, Database, Boxes } from "lucide-react";
import { SiReact, SiNodedotjs, SiJavascript, SiPython, SiMongodb, SiDocker, SiGit, SiLinux, SiCplusplus } from "react-icons/si";
import * as THREE from "three";
import { useStore } from "../../store/useStore";
import { PLANETS, DOCKER, GIT_BELT, STAR, STATUS_COLOR } from "../../data/solarSystem";
import { planetTexture } from "../../three/planetTextures";

const ALL = [...PLANETS, DOCKER, GIT_BELT];
const SYSTEM_CAM = { x: 0, y: 24, z: 62 };

/* real tech logo per world (Simple Icons + lucide fallbacks) */
const LOGO = {
  react: SiReact, node: SiNodedotjs, js: SiJavascript, python: SiPython,
  mongo: SiMongodb, docker: SiDocker, git: SiGit, linux: SiLinux, cpp: SiCplusplus,
  sql: Database, devops: Boxes,
};

/** Glowing brand logo billboarded on a planet — its identity. */
function PlanetLogo({ id, color, size }) {
  const Icon = LOGO[id];
  if (!Icon) return null;
  return (
    <Html center distanceFactor={size * 9} position={[0, 0, 0]} style={{ pointerEvents: "none" }} zIndexRange={[16, 0]}>
      <Icon size={50} color={color} style={{ filter: `drop-shadow(0 0 12px ${color}) drop-shadow(0 0 4px ${color})`, opacity: 0.97 }} />
    </Html>
  );
}

/* ============================================================ */
export default function SolarSystem() {
  const closeZone = useStore((s) => s.closeZone);
  const [focused, setFocused] = useState(null);
  const [hovered, setHovered] = useState(null);
  const focusData = useMemo(() => ALL.find((p) => p.id === focused), [focused]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") focused ? setFocused(null) : closeZone(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focused, closeZone]);

  return (
    <motion.div
      className="pointer-events-auto fixed inset-0 z-40 bg-[#02040A]"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
    >
      <Canvas
        dpr={[1, 1.7]} gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [SYSTEM_CAM.x, SYSTEM_CAM.y, SYSTEM_CAM.z], fov: 45, near: 0.1, far: 500 }}
        onCreated={({ gl }) => gl.setClearColor("#02040A")}
      >
        <Suspense fallback={null}>
          <System focused={focused} setFocused={setFocused} hovered={hovered} setHovered={setHovered} />
          <EffectComposer disableNormalPass multisampling={0}>
            <Bloom intensity={0.7} luminanceThreshold={0.4} luminanceSmoothing={0.9} mipmapBlur radius={0.6} />
            <Vignette offset={0.3} darkness={0.6} />
          </EffectComposer>
          <AdaptiveDpr pixelated />
        </Suspense>
      </Canvas>

      {/* ---------- UI ---------- */}
      <div className="pointer-events-none absolute inset-0">
        <div className="pointer-events-auto absolute left-5 top-5 flex items-center gap-2">
          <button onClick={() => (focused ? setFocused(null) : closeZone())} className="hud-icon" aria-label="Back" data-cursor="hover"><X size={16} /></button>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan">Engineering Solar System</div>
            <div className="font-display text-sm font-semibold">{focused ? focusData?.name : STAR.name}</div>
          </div>
        </div>

        {!focused && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
            <p className="flex items-center gap-4 font-mono text-[11px] text-muted">
              <span className="flex items-center gap-1"><MousePointer2 size={12} /> drag to orbit</span>
              <span className="flex items-center gap-1"><ZoomIn size={12} /> scroll to zoom</span>
              <span>click a world to explore</span>
            </p>
          </div>
        )}

        <AnimatePresence>
          {focused && focusData && (
            <motion.aside
              key={focused}
              initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="pointer-events-auto absolute left-4 top-1/2 w-[min(380px,90vw)] -translate-y-1/2 md:left-8"
            >
              <div className="console holo-panel holo-scan p-6" style={{ "--pc": focusData.accent, "--mc": focusData.accent }}>
                <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.25em]" style={{ color: focusData.accent }}>{focusData.theme}</div>
                <h2 className="font-display text-3xl font-semibold">{focusData.name}</h2>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: STATUS_COLOR[focusData.status] }} />
                  {focusData.tagline}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-white/80">{focusData.blurb}</p>

                <div className="mt-5 mb-2 font-mono text-[10px] uppercase tracking-widest text-muted">Concepts</div>
                <div className="flex flex-wrap gap-1.5">
                  {focusData.concepts.map((c) => <span key={c} className="chip">{c}</span>)}
                </div>

                <div className="mt-5 mb-2 font-mono text-[10px] uppercase tracking-widest text-muted">Applied in</div>
                <div className="flex flex-wrap gap-1.5">
                  {focusData.projects.map((p) => (
                    <span key={p} className="rounded-md px-2.5 py-1 text-xs font-medium" style={{ color: focusData.accent, background: `${focusData.accent}18` }}>{p}</span>
                  ))}
                </div>

                <button onClick={() => setFocused(null)} className="mt-6 flex items-center gap-2 text-sm text-muted hover:text-white" data-cursor="hover">
                  <RotateCcw size={14} /> Back to system
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* worlds directory — jump to any planet */}
        <WorldsMenu focused={focused} setFocused={setFocused} />
      </div>
    </motion.div>
  );
}

/* ---------- right-side worlds directory ---------- */
function WorldsMenu({ focused, setFocused }) {
  const worlds = [...PLANETS, DOCKER, GIT_BELT];
  return (
    <motion.aside
      initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
      className="pointer-events-auto absolute right-4 top-1/2 hidden w-56 -translate-y-1/2 md:block"
    >
      <div className="console holo-scan p-3" style={{ "--mc": "#00e5ff" }}>
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="mono-id text-cyan">Worlds // Nav</span>
          <span className="mono-id">{worlds.length}</span>
        </div>

        <button
          onClick={() => setFocused(null)}
          data-cursor="hover"
          className="mb-1 flex w-full items-center gap-2.5 px-2 py-1.5 text-left text-sm transition-colors"
          style={{ color: !focused ? "#fff" : "rgba(255,255,255,0.55)", background: !focused ? "rgba(0,229,255,0.1)" : "transparent" }}
        >
          <span className="grid h-4 w-4 place-items-center text-cyan">◎</span>
          System view
        </button>

        <div className="scroll-area max-h-[46vh] overflow-y-auto pr-1">
          {worlds.map((w) => {
            const on = focused === w.id;
            const Icon = LOGO[w.id];
            return (
              <button
                key={w.id}
                onClick={() => setFocused(w.id)}
                data-cursor="hover"
                className="group flex w-full items-center gap-2.5 px-2 py-1.5 text-left text-sm transition-colors"
                style={{ color: on ? "#fff" : "rgba(255,255,255,0.6)", background: on ? `${w.accent}18` : "transparent" }}
              >
                <span className="grid h-5 w-5 shrink-0 place-items-center" style={{ color: w.accent }}>
                  {Icon ? <Icon size={14} /> : <span className="h-2 w-2 rounded-full" style={{ background: w.accent }} />}
                </span>
                <span className="flex-1 truncate">{w.name}</span>
                {on && <span className="h-1.5 w-1.5 rounded-full" style={{ background: w.accent, boxShadow: `0 0 6px ${w.accent}` }} />}
              </button>
            );
          })}
        </div>
      </div>
    </motion.aside>
  );
}

/* ============================================================
   Scene graph — orbit state lives here and drives both the
   planets and the camera focus.
   ============================================================ */
function System({ focused, setFocused, hovered, setHovered }) {
  const controls = useRef();
  const angles = useRef(PLANETS.map((_, i) => i * 1.9));
  const positions = useRef(PLANETS.map(() => new THREE.Vector3()));
  const dockerPos = useRef(new THREE.Vector3());

  useFrame((_, d) => {
    PLANETS.forEach((p, i) => {
      const frozen = focused === p.id || (p.moon && focused === p.moon);
      if (!frozen) angles.current[i] += d * p.orbitSpeed;
      const a = angles.current[i];
      positions.current[i].set(Math.cos(a) * p.orbit, p.y || 0, Math.sin(a) * p.orbit);
    });
  });

  const getFocus = (id) => {
    if (id === DOCKER.id) return { pos: dockerPos.current, size: DOCKER.size * 3 };
    if (id === GIT_BELT.id) return { pos: new THREE.Vector3(0, 3, GIT_BELT.radius), size: 9 };
    const i = PLANETS.findIndex((p) => p.id === id);
    return { pos: positions.current[i], size: PLANETS[i].size };
  };

  return (
    <>
      <ambientLight intensity={0.12} />
      <pointLight position={[0, 0, 0]} intensity={120} color="#bfe6ff" distance={140} decay={1.4} />
      <Backdrop />
      <Star />

      {PLANETS.map((p, i) => (
        <Planet
          key={p.id} config={p} index={i} positions={positions} dockerPos={dockerPos}
          focused={focused === p.id} hovered={hovered === p.id}
          onHover={setHovered} onClick={setFocused}
          dockerFocused={focused === DOCKER.id} onDockerHover={setHovered} onDockerClick={setFocused}
          dockerHovered={hovered === DOCKER.id}
        />
      ))}

      <GitBelt focused={focused === GIT_BELT.id} hovered={hovered === GIT_BELT.id} onHover={setHovered} onClick={setFocused} />

      <OrbitControls ref={controls} makeDefault enableDamping dampingFactor={0.06} minDistance={3} maxDistance={150} enablePan={false} />
      <CameraController focused={focused} getFocus={getFocus} controls={controls} />
    </>
  );
}

/* ---------- fusion-reactor star ---------- */
function Star() {
  const core = useRef(), ringA = useRef(), ringB = useRef(), ringC = useRef();
  useFrame((s, d) => {
    const t = s.clock.elapsedTime;
    if (core.current) core.current.scale.setScalar(2.4 + Math.sin(t * 1.6) * 0.08);
    if (ringA.current) ringA.current.rotation.z += d * 0.4;
    if (ringB.current) ringB.current.rotation.x += d * 0.3;
    if (ringC.current) ringC.current.rotation.y += d * 0.5;
  });
  const ringMat = <meshBasicMaterial color="#8cf8ff" transparent opacity={0.55} blending={THREE.AdditiveBlending} toneMapped={false} />;
  return (
    <group>
      <mesh ref={core}>
        <icosahedronGeometry args={[1, 3]} />
        <meshBasicMaterial color="#eaffff" toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[3.4, 32, 32]} />
        <meshBasicMaterial color="#3aa8ff" transparent opacity={0.12} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      {/* plasma / magnetic rings */}
      <mesh ref={ringA} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[4, 0.05, 12, 96]} />{ringMat}</mesh>
      <mesh ref={ringB} rotation={[0.6, 0.4, 0]}><torusGeometry args={[4.8, 0.03, 12, 96]} />{ringMat}</mesh>
      <mesh ref={ringC} rotation={[1.2, 0, 0.5]}><torusGeometry args={[5.6, 0.03, 12, 96]} />{ringMat}</mesh>
      <pointLight intensity={3} distance={30} color="#bfe6ff" />
      <Html center distanceFactor={26} position={[0, 6.5, 0]} style={{ pointerEvents: "none" }}>
        <div className="holo-label holo-label--star">{STAR.name}</div>
      </Html>
    </group>
  );
}

/* ---------- Fresnel atmosphere ---------- */
function Atmosphere({ size, color, intensity = 0.9 }) {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uIntensity: { value: intensity } },
    vertexShader: `varying vec3 vN; varying vec3 vP; void main(){ vN=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(position,1.0); vP=mv.xyz; gl_Position=projectionMatrix*mv; }`,
    fragmentShader: `varying vec3 vN; varying vec3 vP; uniform vec3 uColor; uniform float uIntensity; void main(){ vec3 v=normalize(-vP); float f=pow(1.0-max(dot(vN,v),0.0),3.2); gl_FragColor=vec4(uColor*f*uIntensity,f); }`,
    transparent: true, blending: THREE.AdditiveBlending, side: THREE.BackSide, depthWrite: false,
  }), [color, intensity]);
  return <mesh scale={size * 1.18}><sphereGeometry args={[1, 40, 40]} /><primitive object={mat} attach="material" /></mesh>;
}

/* ---------- a planet (+ optional Docker moon) ---------- */
function Planet({ config, index, positions, dockerPos, focused, hovered, onHover, onClick, dockerFocused, dockerHovered, onDockerHover, onDockerClick }) {
  const group = useRef(), surf = useRef();
  const t = useMemo(() => planetTexture(config.style, config), [config]);
  useFrame((_, d) => {
    if (group.current) group.current.position.copy(positions.current[index]);
    if (surf.current) surf.current.rotation.y += d * config.spin;
  });
  return (
    <group ref={group}>
      <mesh
        ref={surf} rotation={[config.tilt, 0, 0]}
        onPointerOver={(e) => { e.stopPropagation(); onHover(config.id); document.body.style.cursor = "none"; }}
        onPointerOut={() => onHover(null)}
        onClick={(e) => { e.stopPropagation(); onClick(config.id); }}
      >
        <sphereGeometry args={[config.size, 48, 48]} />
        <meshStandardMaterial map={t.map} emissiveMap={t.night} emissive={config.accent} emissiveIntensity={0.3} roughness={0.92} metalness={0.25} />
      </mesh>

      <PlanetLogo id={config.id} color={config.accent} size={config.size} />
      {config.rings && <PlanetRings size={config.size} color={config.accent} />}
      {config.sats > 0 && <Satellites count={config.sats} r={config.size * 1.8} color={config.accent} />}

      {config.moon === "docker" && (
        <DockerMoon posRef={dockerPos} focused={dockerFocused} hovered={dockerHovered} onHover={onDockerHover} onClick={onDockerClick} />
      )}

      {(hovered || focused) && (
        <Html center distanceFactor={16} position={[0, config.size + 1.1, 0]} style={{ pointerEvents: "none" }} zIndexRange={[20, 0]}>
          <div className="holo-label" style={{ "--pc": config.accent }}>{config.name}</div>
        </Html>
      )}
    </group>
  );
}

function DockerMoon({ posRef, focused, hovered, onHover, onClick }) {
  const g = useRef(), surf = useRef();
  const angle = useRef(0);
  const t = useMemo(() => planetTexture("station", DOCKER), []);
  useFrame((_, d) => {
    if (!focused) angle.current += d * DOCKER.orbitSpeed;
    const a = angle.current;
    if (g.current) { g.current.position.set(Math.cos(a) * DOCKER.orbit, 0.4, Math.sin(a) * DOCKER.orbit); g.current.getWorldPosition(posRef.current); }
    if (surf.current) surf.current.rotation.y += d * DOCKER.spin;
  });
  return (
    <group ref={g}>
      <mesh ref={surf}
        onPointerOver={(e) => { e.stopPropagation(); onHover(DOCKER.id); }}
        onPointerOut={() => onHover(null)}
        onClick={(e) => { e.stopPropagation(); onClick(DOCKER.id); }}>
        <sphereGeometry args={[DOCKER.size, 32, 32]} />
        <meshStandardMaterial map={t.map} emissiveMap={t.night} emissive={DOCKER.accent} emissiveIntensity={0.35} roughness={0.8} metalness={0.3} />
      </mesh>
      <PlanetLogo id={DOCKER.id} color={DOCKER.accent} size={DOCKER.size} />
      {(hovered || focused) && (
        <Html center distanceFactor={12} position={[0, DOCKER.size + 0.6, 0]} style={{ pointerEvents: "none" }}>
          <div className="holo-label" style={{ "--pc": DOCKER.accent }}>{DOCKER.name}</div>
        </Html>
      )}
    </group>
  );
}

function PlanetRings({ size, color }) {
  return (
    <group rotation={[Math.PI / 2.1, 0, 0.3]}>
      <mesh><ringGeometry args={[size * 1.4, size * 2.0, 96]} /><meshBasicMaterial color={color} transparent opacity={0.22} side={THREE.DoubleSide} depthWrite={false} /></mesh>
      <mesh><ringGeometry args={[size * 2.1, size * 2.4, 96]} /><meshBasicMaterial color={color} transparent opacity={0.12} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    </group>
  );
}

function Satellites({ count, r, color }) {
  const refs = useRef([]);
  const specs = useMemo(() => Array.from({ length: count }, (_, i) => ({ speed: 0.4 + i * 0.15, phase: i * 2, incl: (i - count / 2) * 0.4 })), [count]);
  useFrame((s) => {
    specs.forEach((sp, i) => {
      const a = s.clock.elapsedTime * sp.speed + sp.phase;
      const m = refs.current[i];
      if (m) m.position.set(Math.cos(a) * r, Math.sin(a) * r * Math.sin(sp.incl), Math.sin(a) * r);
    });
  });
  return specs.map((_, i) => (
    <mesh key={i} ref={(el) => (refs.current[i] = el)}>
      <sphereGeometry args={[0.06, 8, 8]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  ));
}

/* ---------- Git asteroid belt ---------- */
function GitBelt({ focused, hovered, onHover, onClick }) {
  const inst = useRef();
  const flares = useRef([]);
  const { count, radius, accent } = GIT_BELT;
  const data = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + Math.random() * 0.05;
      const rr = radius + (Math.random() - 0.5) * 6;
      arr.push({ x: Math.cos(a) * rr, y: (Math.random() - 0.5) * 2.4, z: Math.sin(a) * rr, s: 0.06 + Math.random() * 0.16, rx: Math.random() * 6, ry: Math.random() * 6 });
    }
    return arr;
  }, [count, radius]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useEffect(() => {
    if (!inst.current) return;
    data.forEach((d, i) => { dummy.position.set(d.x, d.y, d.z); dummy.rotation.set(d.rx, d.ry, 0); dummy.scale.setScalar(d.s); dummy.updateMatrix(); inst.current.setMatrixAt(i, dummy.matrix); });
    inst.current.instanceMatrix.needsUpdate = true;
  }, [data, dummy]);
  useFrame((s, d) => { if (inst.current) inst.current.rotation.y += d * 0.01; });

  return (
    <group>
      <instancedMesh ref={inst} args={[undefined, undefined, count]}
        onPointerOver={(e) => { e.stopPropagation(); onHover(GIT_BELT.id); }}
        onPointerOut={() => onHover(null)}
        onClick={(e) => { e.stopPropagation(); onClick(GIT_BELT.id); }}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#6b7280" roughness={0.9} metalness={0.2} emissive={accent} emissiveIntensity={0.08} />
      </instancedMesh>
      {(hovered || focused) && (
        <Html center distanceFactor={18} position={[0, 3, radius]} style={{ pointerEvents: "none" }}>
          <div className="holo-label" style={{ "--pc": accent }}>{GIT_BELT.name}</div>
        </Html>
      )}
    </group>
  );
}

/* ---------- backdrop starfield ---------- */
function Backdrop() {
  const geo = useMemo(() => {
    const n = 1600, pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 160 + Math.random() * 120, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th); pos[i * 3 + 1] = r * Math.cos(ph); pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); return g;
  }, []);
  return <points geometry={geo}><pointsMaterial size={0.5} color="#cfe0ff" transparent opacity={0.7} sizeAttenuation depthWrite={false} /></points>;
}

/* ---------- cinematic focus camera ---------- */
function CameraController({ focused, getFocus, controls }) {
  const { camera } = useThree();
  useEffect(() => {
    const ctrl = controls.current;
    if (!ctrl) return;
    gsap.killTweensOf(camera.position);
    gsap.killTweensOf(ctrl.target);
    ctrl.enabled = false;
    let camTo, tarTo;
    if (!focused) { camTo = SYSTEM_CAM; tarTo = { x: 0, y: 0, z: 0 }; }
    else {
      const { pos, size } = getFocus(focused);
      const dir = pos.clone().normalize();
      const cam = pos.clone().add(dir.multiplyScalar(size * 4.2)).add(new THREE.Vector3(0, size * 1.5, 0));
      camTo = { x: cam.x, y: cam.y, z: cam.z };
      tarTo = { x: pos.x, y: pos.y, z: pos.z };
    }
    const tl = gsap.timeline({ onComplete: () => { ctrl.enabled = true; } });
    tl.to(camera.position, { ...camTo, duration: 1.6, ease: "power3.inOut", onUpdate: () => ctrl.update() }, 0);
    tl.to(ctrl.target, { ...tarTo, duration: 1.6, ease: "power3.inOut", onUpdate: () => ctrl.update() }, 0);
    return () => tl.kill();
  }, [focused]); // eslint-disable-line
  return null;
}
