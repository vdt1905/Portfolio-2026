import * as THREE from "three";

/**
 * Distinct, "handcrafted" planet surfaces drawn on canvas per theme.
 * Returns { map, night } — night is an emissive map (city / energy lights).
 * Kept at 512×256 (LOD-friendly) and horizontally tileable enough for a sphere.
 */
const W = 512, H = 256;

function cvs() {
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  return [c, c.getContext("2d")];
}
function tex(c, srgb = true) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
function base(ctx, c1, c2) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // faint speckle for texture
  for (let i = 0; i < 1400; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.04})`;
    ctx.fillRect(Math.random() * W, Math.random() * H, 1, 1);
  }
}

export function planetTexture(style, o) {
  const [c, ctx] = cvs();
  const [nc, nx] = cvs();
  base(ctx, o.c1, o.c2);
  nx.fillStyle = "#000"; nx.fillRect(0, 0, W, H);
  const A = o.accent, N = o.night || o.accent;

  const line = (x1, y1, x2, y2, col, wdt = 1) => { ctx.strokeStyle = col; ctx.lineWidth = wdt; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
  const glow = (x, y, r, col) => { const g = nx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, "rgba(0,0,0,0)"); nx.fillStyle = g; nx.fillRect(x - r, y - r, r * 2, r * 2); };

  switch (style) {
    case "gridCity": { // React — smart city grid + tower windows
      ctx.globalAlpha = 0.25;
      for (let x = 0; x <= W; x += 24) line(x, 0, x, H, A);
      for (let y = 0; y <= H; y += 24) line(0, y, W, y, A);
      ctx.globalAlpha = 1;
      for (let i = 0; i < 260; i++) {
        const x = Math.random() * W, y = Math.random() * H, w = 6 + Math.random() * 12, h = 6 + Math.random() * 14;
        nx.fillStyle = N; nx.globalAlpha = 0.5 + Math.random() * 0.5; nx.fillRect(x, y, w, h); nx.globalAlpha = 1;
      }
      break;
    }
    case "circuit": { // JavaScript — circuit traces + nodes
      for (let i = 0; i < 90; i++) {
        let x = Math.random() * W, y = Math.random() * H;
        nx.strokeStyle = N; nx.lineWidth = 1; nx.beginPath(); nx.moveTo(x, y);
        for (let s = 0; s < 4; s++) { x += (Math.random() - 0.5) * 60; y += (Math.random() < 0.5 ? 0 : (Math.random() - 0.5) * 40); nx.lineTo(x, y); }
        nx.stroke();
        glow(x, y, 5, N);
      }
      break;
    }
    case "industrial": { // Node — blocky server towers + data highways
      for (let i = 0; i < 120; i++) {
        const x = Math.random() * W, y = Math.random() * H, w = 8 + Math.random() * 20, h = 10 + Math.random() * 26;
        ctx.fillStyle = "rgba(255,255,255,0.05)"; ctx.fillRect(x, y, w, h);
        nx.fillStyle = N; nx.fillRect(x + 2, y + h - 3, w - 4, 2);
      }
      for (let y = 20; y < H; y += 40) { nx.strokeStyle = N; nx.globalAlpha = 0.6; nx.lineWidth = 1.5; nx.beginPath(); nx.moveTo(0, y); nx.lineTo(W, y); nx.stroke(); nx.globalAlpha = 1; }
      break;
    }
    case "neural": { // Python & AI — node network
      const nodes = Array.from({ length: 70 }, () => [Math.random() * W, Math.random() * H]);
      nx.strokeStyle = N; nx.globalAlpha = 0.35;
      nodes.forEach((a, i) => { const b = nodes[(i + 1 + (Math.random() * 5 | 0)) % nodes.length]; nx.beginPath(); nx.moveTo(a[0], a[1]); nx.lineTo(b[0], b[1]); nx.stroke(); });
      nx.globalAlpha = 1;
      nodes.forEach(([x, y]) => glow(x, y, 6 + Math.random() * 6, N));
      break;
    }
    case "crystal": { // MongoDB — faceted crystals + light rivers
      for (let i = 0; i < 60; i++) {
        const x = Math.random() * W, y = Math.random() * H, s = 8 + Math.random() * 16;
        nx.strokeStyle = N; nx.globalAlpha = 0.7; nx.beginPath();
        nx.moveTo(x, y - s); nx.lineTo(x + s * 0.7, y); nx.lineTo(x, y + s); nx.lineTo(x - s * 0.7, y); nx.closePath(); nx.stroke(); nx.globalAlpha = 1;
      }
      for (let i = 0; i < 5; i++) { nx.strokeStyle = N; nx.globalAlpha = 0.5; nx.lineWidth = 3; nx.beginPath(); nx.moveTo(0, Math.random() * H); nx.bezierCurveTo(W * 0.3, Math.random() * H, W * 0.6, Math.random() * H, W, Math.random() * H); nx.stroke(); nx.globalAlpha = 1; nx.lineWidth = 1; }
      break;
    }
    case "geometric": { // SQL — relational grid of connected shapes
      const gx = 6, gy = 3, sx = W / gx, sy = H / gy;
      const pts = [];
      for (let i = 0; i < gx; i++) for (let j = 0; j < gy; j++) pts.push([sx * (i + 0.5), sy * (j + 0.5)]);
      nx.strokeStyle = N; nx.globalAlpha = 0.4;
      pts.forEach((p, i) => { if (i % gy !== gy - 1) { nx.beginPath(); nx.moveTo(p[0], p[1]); nx.lineTo(pts[i + 1][0], pts[i + 1][1]); nx.stroke(); } if (i + gy < pts.length) { nx.beginPath(); nx.moveTo(p[0], p[1]); nx.lineTo(pts[i + gy][0], pts[i + gy][1]); nx.stroke(); } });
      nx.globalAlpha = 1;
      pts.forEach(([x, y]) => { nx.strokeStyle = N; nx.strokeRect(x - 8, y - 8, 16, 16); glow(x, y, 5, N); });
      break;
    }
    case "terminal": { // Linux — scanlines + glyphs
      for (let y = 0; y < H; y += 3) { ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.fillRect(0, y, W, 1); }
      nx.fillStyle = N; nx.font = "9px monospace"; nx.globalAlpha = 0.8;
      const g = "$>_/|01#";
      for (let i = 0; i < 500; i++) nx.fillText(g[(Math.random() * g.length) | 0], Math.random() * W, Math.random() * H);
      nx.globalAlpha = 1;
      break;
    }
    case "station":
    case "mechanical": { // C++ / DevOps — concentric machinery
      ctx.strokeStyle = "rgba(255,255,255,0.06)"; ctx.lineWidth = 2;
      for (let r = 14; r < W; r += 22) { ctx.beginPath(); ctx.arc(W / 2, H / 2, r, 0, Math.PI * 2); ctx.stroke(); }
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 12) line(W / 2, H / 2, W / 2 + Math.cos(a) * W, H / 2 + Math.sin(a) * W, "rgba(255,255,255,0.05)");
      for (let i = 0; i < 120; i++) { const x = Math.random() * W, y = Math.random() * H; nx.fillStyle = N; nx.globalAlpha = 0.5; nx.fillRect(x, y, 2, 2); nx.globalAlpha = 1; }
      break;
    }
    default: break;
  }
  return { map: tex(c), night: tex(nc) };
}
