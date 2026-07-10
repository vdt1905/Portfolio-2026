import { Suspense, lazy } from "react";
import { AnimatePresence } from "framer-motion";
import { useStore } from "./store/useStore";
import BootSequence from "./components/BootSequence";
import Cursor from "./components/Cursor";
import HUD from "./components/HUD";
import ZoneRouter from "./components/ZoneRouter";
import EasterEggs from "./components/EasterEggs";

// The 3D world is heavy — load it lazily behind the boot screen.
const Experience = lazy(() => import("./three/Experience"));
// The immersive project showcase is heavy too — lazy-load on demand.
const ProjectExperience = lazy(() => import("./components/project/ProjectExperience"));

export default function App() {
  const booted = useStore((s) => s.booted);
  const activeProject = useStore((s) => s.activeProject);

  return (
    <>
      {/* ambient CSS backdrop (mouse-follow glow + grid) */}
      <div className="ambient-field" />
      <div className="grid-overlay" />

      {/* persistent 3D world */}
      <Suspense fallback={null}>
        <Experience />
      </Suspense>

      {/* boot -> workspace */}
      {!booted && <BootSequence />}

      {/* UI layer */}
      <HUD />
      <ZoneRouter />

      {/* immersive project case-study takeover */}
      <AnimatePresence>
        {activeProject && (
          <Suspense fallback={null}>
            <ProjectExperience />
          </Suspense>
        )}
      </AnimatePresence>

      {/* fun */}
      <EasterEggs />
      <Cursor />
    </>
  );
}
