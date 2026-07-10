import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { useStore, QUALITY } from "../store/useStore";
import { glowTexture, nebulaTexture, gasGiantTexture, moonTexture } from "./spaceTextures";

/**
 * A living deep-space environment surrounding the orbital station.
 * Everything here ignores scene fog and moves very slowly to sell the
 * illusion of orbit. Counts scale with the adaptive quality setting.
 */
export default function Space() {
  const quality = useStore((s) => s.quality);
  const q = QUALITY[quality] || QUALITY.high;

  return (
    <group>
      {/* deep starfield — two layers for depth */}
      <Stars radius={140} depth={70} count={q.stars} factor={4} saturation={0} fade speed={0.4} />
      <TwinkleLayer count={Math.round(q.stars / 6)} />

      <GalaxyBand count={q.galaxy} />
      <Nebulae count={q.nebula} />

      <DistantSun />
      <Planet position={[-46, 9, -78]} radius={15} texture="gas" atmo="#6c63ff" speed={0.012} />
      <Planet position={[58, -8, -96]} radius={8} texture="rock" atmo="#00e5ff" speed={0.02} />
      <Planet position={[24, 15, -44]} radius={3.4} texture="moon" atmo="#8cf8ff" speed={0.03} />

      {q.satellites > 0 && <Satellites count={q.satellites} />}
      <ShootingStars />
    </group>
  );
}

/* ---------- bright twinkling stars ---------- */
function TwinkleLayer({ count = 800 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 60 + Math.random() * 90;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      a[i * 3] = r * Math.sin(ph) * Math.cos(th);
      a[i * 3 + 1] = r * Math.cos(ph);
      a[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
    }
    return a;
  }, [count]);
  useFrame((s) => {
    if (ref.current) ref.current.material.size = 0.5 + Math.sin(s.clock.elapsedTime * 2) * 0.12;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#cfefff" size={0.5} sizeAttenuation transparent opacity={0.85} depthWrite={false} fog={false} />
    </points>
  );
}

/* ---------- Milky Way band ---------- */
function GalaxyBand({ count = 3500 }) {
  const g = useRef();
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [new THREE.Color("#ffffff"), new THREE.Color("#8cf8ff"), new THREE.Color("#6c63ff"), new THREE.Color("#ffd166")];
    for (let i = 0; i < count; i++) {
      const R = 70 + Math.random() * 70;
      const lon = Math.random() * Math.PI * 2;
      const lat = (Math.random() - 0.5) * 0.5 * Math.pow(Math.random(), 2); // concentrate near band
      positions[i * 3] = R * Math.cos(lat) * Math.cos(lon);
      positions[i * 3 + 1] = R * Math.sin(lat);
      positions[i * 3 + 2] = R * Math.cos(lat) * Math.sin(lon);
      const c = palette[Math.random() < 0.7 ? 0 : 1 + (Math.random() * 3 | 0)];
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, [count]);
  useFrame((_, d) => { if (g.current) g.current.rotation.y += d * 0.005; });
  return (
    <group ref={g} rotation={[0.5, 0, 0.35]}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.45} sizeAttenuation vertexColors transparent opacity={0.7} depthWrite={false} blending={THREE.AdditiveBlending} fog={false} />
      </points>
    </group>
  );
}

/* ---------- nebula clouds ---------- */
function Nebulae({ count = 4 }) {
  const specs = useMemo(() => {
    const colors = ["#6c63ff", "#00e5ff", "#123a6a", "#2a1a5a"];
    return Array.from({ length: count }, (_, i) => ({
      tex: nebulaTexture(colors[i % colors.length]),
      pos: [(Math.random() - 0.5) * 160, (Math.random() - 0.3) * 60, -60 - Math.random() * 60],
      scale: 60 + Math.random() * 60,
      rot: Math.random() * Math.PI,
    }));
  }, [count]);
  const ref = useRef();
  useFrame((_, d) => { if (ref.current) ref.current.rotation.z += d * 0.003; });
  return (
    <group ref={ref}>
      {specs.map((s, i) => (
        <sprite key={i} position={s.pos} scale={[s.scale, s.scale, 1]}>
          <spriteMaterial map={s.tex} transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} fog={false} />
        </sprite>
      ))}
    </group>
  );
}

