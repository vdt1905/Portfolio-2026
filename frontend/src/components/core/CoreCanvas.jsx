import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { BrandIcon, DOMAIN_FLAGSHIP } from "../../data/techIcons";

/**
 * The glowing Engineering Core: a pulsing central intelligence with
 * technology domains orbiting around it. Click a domain to select it.
 * Rotation pauses once a domain is active so it's easy to read.
 */
export default function CoreCanvas({ domains, activeId, onSelect }) {
  const active = domains.find((d) => d.id === activeId);
  const coreColor = active?.color || "#00e5ff";
  return (
    <div className="relative h-[320px] w-full overflow-hidden rounded-2xl border border-white/8 bg-black/30 md:h-[420px]">
      <Canvas camera={{ position: [0, 0.4, 6.2], fov: 45 }} dpr={[1, 1.8]} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[0, 0, 5]} intensity={22} color={coreColor} distance={20} />
        <pointLight position={[4, 3, 2]} intensity={8} color="#6c63ff" />
        <Core color={coreColor} />
        <Orbit domains={domains} activeId={activeId} onSelect={onSelect} paused={!!activeId} />
      </Canvas>
      <div className="pointer-events-none absolute bottom-3 left-0 right-0 text-center font-mono text-[10px] uppercase tracking-widest text-muted">
        {active ? active.short : "select a domain"}
      </div>
    </div>
  );
}

function Core({ color }) {
  const shell = useRef();
  const inner = useRef();
  useFrame((s, d) => {
    if (shell.current) {
      shell.current.rotation.y += d * 0.3;
      shell.current.rotation.x += d * 0.12;
    }
    if (inner.current) {
      inner.current.rotation.y -= d * 0.22;
      const p = 1 + Math.sin(s.clock.elapsedTime * 2) * 0.05;
      inner.current.scale.setScalar(p);
    }
  });
  return (
    <group>
      <mesh ref={shell}>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.1} wireframe toneMapped={false} />
      </mesh>
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={2.4} toneMapped={false} />
      </mesh>
      {/* soft halo */}
      <mesh>
        <sphereGeometry args={[1.25, 24, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

function Orbit({ domains, activeId, onSelect, paused }) {
  const g = useRef();
  const R = 2.6;
  const positions = useMemo(
    () =>
      domains.map((_, i) => {
        const t = (i / domains.length) * Math.PI * 2;
        return [Math.cos(t) * R, Math.sin(t) * R * 0.5, Math.sin(t) * R * 0.28];
      }),
    [domains]
  );

  useFrame((_, d) => {
    if (g.current && !paused) g.current.rotation.y += d * 0.14;
  });

  return (
    <group ref={g} rotation={[0.3, 0, 0]}>
      {/* orbit ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[R, 0.006, 8, 96]} />
        <meshStandardMaterial color="#8a93a6" emissive="#3a4256" emissiveIntensity={0.5} transparent opacity={0.35} toneMapped={false} />
      </mesh>
      {domains.map((dm, i) => (
        <DomainNode key={dm.id} domain={dm} position={positions[i]} active={dm.id === activeId} onSelect={onSelect} />
      ))}
    </group>
  );
}

function DomainNode({ domain, position, active, onSelect }) {
  const ref = useRef();
  const [hover, setHover] = useState(false);
  const flagship = DOMAIN_FLAGSHIP[domain.id];
  useFrame((_, d) => {
    if (!ref.current) return;
    const target = active ? 1.5 : hover ? 1.28 : 1;
    const ns = THREE.MathUtils.damp(ref.current.scale.x, target, 7, d);
    ref.current.scale.setScalar(ns);
  });
  return (
    <group position={position}>
      {/* connector to core center (center in local coords = -position) */}
      <Line
        points={[[0, 0, 0], [-position[0], -position[1], -position[2]]]}
        color={domain.color}
        lineWidth={active ? 2.2 : 1}
        transparent
        opacity={active ? 0.85 : 0.22}
      />
      {/* glowing orb halo — logo coin sits in front of it */}
      <mesh
        ref={ref}
        onClick={(e) => { e.stopPropagation(); onSelect(domain.id); }}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = "none"; }}
        onPointerOut={() => setHover(false)}
      >
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial
          color={domain.color}
          emissive={domain.color}
          emissiveIntensity={active ? 1.9 : hover ? 1.4 : 0.8}
          transparent
          opacity={0.55}
          toneMapped={false}
        />
      </mesh>

      {/* real tech logo coin (billboards toward camera) */}
      <Html center distanceFactor={7} position={[0, 0, 0]} style={{ pointerEvents: "none" }} zIndexRange={[24, 0]}>
        <div
          className={`core-logo-coin ${active ? "core-logo-coin--on" : ""}`}
          style={{ borderColor: `${domain.color}${active ? "cc" : "55"}`, boxShadow: active ? `0 0 22px -4px ${domain.color}` : "none" }}
        >
          <BrandIcon name={flagship} size={active ? 26 : 22} />
        </div>
      </Html>

      <Html center distanceFactor={9} position={[0, 0.62, 0]} style={{ pointerEvents: "none" }} zIndexRange={[20, 0]}>
        <div className={`core-node-label ${active ? "core-node-label--on" : ""}`}>{domain.short}</div>
      </Html>
    </group>
  );
}
