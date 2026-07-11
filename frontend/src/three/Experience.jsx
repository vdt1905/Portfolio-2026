import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, AdaptiveEvents, Preload } from "@react-three/drei";
import CameraRig from "./CameraRig";
import Workspace from "./Workspace";
import Effects from "./Effects";
import { useStore, QUALITY } from "../store/useStore";

/**
 * The persistent 3D world. Mounts once and lives behind every overlay.
 * When a zone is open we let the canvas keep rendering (camera pulls back)
 * so the world is always felt, never a static screenshot.
 */
export default function Experience() {
  const activeZone = useStore((s) => s.activeZone);
  const activeProject = useStore((s) => s.activeProject);
  const quality = useStore((s) => s.quality);
  const maxDpr = (QUALITY[quality] || QUALITY.high).dpr;
  const receded = activeZone || activeProject;

  return (
    <div
      className="fixed inset-0 z-10 transition-all duration-700"
      style={{
        filter: receded ? "blur(7px) brightness(0.5)" : "none",
        transform: receded ? "scale(1.03)" : "scale(1)",
      }}
    >
      <Canvas
        dpr={[1, maxDpr]}
        frameloop={receded ? "never" : "always"}
        gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
        camera={{ fov: 42, near: 0.1, far: 260, position: [0, 2.4, 16] }}
        onCreated={({ gl }) => gl.setClearColor("#02040A")}
      >
        <Suspense fallback={null}>
          <CameraRig />
          <Workspace />
          <Effects />
          <Preload all />
        </Suspense>
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
      </Canvas>
    </div>
  );
}