/* ---------- distant sun ---------- */
function DistantSun() {
  const glow = useMemo(() => glowTexture("#fff4d6", 0.35), []);
  return (
    <group position={[90, 34, -130]}>
      <directionalLight position={[0, 0, 0]} target-position={[-90, -34, 130]} intensity={1.6} color="#fff2d0" />
      <sprite scale={[70, 70, 1]}>
        <spriteMaterial map={glow} transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} fog={false} />
      </sprite>
      <mesh>
        <sphereGeometry args={[8, 24, 24]} />
        <meshBasicMaterial color="#fff6e0" fog={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ---------- planets & moon ---------- */
function Planet({ position, radius, texture, atmo, speed }) {
  const ref = useRef();
  const map = useMemo(() => {
    if (texture === "gas") return gasGiantTexture("#233156", "#6c63ff");
    if (texture === "moon") return moonTexture();
    return gasGiantTexture("#0e3550", "#00e5ff");
  }, [texture]);
  const glow = useMemo(() => glowTexture(atmo, 0.5), [atmo]);
  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += d * speed; });
  return (
    <group position={position}>
      {/* atmospheric glow behind */}
      <sprite scale={[radius * 2.7, radius * 2.7, 1]}>
        <spriteMaterial map={glow} transparent opacity={0.6} depthWrite={false} blending={THREE.AdditiveBlending} fog={false} />
      </sprite>
      <mesh ref={ref}>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshStandardMaterial map={map} roughness={0.9} metalness={0.05} emissive={atmo} emissiveIntensity={0.06} fog={false} />
      </mesh>
    </group>
  );
}

/* ---------- orbiting satellites ---------- */
function Satellites({ count = 12 }) {
  const specs = useMemo(() =>
    Array.from({ length: count }, () => ({
      r: 9 + Math.random() * 10,
      speed: (Math.random() > 0.5 ? 1 : -1) * (0.04 + Math.random() * 0.05),
      incl: (Math.random() - 0.5) * 1.2,
      phase: Math.random() * Math.PI * 2,
      y: (Math.random() - 0.5) * 6,
    })), [count]);
  const refs = useRef([]);
  useFrame((s) => {
    specs.forEach((sp, i) => {
      const t = s.clock.elapsedTime * sp.speed + sp.phase;
      const m = refs.current[i];
      if (!m) return;
      m.position.set(Math.cos(t) * sp.r, sp.y + Math.sin(t) * sp.r * Math.sin(sp.incl), Math.sin(t) * sp.r);
      m.rotation.y = t;
    });
  });
  return (
    <group>
      {specs.map((_, i) => (
        <group key={i} ref={(el) => (refs.current[i] = el)}>
          <mesh>
            <boxGeometry args={[0.18, 0.18, 0.3]} />
            <meshStandardMaterial color="#1a2030" metalness={0.7} roughness={0.4} fog={false} />
          </mesh>
          {[-0.28, 0.28].map((x) => (
            <mesh key={x} position={[x, 0, 0]}>
              <boxGeometry args={[0.34, 0.02, 0.2]} />
              <meshStandardMaterial color="#06263a" emissive="#00e5ff" emissiveIntensity={0.5} fog={false} toneMapped={false} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/* ---------- shooting stars ---------- */
function ShootingStars() {
  const streaks = useRef([
    { active: false, next: 6 },
    { active: false, next: 18 },
  ]);
  const refs = useRef([]);
  useFrame((s, d) => {
    streaks.current.forEach((st, i) => {
      const m = refs.current[i];
      if (!m) return;
      if (!st.active) {
        st.next -= d;
        if (st.next <= 0) {
          st.active = true;
          st.life = 0;
          st.start = new THREE.Vector3((Math.random() - 0.5) * 120, 20 + Math.random() * 30, -40 - Math.random() * 40);
          st.dir = new THREE.Vector3(-1 - Math.random(), -0.5 - Math.random() * 0.5, 0).normalize().multiplyScalar(60);
          m.visible = true;
          m.position.copy(st.start);
          m.lookAt(st.start.clone().add(st.dir));
        }
      } else {
        st.life += d;
        m.position.addScaledVector(st.dir, d);
        m.material.opacity = Math.max(0, 1 - st.life * 0.7);
        if (st.life > 1.4) { st.active = false; st.next = 20 + Math.random() * 12; m.visible = false; }
      }
    });
  });
  return (
    <>
      {[0, 1].map((i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)} visible={false}>
          <boxGeometry args={[0.05, 0.05, 4]} />
          <meshBasicMaterial color="#8cf8ff" transparent opacity={1} depthWrite={false} blending={THREE.AdditiveBlending} fog={false} toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}
