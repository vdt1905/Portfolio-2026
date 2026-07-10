import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Grid, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import Hotspot from "./Hotspot";
import Particles from "./Particles";
import Space from "./Space";
import StationShell from "./StationShell";
import { useStore } from "../store/useStore";
import { socials } from "../data/portfolio";
import { resumeScreen, githubScreen, linkedinScreen } from "./screenTextures";

const DESK_Y = 0.9;

/* ---------- reusable bits ---------- */
function Screen({ texture, position, rotation, size = [1.5, 0.94] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* bezel */}
      <mesh>
        <boxGeometry args={[size[0] + 0.08, size[1] + 0.08, 0.05]} />
        <meshStandardMaterial color="#0b0b0d" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* glowing panel */}
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={size} />
        <meshStandardMaterial
          map={texture}
          emissiveMap={texture}
          emissive="#ffffff"
          emissiveIntensity={1.15}
          toneMapped={false}
        />
      </mesh>
      {/* stand */}
      <mesh position={[0, -size[1] / 2 - 0.28, -0.02]}>
        <boxGeometry args={[0.08, 0.5, 0.08]} />
        <meshStandardMaterial color="#111" metalness={0.7} roughness={0.35} />
      </mesh>
    </group>
  );
}

function Keyboard() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1.5, 0.09, 0.5]} />
        <meshStandardMaterial color="#0d0d10" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* key glow strip */}
      <mesh position={[0, 0.055, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.4, 0.42]} />
        <meshStandardMaterial
          color="#020203"
          emissive="#00e5ff"
          emissiveIntensity={0.25}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Laptop() {
  const tex = useMemo(() => resumeScreen(), []);
  return (
    <group>
      {/* base */}
      <mesh>
        <boxGeometry args={[1.5, 0.06, 1]} />
        <meshStandardMaterial color="#131317" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* screen */}
      <group position={[0, 0.5, -0.48]} rotation={[-0.35, 0, 0]}>
        <mesh>
          <boxGeometry args={[1.5, 1, 0.04]} />
          <meshStandardMaterial color="#0b0b0d" metalness={0.7} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[1.4, 0.9]} />
          <meshStandardMaterial
            emissive="#6c63ff"
            emissiveIntensity={0.8}
            color="#0a0a12"
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}

function Robot() {
  const head = useRef();
  useFrame((s) => {
    if (head.current) head.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.8) * 0.4;
  });
  return (
    <group>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.28, 0.34, 0.3, 24]} />
        <meshStandardMaterial color="#15151b" metalness={0.7} roughness={0.3} />
      </mesh>
      <group ref={head} position={[0, 0.5, 0]}>
        <mesh>
          <sphereGeometry args={[0.26, 24, 24]} />
          <meshStandardMaterial color="#1a1a22" metalness={0.6} roughness={0.35} />
        </mesh>
        {/* eye */}
        <mesh position={[0, 0.02, 0.24]}>
          <ringGeometry args={[0.06, 0.11, 24]} />
          <meshStandardMaterial
            color="#00e5ff"
            emissive="#00e5ff"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}

