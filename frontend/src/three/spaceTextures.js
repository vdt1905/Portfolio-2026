import * as THREE from "three";

/**
 * Realistic procedural celestial surfaces — seamless (sampled over the
 * actual sphere direction, so no poles/seam artifacts), with matching
 * normal maps, cloud layers and night-side city lights. No image assets.
 */

/* ---------- seamless 3D value-noise ---------- */
function hash(i, j, k) {
  const n = Math.sin(i * 127.1 + j * 311.7 + k * 74.7) * 43758.5453123;
  return 2 * (n - Math.floor(n)) - 1; // [-1,1]
}
function noise3(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
  const c000 = hash(xi, yi, zi), c100 = hash(xi + 1, yi, zi), c010 = hash(xi, yi + 1, zi), c110 = hash(xi + 1, yi + 1, zi);
  const c001 = hash(xi, yi, zi + 1), c101 = hash(xi + 1, yi, zi + 1), c011 = hash(xi, yi + 1, zi + 1), c111 = hash(xi + 1, yi + 1, zi + 1);
  const x00 = c000 + (c100 - c000) * u, x10 = c010 + (c110 - c010) * u;
  const x01 = c001 + (c101 - c001) * u, x11 = c011 + (c111 - c011) * u;
  const y0 = x00 + (x10 - x00) * v, y1 = x01 + (x11 - x01) * v;
  return y0 + (y1 - y0) * w;
}
function fbm(x, y, z, oct = 5, gain = 0.5, lac = 2) {
  let a = 0, amp = 0.5, f = 1;
  for (let i = 0; i < oct; i++) { a += amp * noise3(x * f, y * f, z * f); f *= lac; amp *= gain; }
  return a;
}

function makeCanvas(w, h) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  return [c, c.getContext("2d")];
}
function toTex(c) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}
function toLinearTex(c) {
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = 8; // normal maps stay linear
  return t;
}
const dir = (u, v) => {
  const lon = u * Math.PI * 2, lat = (0.5 - v) * Math.PI;
  const cl = Math.cos(lat);
  return [cl * Math.cos(lon), Math.sin(lat), cl * Math.sin(lon)];
};
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const sstep = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };

/** Build a tangent-space normal map from a height field (w×h Float array). */
function normalMapFromHeight(height, w, h, strength = 2.2) {
  const [c, ctx] = makeCanvas(w, h);
  const img = ctx.createImageData(w, h);
  const at = (x, y) => height[((y + h) % h) * w + ((x + w) % w)];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (at(x - 1, y) - at(x + 1, y)) * strength;
      const dy = (at(x, y - 1) - at(x, y + 1)) * strength;
      const nx = dx, ny = dy, nz = 1;
      const len = Math.hypot(nx, ny, nz);
      const i = (y * w + x) * 4;
      img.data[i] = ((nx / len) * 0.5 + 0.5) * 255;
      img.data[i + 1] = ((ny / len) * 0.5 + 0.5) * 255;
      img.data[i + 2] = ((nz / len) * 0.5 + 0.5) * 255;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return toLinearTex(c);
}

/* ==========================================================
   EARTH-LIKE PLANET  →  { map, normalMap, clouds, night }
   ========================================================== */
