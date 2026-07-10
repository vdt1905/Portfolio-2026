import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "../store/useStore";

/**
 * Wraps a piece of 3D geometry to make it interactive:
 *  - shows a PERSISTENT label so first-time visitors immediately know
 *    what each object does (dim by default, lights up on hover)
 *  - lifts + scales on hover
 *  - drives the global `hovered` state (HUD + cursor react to it)
 *  - onSelect fires on click (usually opens a zone)
 */
export default function Hotspot({
  children,
  label,
  sublabel,
  onSelect,
  position = [0, 0, 0],
  liftHeight = 0.08,
  labelOffset = [0, 0.6, 0],
  alwaysLabel = true,
  disabled = false,
}) {
  const group = useRef();
  const [hovered, setHovered] = useState(false);
  const setGlobalHover = useStore((s) => s.setHovered);
  const baseY = position[1];

  useFrame((_, delta) => {
    if (!group.current) return;
    const target = hovered && !disabled ? baseY + liftHeight : baseY;
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, target, 6, delta);
    const s = hovered && !disabled ? 1.04 : 1;
    const ns = THREE.MathUtils.damp(group.current.scale.x, s, 6, delta);
    group.current.scale.setScalar(ns);
  });

  const enter = (e) => {
    e.stopPropagation();
    if (disabled) return;
    setHovered(true);
    setGlobalHover(label);
  };
  const leave = (e) => {
    e.stopPropagation();
    setHovered(false);
    setGlobalHover(null);
  };
  const click = (e) => {
    e.stopPropagation();
    if (disabled) return;
    onSelect?.();
  };

  return (
    <group
      ref={group}
      position={position}
      onPointerOver={enter}
      onPointerOut={leave}
      onClick={click}
    >
      {children}

      {label && !disabled && (alwaysLabel || hovered) && (
        <Html
          position={labelOffset}
          center
          zIndexRange={[30, 0]}
          style={{ pointerEvents: "none", transition: "opacity .3s" }}
        >
          <div className={`station-tag ${hovered ? "station-tag--on" : ""}`}>
            <span className="station-tag__dot" />
            <span className="station-tag__title">{label}</span>
            {hovered && sublabel && <span className="station-tag__sub">{sublabel}</span>}
          </div>
        </Html>
      )}
    </group>
  );
}
