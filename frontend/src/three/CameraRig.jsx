import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "../store/useStore";

/**
 * Cinematic camera controller.
 *  - Boot: starts far/dark, then flies in to the desk once `booted` flips.
 *  - Idle: subtle mouse parallax + breathing so the scene always feels alive.
 *  - Zone open: pushes slightly back + up so the overlay has breathing room.
 */
const START = new THREE.Vector3(0, 2.4, 16);
const HOME = new THREE.Vector3(0, 1.9, 7.2);
const ZONE = new THREE.Vector3(0, 2.2, 8.4);
// dramatic dive toward the desk when entering a project case study
const PROJECT = new THREE.Vector3(0, 1.35, 2.4);
const LOOK = new THREE.Vector3(0, 1.05, 0);

export default function CameraRig() {
  const { camera, pointer } = useThree();
  const booted = useStore((s) => s.booted);
  const activeZone = useStore((s) => s.activeZone);
  const activeProject = useStore((s) => s.activeProject);
  const reducedMotion = useStore((s) => s.reducedMotion);
  const target = useRef(START.clone());
  const look = useRef(LOOK.clone());

  useEffect(() => {
    camera.position.copy(START);
    camera.lookAt(LOOK);
  }, [camera]);

  useFrame((state, delta) => {
    const base = !booted ? START : activeProject ? PROJECT : activeZone ? ZONE : HOME;
    target.current.copy(base);

    if (booted && !reducedMotion && !activeProject) {
      const t = state.clock.elapsedTime;
      // mouse parallax
      target.current.x += pointer.x * 0.8;
      target.current.y += pointer.y * 0.4;
      // gentle breathing
      target.current.y += Math.sin(t * 0.5) * 0.06;
      target.current.z += Math.cos(t * 0.35) * 0.05;
    }

    const damp = booted ? 2.2 : 1.1;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, target.current.x, damp, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, target.current.y, damp, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, target.current.z, damp, delta);

    look.current.x = THREE.MathUtils.damp(look.current.x, pointer.x * 0.3, 2, delta);
    camera.lookAt(look.current.x, LOOK.y, LOOK.z);
  });

  return null;
}
