import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

/**
 * The interior shell of the orbital module: a large panoramic window
 * looking into deep space, structural framing, floor guide lights and
 * soft edge lighting. Clean 2001/Interstellar geometry — no clutter.
 */
export default function StationShell() {
  return (
    <group>
      <WindowWall />
      <FloorGuides />
      <EdgeLights />
    </group>
  );
}

/* Matte-black metal frame around a panoramic window (space shows through). */
function WindowWall() {
  const Z = -4.8;
  const W = 15, H = 6, T = 0.14;
  const bar = (args, pos) => (
    <mesh position={pos}>
      <boxGeometry args={args} />
      <meshStandardMaterial color="#070a12" metalness={0.85} roughness={0.35} />
    </mesh>
  );
  return (
    <group position={[0, 3, Z]}>
      {/* outer frame */}
      {bar([W, T, 0.5], [0, H / 2, 0])}
      {bar([W, T, 0.5], [0, -H / 2, 0])}
      {bar([T, H, 0.5], [-W / 2, 0, 0])}
      {bar([T, H, 0.5], [W / 2, 0, 0])}
      {/* mullions */}
      {bar([0.08, H, 0.4], [-W / 4, 0, 0])}
      {bar([0.08, H, 0.4], [0, 0, 0])}
      {bar([0.08, H, 0.4], [W / 4, 0, 0])}
      {bar([W, 0.06, 0.4], [0, 0, 0])}
      {/* glowing inner edge (transparent-OLED trim) */}
      <mesh position={[0, H / 2 - 0.02, 0.26]}>
        <boxGeometry args={[W - 0.2, 0.02, 0.02]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
      <mesh position={[0, -H / 2 + 0.02, 0.26]}>
        <boxGeometry args={[W - 0.2, 0.02, 0.02]} />
        <meshStandardMaterial color="#6c63ff" emissive="#6c63ff" emissiveIntensity={1.1} toneMapped={false} />
      </mesh>
      {/* faint frosted glass suggestion */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[W - 0.3, H - 0.3]} />
        <meshPhysicalMaterial
          transparent opacity={0.04} roughness={0.1} metalness={0} transmission={0.9}
          color="#8cf8ff" ior={1.2} depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* Two emissive guide strips on the floor, drawing the eye to the window. */
function FloorGuides() {
  return (
    <group>
      {[-3.6, 3.6].map((x) => (
        <mesh key={x} position={[x, 0.02, -1]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.06, 8]} />
          <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.8} toneMapped={false} />
        </mesh>
      ))}
      {/* floor guide dots */}
      {[-3, -1.5, 0, 1.5, 3].map((z) => (
        <mesh key={z} position={[0, 0.02, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.04, 12]} />
          <meshStandardMaterial color="#6c63ff" emissive="#6c63ff" emissiveIntensity={0.9} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/* Soft breathing ceiling edge light. */
function EdgeLights() {
  const ref = useRef();
  useFrame((s) => {
    if (ref.current) ref.current.material.emissiveIntensity = 0.5 + Math.sin(s.clock.elapsedTime * 0.6) * 0.15;
  });
  return (
    <group>
      <mesh ref={ref} position={[0, 5.4, -1]}>
        <boxGeometry args={[13, 0.03, 0.03]} />
        <meshStandardMaterial color="#6c63ff" emissive="#6c63ff" emissiveIntensity={0.5} toneMapped={false} />
      </mesh>
      {/* soft violet fill from above */}
      <pointLight position={[0, 5, 0]} intensity={6} color="#6c63ff" distance={14} />
    </group>
  );
}