function ServerRack() {
  const lights = useRef([]);
  useFrame((s) => {
    lights.current.forEach((m, i) => {
      if (m) m.material.emissiveIntensity = 0.6 + Math.sin(s.clock.elapsedTime * 3 + i) * 0.6;
    });
  });
  return (
    <group>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[1, 2, 0.9]} />
        <meshStandardMaterial color="#0c0c10" metalness={0.6} roughness={0.45} />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => (
        <group key={i} position={[0, 0.35 + i * 0.28, 0.46]}>
          <mesh>
            <boxGeometry args={[0.86, 0.2, 0.04]} />
            <meshStandardMaterial color="#141419" metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh
            ref={(el) => (lights.current[i] = el)}
            position={[0.32, 0, 0.03]}
          >
            <boxGeometry args={[0.05, 0.05, 0.02]} />
            <meshStandardMaterial
              color="#00ff9c"
              emissive="#00ff9c"
              emissiveIntensity={1}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Holograms() {
  const g = useRef();
  useFrame((s, d) => {
    if (g.current) g.current.rotation.y += d * 0.4;
  });
  return (
    <group ref={g}>
      {[0.5, 0.72, 0.94].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.3, 0, 0]}>
          <torusGeometry args={[r, 0.008, 12, 64]} />
          <meshStandardMaterial
            color={i === 1 ? "#6c63ff" : "#00e5ff"}
            emissive={i === 1 ? "#6c63ff" : "#00e5ff"}
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      ))}
      <mesh>
        <icosahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={1.4}
          wireframe
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Trophy({ color = "#ffcf5c" }) {
  return (
    <group>
      {/* cup bowl */}
      <mesh position={[0, 0.44, 0]}>
        <cylinderGeometry args={[0.17, 0.08, 0.26, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.85} metalness={0.9} roughness={0.22} toneMapped={false} />
      </mesh>
      {/* handles */}
      {[0.17, -0.17].map((x, i) => (
        <mesh key={i} position={[x, 0.46, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.06, 0.014, 10, 20]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} metalness={0.9} roughness={0.25} toneMapped={false} />
        </mesh>
      ))}
      {/* stem */}
      <mesh position={[0, 0.26, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 0.14, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} metalness={0.9} roughness={0.3} toneMapped={false} />
      </mesh>
      {/* base */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.11, 0.13, 0.07, 20]} />
        <meshStandardMaterial color="#1a1a20" metalness={0.7} roughness={0.35} />
      </mesh>
    </group>
  );
}

function SatelliteBeacon() {
  const dish = useRef();
  useFrame((s) => {
    if (dish.current) dish.current.rotation.z = Math.sin(s.clock.elapsedTime) * 0.3;
  });
  return (
    <group>
      {/* body */}
      <mesh>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#15151b" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* solar panels */}
      {[-0.46, 0.46].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]}>
          <boxGeometry args={[0.5, 0.02, 0.3]} />
          <meshStandardMaterial color="#04202c" emissive="#00e5ff" emissiveIntensity={0.6} toneMapped={false} />
        </mesh>
      ))}
      {/* dish */}
      <group ref={dish} position={[0, 0.3, 0]}>
        <mesh rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.16, 0.14, 20, 1, true]} />
          <meshStandardMaterial color="#00ff9c" emissive="#00ff9c" emissiveIntensity={1.1} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshStandardMaterial color="#00ff9c" emissive="#00ff9c" emissiveIntensity={2.5} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function DeskProps() {
  return (
    <group>
      {/* mug */}
      <group position={[2.1, DESK_Y + 0.12, 0.5]}>
        <mesh>
          <cylinderGeometry args={[0.13, 0.11, 0.24, 20]} />
          <meshStandardMaterial color="#16161c" metalness={0.3} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.02, 0.09, 16]} />
          <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.6} toneMapped={false} />
        </mesh>
      </group>
      {/* lamp */}
      <group position={[-2.5, DESK_Y, -0.4]}>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.18, 0.2, 0.04, 20]} />
          <meshStandardMaterial color="#111" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.5, 0]} rotation={[0, 0, 0.4]}>
          <cylinderGeometry args={[0.015, 0.015, 1, 8]} />
          <meshStandardMaterial color="#222" metalness={0.7} roughness={0.3} />
        </mesh>
        <pointLight position={[0.3, 0.95, 0.3]} color="#00e5ff" intensity={6} distance={4} />
        <mesh position={[0.3, 0.95, 0.2]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={3} toneMapped={false} />
        </mesh>
      </group>
      {/* plant */}
      <group position={[-2.1, DESK_Y + 0.18, 0.55]}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.09, 0.22, 12]} />
          <meshStandardMaterial color="#14141a" roughness={0.7} />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[Math.sin(i) * 0.06, 0.28, Math.cos(i) * 0.06]} rotation={[0.3, i, 0]}>
            <coneGeometry args={[0.03, 0.34, 6]} />
            <meshStandardMaterial color="#0f5c4a" emissive="#00ff9c" emissiveIntensity={0.25} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ============================================================ */
