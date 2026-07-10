import { useMemo } from "react";
import * as THREE from "three";
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useStore } from "../store/useStore";

/**
 * Post-processing stack — this is what sells the "neon" look.
 * Bloom makes every emissive material glow; vignette focuses the eye;
 * a whisper of chromatic aberration adds a lens/sci-fi quality.
 * Disabled on low-power devices to protect frame rate.
 */
export default function Effects() {
  const quality = useStore((s) => s.quality);
  const offset = useMemo(() => new THREE.Vector2(0.0006, 0.0006), []);
  if (quality === "low") return null;

  return (
    <EffectComposer disableNormalPass multisampling={4}>
      <Bloom
        intensity={0.9}
        luminanceThreshold={0.35}
        luminanceSmoothing={0.85}
        mipmapBlur
        radius={0.7}
      />
      <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={offset} />
      <Vignette eskil={false} offset={0.25} darkness={0.85} />
    </EffectComposer>
  );
}
