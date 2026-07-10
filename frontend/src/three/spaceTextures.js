import * as THREE from "three";

/** Procedural celestial textures — no image assets, no repetition. */

function canvas(size) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  return [c, c.getContext("2d")];
}
function tex(c) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/** Soft radial glow — used for atmospheres, the distant sun, nebula sprites. */
export function glowTexture(hex = "#00e5ff", falloff = 0.5) {
  const [c, ctx] = canvas(256);
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  const col = new THREE.Color(hex);
  const rgb = `${(col.r * 255) | 0},${(col.g * 255) | 0},${(col.b * 255) | 0}`;
  g.addColorStop(0, `rgba(${rgb},1)`);
  g.addColorStop(falloff, `rgba(${rgb},0.35)`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return tex(c);
}

/** Wispy nebula cloud — layered soft blobs. */
export function nebulaTexture(hex = "#6c63ff") {
  const [c, ctx] = canvas(512);
  const col = new THREE.Color(hex);
  const rgb = `${(col.r * 255) | 0},${(col.g * 255) | 0},${(col.b * 255) | 0}`;
  ctx.clearRect(0, 0, 512, 512);
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 512, y = Math.random() * 512;
    const r = 40 + Math.random() * 150;
    const a = 0.02 + Math.random() * 0.05;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${rgb},${a})`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 512);
  }
  return tex(c);
}

/** Banded gas-giant surface. */
export function gasGiantTexture(base = "#2a3a6a", accent = "#6c63ff") {
  const [c, ctx] = canvas(512);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 512, 512);
  const a = new THREE.Color(base), b = new THREE.Color(accent);
  for (let y = 0; y < 512; y += 2) {
    const t = (Math.sin(y * 0.06) + 1) / 2 + (Math.random() - 0.5) * 0.15;
    const col = a.clone().lerp(b, Math.max(0, Math.min(1, t)) * 0.6);
    ctx.fillStyle = `rgb(${(col.r * 255) | 0},${(col.g * 255) | 0},${(col.b * 255) | 0})`;
    ctx.fillRect(0, y, 512, 2);
  }
  // a subtle storm
  const g = ctx.createRadialGradient(360, 300, 4, 360, 300, 60);
  g.addColorStop(0, "rgba(255,209,102,0.5)");
  g.addColorStop(1, "rgba(255,209,102,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(360, 300, 60, 34, 0, 0, Math.PI * 2);
  ctx.fill();
  return tex(c);
}

/** Cratered rocky moon. */
export function moonTexture() {
  const [c, ctx] = canvas(512);
  ctx.fillStyle = "#3a3f4b";
  ctx.fillRect(0, 0, 512, 512);
  // subtle noise
  const img = ctx.getImageData(0, 0, 512, 512);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 26;
    img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
  // craters
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * 512, y = Math.random() * 512, r = 3 + Math.random() * 22;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(20,22,28,${0.25 + Math.random() * 0.25})`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x - r * 0.2, y - r * 0.2, r * 0.8, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(150,155,170,0.10)";
    ctx.fill();
  }
  return tex(c);
}
