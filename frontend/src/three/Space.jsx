import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore, QUALITY } from "../store/useStore";
import { earthTextures, moonTextures, glowTexture, nebulaTexture } from "./spaceTextures";

/**
 * NEXUS ORBIT — a calm, photoreal deep-space view through the station
 * windows. Deliberately sparse: one hero planet, one moon, one faint
 * nebula, one distant galaxy, an almost-static starfield, rare flybys.
 * Negative space is part of the design. Nothing competes with content.
 */
// hero planet sits high on the left, well behind the window — partial, small
const PLANET_POS = [-34, 10, -92];

export default function Space() {
  const quality = useStore((s) => s.quality);
  const q = QUALITY[quality] || QUALITY.high;
  return (
    <group>
      <SunLight />
      <StarField count={Math.round(q.stars * 0.66)} minR={95} maxR={185} sizeMin={0.5} sizeMax={2.1} />
      <StarField count={Math.round(q.stars * 0.34)} minR={60} maxR={110} sizeMin={0.9} sizeMax={3.0} />
      <FaintNebula position={[46, 18, -125]} scale={[135, 92]} color="#3a4560" opacity={0.07} />
      <FaintNebula position={[-70, -20, -140]} scale={[120, 80]} color="#2f4a52" opacity={0.05} />
      <DistantGalaxy />
      <HeroPlanet />
      <Moon />
      <FarPlanet />
      {q.flyby && <SatelliteFlyby />}
    </group>
  );
}

/* ---------- soft sunlight (no visible disk, no flare) ---------- */
function SunLight() {
  return <directionalLight position={[72, 32, -12]} intensity={2.2} color="#fff4e6" />;
}

/* ---------- physically-plausible starfield (per-star size/color, faint twinkle) ---------- */
function StarField({ count, minR, maxR, sizeMin, sizeMax }) {
  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const palette = [[1, 1, 1], [0.78, 0.86, 1.0], [1.0, 0.92, 0.82]]; // white · blue-white · warm
    for (let i = 0; i < count; i++) {
      const r = minR + Math.random() * (maxR - minR);
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(ph) * Math.cos(th);
      positions[i * 3 + 1] = r * Math.cos(ph);
      positions[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
      const pick = Math.random();
      const c = pick < 0.72 ? palette[0] : pick < 0.9 ? palette[1] : palette[2];
      const b = 0.45 + Math.random() * 0.55;
      colors[i * 3] = c[0] * b; colors[i * 3 + 1] = c[1] * b; colors[i * 3 + 2] = c[2] * b;
      sizes[i] = sizeMin + Math.pow(Math.random(), 3) * (sizeMax - sizeMin);
      phases[i] = Math.random() * Math.PI * 2;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    const material = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uScale: { value: 280 * (typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1) } },
      vertexShader: `
        attribute vec3 aColor; attribute float aSize; attribute float aPhase;
        uniform float uTime; uniform float uScale; varying vec3 vColor;
        void main() {
          vColor = aColor;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          float tw = 0.93 + 0.07 * sin(uTime * 0.5 + aPhase);
          gl_PointSize = aSize * uScale * tw / -mv.z;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.06, d);
          gl_FragColor = vec4(vColor, a);
        }`,
      transparent: true, depthWrite: false, fog: false,
    });
    return { geometry, material };
  }, [count, minR, maxR, sizeMin, sizeMax]);

  useFrame((s) => { material.uniforms.uTime.value = s.clock.elapsedTime; });
  return <points geometry={geometry} material={material} />;
}