export function earthTextures(w = 1024, h = 512, seed = 11) {
  const [c, ctx] = makeCanvas(w, h);
  const [nc, nctx] = makeCanvas(w, h);   // night lights
  const [rc, rctx] = makeCanvas(w, h);   // roughness (ocean shiny, land matte)
  nctx.fillStyle = "#000"; nctx.fillRect(0, 0, w, h);
  const img = ctx.createImageData(w, h);
  const rough = rctx.createImageData(w, h);
  const night = nctx.getImageData(0, 0, w, h);
  const height = new Float32Array(w * h);
  const SEA = 0.0;

  // muted, physically-plausible palette (low saturation so it recedes)
  const deep = [9, 30, 58], shallow = [26, 74, 112];
  const beach = [150, 140, 108];
  const desert = [150, 132, 96], forest = [58, 82, 56];
  const rock = [104, 96, 82], snow = [226, 232, 240];

  for (let y = 0; y < h; y++) {
    const lat = (0.5 - y / h) * Math.PI;
    const cold = Math.pow(Math.abs(lat) / (Math.PI / 2), 2.4);
    for (let x = 0; x < w; x++) {
      const [dx, dy, dz] = dir(x / w, y / h);
      // continents (large) + coastline detail (small)
      const cont = fbm(dx * 1.6 + seed, dy * 1.6, dz * 1.6 + seed, 5);
      const detail = fbm(dx * 5 + 2, dy * 5, dz * 5, 4) * 0.25;
      const e = cont + detail;
      const land = e > SEA;
      height[y * w + x] = land ? Math.max(0, e) : 0;
      let r, g, b, ro;
      if (!land) {
        const t = sstep(-0.5, SEA, e);
        r = lerp(deep[0], shallow[0], t); g = lerp(deep[1], shallow[1], t); b = lerp(deep[2], shallow[2], t);
        ro = 0.22 + (1 - t) * 0.08; // ocean = shiny
      } else {
        const el = sstep(SEA, 0.6, e);
        const moist = (fbm(dx * 3 + 30, dy * 3, dz * 3, 4) + 1) / 2;
        let base = el < 0.05 ? beach : lerp3(desert, forest, moist);
        if (el > 0.62) base = lerp3(base, rock, sstep(0.62, 0.85, el));
        r = base[0]; g = base[1]; b = base[2];
        if (el > 0.82) { const s = sstep(0.82, 0.95, el); r = lerp(r, snow[0], s); g = lerp(g, snow[1], s); b = lerp(b, snow[2], s); }
        ro = 0.95;
        if (el > 0.06 && el < 0.55 && cold < 0.45 && moist > 0.4 && Math.random() < 0.004) {
          const i = (y * w + x) * 4;
          night.data[i] = 255; night.data[i + 1] = 210; night.data[i + 2] = 150; night.data[i + 3] = 255;
        }
      }
      if (cold > 0.75) { const s = sstep(0.75, 0.95, cold); r = lerp(r, snow[0], s); g = lerp(g, snow[1], s); b = lerp(b, snow[2], s); if (land) height[y * w + x] += 0.05 * s; }
      const i = (y * w + x) * 4;
      img.data[i] = r; img.data[i + 1] = g; img.data[i + 2] = b; img.data[i + 3] = 255;
      rough.data[i] = rough.data[i + 1] = rough.data[i + 2] = ro * 255; rough.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  nctx.putImageData(night, 0, 0);
  rctx.putImageData(rough, 0, 0);

  // clouds
  const [cc, cctx] = makeCanvas(w, h);
  const cimg = cctx.createImageData(w, h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const [dx, dy, dz] = dir(x / w, y / h);
      const cl = fbm(dx * 2.6 + 20, dy * 2.6, dz * 2.6 + 20, 5) + 0.12;
      const a = sstep(0.14, 0.5, cl);
      const i = (y * w + x) * 4;
      cimg.data[i] = cimg.data[i + 1] = cimg.data[i + 2] = 244;
      cimg.data[i + 3] = a * 210;
    }
  cctx.putImageData(cimg, 0, 0);

  return {
    map: toTex(c),
    normalMap: normalMapFromHeight(height, w, h, 2.2),
    roughnessMap: toLinearTex(rc),
    clouds: toTex(cc),
    night: toTex(nc),
  };
}
const lerp3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

/* ==========================================================
   GAS GIANT  →  { map, normalMap }
   ========================================================== */
export function gasGiantTextures(w = 512, h = 256, palette = ["#233156", "#3a4f8a", "#8a93c8", "#c9a06a"]) {
  const [c, ctx] = makeCanvas(w, h);
  const img = ctx.createImageData(w, h);
  const height = new Float32Array(w * h);
  const cols = palette.map((p) => new THREE.Color(p));
  for (let y = 0; y < h; y++) {
    const lat = (0.5 - y / h) * Math.PI;
    for (let x = 0; x < w; x++) {
      const [dx, dy, dz] = dir(x / w, y / h);
      const warp = fbm(dx * 2 + 3, dy * 2, dz * 2, 4) * 0.5;
      const band = (Math.sin((lat + warp) * 9) + 1) / 2;
      const turb = fbm(dx * 6, dy * 6, dz * 6, 5) * 0.5 + 0.5;
      height[y * w + x] = band * 0.6 + turb * 0.4;
      const idx = band * (cols.length - 1);
      const i0 = Math.floor(idx), t = idx - i0;
      const col = cols[i0].clone().lerp(cols[Math.min(i0 + 1, cols.length - 1)], t);
      col.multiplyScalar(0.85 + turb * 0.3);
      const i = (y * w + x) * 4;
      img.data[i] = col.r * 255; img.data[i + 1] = col.g * 255; img.data[i + 2] = col.b * 255; img.data[i + 3] = 255;
    }
  }
  const sx = w * 0.68, sy = h * 0.6;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const d = Math.hypot((x - sx) / 46, (y - sy) / 26);
      if (d < 1) {
        const i = (y * w + x) * 4;
        const a = (1 - d) * 0.8;
        img.data[i] = lerp(img.data[i], 214, a); img.data[i + 1] = lerp(img.data[i + 1], 120, a); img.data[i + 2] = lerp(img.data[i + 2], 78, a);
      }
    }
  ctx.putImageData(img, 0, 0);
  return { map: toTex(c), normalMap: normalMapFromHeight(height, w, h, 1.2) };
}

/* ==========================================================
   MOON  →  { map, normalMap }
   ========================================================== */
export function moonTextures(w = 512, h = 256) {
  const [c, ctx] = makeCanvas(w, h);
  const img = ctx.createImageData(w, h);
  const height = new Float32Array(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const [dx, dy, dz] = dir(x / w, y / h);
      const e = fbm(dx * 3 + 7, dy * 3, dz * 3 + 7, 6);
      const mare = fbm(dx * 1.5, dy * 1.5, dz * 1.5, 3);
      const g = 150 + e * 60 - (mare > 0.15 ? 55 : 0);
      height[y * w + x] = e * 0.5 + 0.5;
      const i = (y * w + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = clamp(g, 30, 210);
      img.data[i + 3] = 255;
    }
  ctx.putImageData(img, 0, 0);
  for (let n = 0; n < 90; n++) {
    const x = Math.random() * w, y = Math.random() * h, r = 2 + Math.random() * 16;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(24,26,32,${0.3 + Math.random() * 0.3})`; ctx.fill();
    ctx.beginPath(); ctx.arc(x - r * 0.25, y - r * 0.25, r * 0.7, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(210,214,224,0.10)"; ctx.fill();
    const cx = Math.round(x), cy = Math.round(y);
    if (cy >= 0 && cy < h && cx >= 0 && cx < w) height[cy * w + cx] -= 0.3;
  }
  return { map: toTex(c), normalMap: normalMapFromHeight(height, w, h, 3) };
}

/* soft radial glow (nebula sprites, distant galaxy) */
export function glowTexture(hex = "#00e5ff", falloff = 0.5) {
  const [c, ctx] = makeCanvas(256, 256);
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  const col = new THREE.Color(hex);
  const rgb = `${(col.r * 255) | 0},${(col.g * 255) | 0},${(col.b * 255) | 0}`;
  g.addColorStop(0, `rgba(${rgb},1)`);
  g.addColorStop(falloff, `rgba(${rgb},0.35)`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256);
  return toTex(c);
}

export function nebulaTexture(hex = "#6c63ff") {
  const [c, ctx] = makeCanvas(512, 512);
  const col = new THREE.Color(hex);
  const rgb = `${(col.r * 255) | 0},${(col.g * 255) | 0},${(col.b * 255) | 0}`;
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * 512, y = Math.random() * 512, r = 40 + Math.random() * 150, a = 0.02 + Math.random() * 0.05;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 512);
  }
  return toTex(c);
}
