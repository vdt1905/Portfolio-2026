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
import { resumeScreen, githubScreen, linkedinScreen, projectsScreen } from "./screenTextures";

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
  const cursor = useRef();
  const pulse = useRef();
  const scan = useRef();

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (cursor.current) cursor.current.visible = Math.sin(t * 7) > 0;
    if (pulse.current) pulse.current.material.emissiveIntensity = 0.35 + Math.sin(t * 3) * 0.18;
    if (scan.current) scan.current.position.x = -0.48 + ((t * 0.35) % 0.96);
  });

  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.16, 0.09, 0.46]} />
        <meshStandardMaterial color="#0d0d10" metalness={0.5} roughness={0.5} />
      </mesh>

      <mesh ref={pulse} position={[0, 0.058, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.04, 0.36]} />
        <meshStandardMaterial
          color="#05080c"
          emissive="#00e5ff"
          emissiveIntensity={0.35}
          toneMapped={false}
        />
      </mesh>

      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 8 }).map((__, col) => (
          <mesh key={`${row}-${col}`} position={[-0.4 + col * 0.115, 0.07, -0.14 + row * 0.085]}>
            <boxGeometry args={[0.068, 0.018, 0.042]} />
            <meshStandardMaterial
              color="#111a20"
              emissive={col === row * 2 ? "#00ff9c" : "#00e5ff"}
              emissiveIntensity={col === row * 2 ? 0.75 : 0.16}
              toneMapped={false}
            />
          </mesh>
        ))
      )}

      <mesh ref={scan} position={[-0.55, 0.083, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.035, 0.34]} />
        <meshStandardMaterial color="#00ff9c" emissive="#00ff9c" emissiveIntensity={1.4} transparent opacity={0.5} toneMapped={false} />
      </mesh>

      <group position={[0, 0.22, -0.34]} rotation={[-0.48, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.98, 0.34, 0.035]} />
          <meshStandardMaterial color="#070b10" metalness={0.55} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0, 0.023]}>
          <planeGeometry args={[0.9, 0.25]} />
          <meshStandardMaterial color="#021014" emissive="#00e5ff" emissiveIntensity={0.22} toneMapped={false} />
        </mesh>
        {["$ npm run dev", "> vite ready", "open projects --all"].map((line, i) => (
          <group key={line} position={[-0.34, 0.085 - i * 0.072, 0.045]}>
            <mesh>
              <boxGeometry args={[0.44 - i * 0.055, 0.016, 0.01]} />
              <meshStandardMaterial color={i === 0 ? "#00ff9c" : "#00e5ff"} emissive={i === 0 ? "#00ff9c" : "#00e5ff"} emissiveIntensity={0.8 - i * 0.12} toneMapped={false} />
            </mesh>
          </group>
        ))}
        <mesh ref={cursor} position={[0.24, -0.06, 0.05]}>
          <boxGeometry args={[0.03, 0.052, 0.012]} />
          <meshStandardMaterial color="#ffffff" emissive="#00ff9c" emissiveIntensity={1.6} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function Laptop() {
  const tex = useMemo(() => projectsScreen(), []);
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
            map={tex}
            emissiveMap={tex}
            emissive="#ffffff"
            emissiveIntensity={1.25}
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
  const root = useRef();
  const orbits = useRef([]);
  const core = useRef();

  useFrame((s, d) => {
    const t = s.clock.elapsedTime;
    if (root.current) root.current.rotation.y += d * 0.22;
    if (core.current) core.current.scale.setScalar(1 + Math.sin(t * 2.2) * 0.06);
    orbits.current.forEach((orbit, i) => {
      if (!orbit) return;
      orbit.rotation.y += d * (0.55 + i * 0.22);
      orbit.rotation.z = Math.sin(t * 0.45 + i) * 0.08;
    });
  });

  const planets = [
    { radius: 0.42, size: 0.045, color: "#00ff9c", speed: 0.7 },
    { radius: 0.64, size: 0.06, color: "#6c63ff", speed: 0.5 },
    { radius: 0.86, size: 0.05, color: "#00e5ff", speed: 0.38 },
  ];

  return (
    <group ref={root} rotation={[0.08, 0, -0.14]} scale={0.72}>
      <mesh ref={core}>
        <sphereGeometry args={[0.14, 24, 24]} />
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={2.6}
          toneMapped={false}
        />
      </mesh>

      {planets.map((planet, i) => (
        <group
          key={planet.radius}
          ref={(el) => (orbits.current[i] = el)}
          rotation={[0.16 + i * 0.08, i * 0.7, 0]}
        >
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[planet.radius, 0.005, 8, 96]} />
            <meshStandardMaterial
              color={planet.color}
              emissive={planet.color}
              emissiveIntensity={0.75}
              transparent
              opacity={0.58}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[planet.radius, 0, 0]}>
            <sphereGeometry args={[planet.size, 18, 18]} />
            <meshStandardMaterial
              color={planet.color}
              emissive={planet.color}
              emissiveIntensity={1.8}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      {[-0.28, 0.28].map((y, i) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, i ? 0.75 : -0.75]}>
          <torusGeometry args={[0.22, 0.004, 8, 48]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#6c63ff"
            emissiveIntensity={0.9}
            transparent
            opacity={0.45}
            toneMapped={false}
          />
        </mesh>
      ))}
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
        position={[1.18, DESK_Y + 0.11, 0.82]} labelOffset={[-0.02, 0.72, 0]} liftHeight={0.05}>
        <group rotation={[0, -0.08, 0]}>
          <Keyboard />
        </group>
      </Hotspot>

      {/* ---------- interactive: SERVER RACK -> DevOps ---------- */}
      <Hotspot label="DevOps Lab" sublabel="infrastructure" onSelect={() => openZone("devops")}
        position={[4.4, 0, -0.4]} labelOffset={[0, 2.3, 0]} liftHeight={0.12}>
        <ServerRack />
      </Hotspot>

      {/* ---------- interactive: ROBOT -> About ---------- */}
      <Hotspot label="About Me" sublabel="fly my journey" onSelect={() => openZone("about")}
        position={[-4.2, 0, 0.6]} labelOffset={[0, 1.1, 0]} liftHeight={0.12}>
        <group scale={1.3}>
          <Robot />
        </group>
      </Hotspot>

      {/* ---------- interactive: HOLOGRAMS -> Skills ---------- */}
      <Float speed={1.4} rotationIntensity={0.16} floatIntensity={0.28}>
        <Hotspot label="Skills" sublabel="explore skills" onSelect={() => openZone("skills")}
          position={[-2.45, DESK_Y + 1.52, 0.18]} labelOffset={[-0.22, 0.72, 0]} liftHeight={0.1}>
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
