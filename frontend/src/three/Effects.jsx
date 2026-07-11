import { EffectComposer, Bloom, Vignette, SMAA } from "@react-three/postprocessing";
import { useStore } from "../store/useStore";

/**
 * Restrained post-processing — subtle by design:
 *   · low-intensity Bloom (only bright emissives glow)
 *   · very subtle Vignette to focus the eye
 *   · SMAA for clean edges (cheaper than heavy MSAA)
 * Tone mapping is ACES (renderer default). No chromatic aberration,
 * no film grain, no motion blur. Disabled entirely on low quality.
 */
export default function Effects() {
  const quality = useStore((s) => s.quality);
  if (quality === "low") return null;

  return (
    <EffectComposer disableNormalPass multisampling={0}>
      <Bloom intensity={0.5} luminanceThreshold={0.55} luminanceSmoothing={0.9} mipmapBlur radius={0.5} />
      <Vignette offset={0.32} darkness={0.55} eskil={false} />
      <SMAA />
    </EffectComposer>
  );
}