/* ---------- Fresnel atmosphere ---------- */
function Atmosphere({ radius, color, power = 3.2, intensity = 1.0 }) {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(color) }, uPower: { value: power }, uIntensity: { value: intensity } },
    vertexShader: `varying vec3 vN; varying vec3 vP;
      void main(){ vN = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.0); vP = mv.xyz; gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `varying vec3 vN; varying vec3 vP; uniform vec3 uColor; uniform float uPower; uniform float uIntensity;
      void main(){ vec3 v = normalize(-vP); float f = pow(1.0 - max(dot(vN,v),0.0), uPower); gl_FragColor = vec4(uColor*f*uIntensity, f); }`,
    transparent: true, blending: THREE.AdditiveBlending, side: THREE.BackSide, depthWrite: false, fog: false,
  }), [color, power, intensity]);
  return (
    <mesh scale={radius * 1.035}>
      <sphereGeometry args={[1, 48, 48]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

/* ---------- hero planet (Earth-like, offset to one side, near-imperceptible spin) ---------- */
function HeroPlanet() {
  const surf = useRef();
  const cloud = useRef();
  const t = useMemo(() => earthTextures(768, 384), []);
  const R = 12;
  useFrame((_, d) => {
    if (surf.current) surf.current.rotation.y += d * 0.006;
    if (cloud.current) cloud.current.rotation.y += d * 0.0085;
  });
  return (
    <group position={PLANET_POS} rotation={[0.32, 0, 0.14]}>
      <Atmosphere radius={R} color="#7fb5ff" power={7} intensity={0.35} />
      <mesh ref={surf}>
        <sphereGeometry args={[R, 96, 96]} />
        {/* dimmed + desaturated so it recedes behind the content */}
        <meshStandardMaterial
          map={t.map} normalMap={t.normalMap} normalScale={[0.45, 0.45]}
          roughnessMap={t.roughnessMap} roughness={1} metalness={0}
          color="#c2cad6"
          emissiveMap={t.night} emissive="#ffcf8c" emissiveIntensity={0.55}
          fog={false}
        />
      </mesh>
      <mesh ref={cloud} scale={1.014}>
        <sphereGeometry args={[R, 64, 64]} />
        <meshStandardMaterial map={t.clouds} transparent opacity={0.85} depthWrite={false} roughness={1} metalness={0} color="#d6dde6" fog={false} />
      </mesh>
    </group>
  );
}

/* ---------- distant second planet (small, dim, far corner) ---------- */
function FarPlanet() {
  const surf = useRef();
  const t = useMemo(() => moonTextures(), []);
  const R = 6;
  useFrame((_, d) => { if (surf.current) surf.current.rotation.y += d * 0.008; });
  return (
    <group position={[74, 22, -158]} rotation={[0.2, 0, 0.1]}>
      <mesh ref={surf}>
        <sphereGeometry args={[R, 48, 48]} />
        <meshStandardMaterial map={t.map} normalMap={t.normalMap} normalScale={[0.5, 0.5]} color="#9c6a4a" roughness={1} metalness={0} fog={false} />
      </mesh>
    </group>
  );
}

/* ---------- moon (slow orbit around the planet, drifts behind station beams) ---------- */
function Moon() {
  const g = useRef();
  const surf = useRef();
  const t = useMemo(() => moonTextures(), []);
  const R = 2.4, orbit = 26;
  useFrame((s, d) => {
    const a = s.clock.elapsedTime * 0.02;
    if (g.current) g.current.position.set(
      PLANET_POS[0] + Math.cos(a) * orbit,
      PLANET_POS[1] + 4 + Math.sin(a) * orbit * 0.22,
      PLANET_POS[2] + Math.sin(a) * orbit
    );
    if (surf.current) surf.current.rotation.y += d * 0.02;
  });
  return (
    <group ref={g}>
      <mesh ref={surf}>
        <sphereGeometry args={[R, 48, 48]} />
        <meshStandardMaterial map={t.map} normalMap={t.normalMap} normalScale={[0.9, 0.9]} color="#c8ccd4" roughness={1} metalness={0} fog={false} />
      </mesh>
    </group>
  );
}

/* ---------- faint blue-gray nebulae (< 10% opacity, non-glowing) ---------- */
function FaintNebula({ position, scale, color, opacity }) {
  const tex = useMemo(() => nebulaTexture(color), [color]);
  return (
    <sprite position={position} scale={[scale[0], scale[1], 1]}>
      <spriteMaterial map={tex} transparent opacity={opacity} depthWrite={false} fog={false} />
    </sprite>
  );
}

/* ---------- one tiny distant galaxy (only if you look) ---------- */
function DistantGalaxy() {
  const tex = useMemo(() => glowTexture("#c4ccdf", 0.4), []);
  return (
    <sprite position={[74, 40, -155]} scale={[7, 2.6, 1]}>
      <spriteMaterial map={tex} transparent opacity={0.42} rotation={0.5} depthWrite={false} blending={THREE.AdditiveBlending} fog={false} />
    </sprite>
  );
}

/* ---------- rare, slow satellite flyby (one at a time, minutes apart) ---------- */
function SatelliteFlyby() {
  const g = useRef();
  const st = useRef({ active: false, next: 35 + Math.random() * 35, t: 0, dir: 1, y: 0, z: -28 });
  useFrame((s, d) => {
    const o = st.current, m = g.current;
    if (!m) return;
    if (!o.active) {
      m.visible = false;
      o.next -= d;
      if (o.next <= 0) {
        o.active = true; o.t = 0;
        o.dir = Math.random() > 0.5 ? 1 : -1;
        o.y = (Math.random() - 0.5) * 16;
        o.z = -26 - Math.random() * 22;
      }
    } else {
      m.visible = true;
      o.t += d;
      const dur = 75, p = o.t / dur;
      const x = -o.dir * 36 + o.dir * 72 * p;
      m.position.set(x, o.y, o.z);
      m.rotation.y += d * 0.04;
      if (p >= 1) { o.active = false; o.next = 130 + Math.random() * 120; m.visible = false; }
    }
  });
  return (
    <group ref={g} visible={false} scale={0.6}>
      <mesh><boxGeometry args={[0.4, 0.4, 0.7]} /><meshStandardMaterial color="#20283a" metalness={0.7} roughness={0.4} fog={false} /></mesh>
      {[-0.7, 0.7].map((x) => (
        <mesh key={x} position={[x, 0, 0]}>
          <boxGeometry args={[0.8, 0.03, 0.5]} />
          <meshStandardMaterial color="#0a2740" emissive="#2b6cff" emissiveIntensity={0.35} fog={false} toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[0, 0.32, 0]}><boxGeometry args={[0.05, 0.32, 0.05]} /><meshStandardMaterial color="#2a2f3a" fog={false} /></mesh>
    </group>
  );
}
