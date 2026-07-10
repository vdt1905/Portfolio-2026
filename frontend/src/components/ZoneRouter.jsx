import { Suspense, lazy } from "react";
import { AnimatePresence } from "framer-motion";
import { useStore } from "../store/useStore";

// Lazy-load zones so heavy deps (three.js in Engineering Core, prism in
// Terminal) stay out of the initial bundle and load on demand.
const About = lazy(() => import("./zones/About"));
const Projects = lazy(() => import("./zones/Projects"));
const DevOps = lazy(() => import("./zones/DevOps"));
const EngineeringCore = lazy(() => import("./zones/EngineeringCore"));
const Terminal = lazy(() => import("./zones/Terminal"));
const Achievements = lazy(() => import("./zones/Achievements"));
const Contact = lazy(() => import("./zones/Contact"));

const MAP = {
  about: About,
  projects: Projects,
  devops: DevOps,
  skills: EngineeringCore,
  terminal: Terminal,
  achievements: Achievements,
  contact: Contact,
};

/** Renders whichever content zone is active, animating in/out. */
export default function ZoneRouter() {
  const activeZone = useStore((s) => s.activeZone);
  const Zone = activeZone ? MAP[activeZone] : null;

  return (
    <AnimatePresence mode="wait">
      {Zone && (
        <Suspense key={activeZone} fallback={null}>
          <Zone />
        </Suspense>
      )}
    </AnimatePresence>
  );
}