export default function Workspace() {
  const openZone = useStore((s) => s.openZone);
  const resumeTex = useMemo(() => resumeScreen(), []);
  const githubTex = useMemo(() => githubScreen(), []);
  const linkedinTex = useMemo(() => linkedinScreen(), []);

  const link = (url) => () => window.open(url, "_blank", "noopener");

  return (
    <group>
      {/* ---------- lighting ---------- */}
      <ambientLight intensity={0.25} />
      <hemisphereLight args={["#12213a", "#050505", 0.5]} />
      <pointLight position={[0, 5, 3]} intensity={35} color="#00e5ff" distance={22} />
      <pointLight position={[-6, 3, -3]} intensity={22} color="#6c63ff" distance={20} />
      <pointLight position={[6, 2, 4]} intensity={12} color="#00ff9c" distance={16} />
      <spotLight position={[0, 8, 2]} angle={0.6} penumbra={1} intensity={30} color="#ffffff" />
      <fog attach="fog" args={["#02040A", 20, 70]} />

      {/* deep-space environment + orbital station interior */}
      <Space />
      <StationShell />

      {/* ---------- floor ---------- */}
      <Grid
        position={[0, 0.01, 0]}
        args={[40, 40]}
        cellSize={0.6}
        cellThickness={0.6}
        cellColor="#0d3a44"
        sectionSize={3}
        sectionThickness={1.1}
        sectionColor="#00e5ff"
        fadeDistance={26}
        fadeStrength={1.4}
        infiniteGrid
      />
      <ContactShadows position={[0, 0.02, 0]} opacity={0.55} scale={20} blur={2.4} far={5} color="#000000" />

      {/* ---------- desk ---------- */}
      <mesh position={[0, DESK_Y, 0]} castShadow receiveShadow>
        <boxGeometry args={[6, 0.12, 2.4]} />
        <meshStandardMaterial color="#0e0e12" metalness={0.5} roughness={0.45} />
      </mesh>
      {/* desk edge glow */}
      <mesh position={[0, DESK_Y - 0.065, 1.2]}>
        <boxGeometry args={[6, 0.02, 0.02]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
      {/* legs */}
      {[[-2.8, -1], [2.8, -1], [-2.8, 1], [2.8, 1]].map(([x, z], i) => (
        <mesh key={i} position={[x, DESK_Y / 2, z]}>
          <boxGeometry args={[0.12, DESK_Y, 0.12]} />
          <meshStandardMaterial color="#0a0a0d" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}

      <DeskProps />

      {/* ---------- interactive: MONITORS (external links) ---------- */}
      <Hotspot label="Resume" sublabel="open PDF" onSelect={link(socials.resume)} alwaysLabel={false}
        position={[-1.85, DESK_Y + 0.9, -0.9]} labelOffset={[0, 0.75, 0]}>
        <group rotation={[0, 0.32, 0]}>
          <Screen texture={resumeTex} position={[0, 0, 0]} rotation={[0, 0, 0]} />
        </group>
      </Hotspot>

      <Hotspot label="GitHub" sublabel="github.com" onSelect={link(socials.github)} alwaysLabel={false}
        position={[0, DESK_Y + 1.0, -1.0]} labelOffset={[0, 0.8, 0]}>
        <Screen texture={githubTex} position={[0, 0, 0]} rotation={[0, 0, 0]} size={[1.7, 1.05]} />
      </Hotspot>

      <Hotspot label="LinkedIn" sublabel="connect" onSelect={link(socials.linkedin)} alwaysLabel={false}
        position={[1.85, DESK_Y + 0.9, -0.9]} labelOffset={[0, 0.75, 0]}>
        <group rotation={[0, -0.32, 0]}>
          <Screen texture={linkedinTex} position={[0, 0, 0]} rotation={[0, 0, 0]} />
        </group>
      </Hotspot>

      {/* ---------- interactive: LAPTOP -> Projects ---------- */}
      <Hotspot label="Projects" sublabel="open gallery" onSelect={() => openZone("projects")}
        position={[-0.05, DESK_Y + 0.09, 0.55]} labelOffset={[0, 1.1, 0]}>
        <Laptop />
      </Hotspot>

      {/* ---------- interactive: KEYBOARD -> Terminal ---------- */}
      <Hotspot label="Terminal" sublabel="type a command" onSelect={() => openZone("terminal")}
        position={[1.5, DESK_Y + 0.11, 0.7]} labelOffset={[0, 0.5, 0]} liftHeight={0.05}>
        <Keyboard />
      </Hotspot>

      {/* ---------- interactive: SERVER RACK -> DevOps ---------- */}
      <Hotspot label="DevOps Lab" sublabel="infrastructure" onSelect={() => openZone("devops")}
        position={[4.4, 0, -0.4]} labelOffset={[0, 2.3, 0]} liftHeight={0.12}>
        <ServerRack />
      </Hotspot>

      {/* ---------- interactive: ROBOT -> About ---------- */}
      <Hotspot label="About Me" sublabel="say hi" onSelect={() => openZone("about")}
        position={[-4.2, 0, 0.6]} labelOffset={[0, 1.1, 0]} liftHeight={0.12}>
        <group scale={1.3}>
          <Robot />
        </group>
      </Hotspot>

      {/* ---------- interactive: HOLOGRAMS -> Skills ---------- */}
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
        <Hotspot label="Engineering Core" sublabel="domains" onSelect={() => openZone("skills")}
          position={[-1.9, DESK_Y + 1.4, 0.4]} labelOffset={[0, 1.1, 0]} liftHeight={0.15}>
          <Holograms />
        </Hotspot>
      </Float>

      {/* ---------- interactive: TROPHIES -> Achievements ---------- */}
      <Hotspot label="Achievements" sublabel="view awards" onSelect={() => openZone("achievements")}
        position={[2.4, DESK_Y + 0.06, -0.35]} labelOffset={[0, 1.0, 0]}>
        <group>
          <Trophy color="#ffcf5c" />
          <group position={[0.42, 0, 0.14]} scale={0.78}><Trophy color="#d7dce8" /></group>
          <group position={[-0.42, 0, 0.14]} scale={0.78}><Trophy color="#e8a06b" /></group>
        </group>
      </Hotspot>

      {/* ---------- interactive: CONTACT CONSOLE ---------- */}
      <Float speed={1.6} floatIntensity={0.5}>
        <Hotspot label="Contact" sublabel="transmit signal" onSelect={() => openZone("contact")}
          position={[4.2, DESK_Y + 1.6, 0.6]} labelOffset={[0, 0.6, 0]} liftHeight={0.15}>
          <SatelliteBeacon />
        </Hotspot>
      </Float>

      <Particles />
    </group>
  );
}
