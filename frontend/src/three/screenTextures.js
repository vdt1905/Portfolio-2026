import * as THREE from "three";

/**
 * Procedurally drawn monitor screens (no image assets needed).
 * Each returns a CanvasTexture used as an emissive map so it glows via bloom.
 */
const W = 512;
const H = 320;

function base(ctx, accent) {
  ctx.fillStyle = "#070a0f";
  ctx.fillRect(0, 0, W, H);
  // top bar
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  ctx.fillRect(0, 0, W, 34);
  ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(22 + i * 20, 17, 5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = accent;
  ctx.font = "600 13px monospace";
}

function make(draw) {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  draw(ctx);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function resumeScreen() {
  return make((ctx) => {
    base(ctx, "#00e5ff");
    ctx.fillText("~/resume.pdf", 46, 22);
    ctx.fillStyle = "#00e5ff";
    ctx.font = "700 26px sans-serif";
    ctx.fillText("VANSH TANDEL", 26, 84);
    ctx.fillStyle = "#a0a0a0";
    ctx.font = "13px sans-serif";
    ctx.fillText("SDE // DevOps & Full Stack", 26, 106);
    const rows = [0.9, 0.7, 0.8, 0.55, 0.85, 0.6];
    rows.forEach((r, i) => {
      ctx.fillStyle = "rgba(255,255,255,0.14)";
      ctx.fillRect(26, 138 + i * 26, 440 * r, 10);
    });
    ctx.strokeStyle = "rgba(0,229,255,0.5)";
    ctx.strokeRect(1, 1, W - 2, H - 2);
  });
}

export function githubScreen() {
  return make((ctx) => {
    base(ctx, "#00ff9c");
    ctx.fillText("github.com/vanshtandel", 46, 22);
    // contribution grid
    const cols = 26;
    const rows = 7;
    const cell = 12;
    const ox = 30;
    const oy = 70;
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const v = Math.random();
        const a = v > 0.8 ? 0.9 : v > 0.55 ? 0.5 : v > 0.3 ? 0.25 : 0.08;
        ctx.fillStyle = `rgba(0,255,156,${a})`;
        ctx.fillRect(ox + x * (cell + 3), oy + y * (cell + 3), cell, cell);
      }
    }
    ctx.fillStyle = "#00ff9c";
    ctx.font = "700 20px sans-serif";
    ctx.fillText("building in public", 30, 230);
    ctx.fillStyle = "#a0a0a0";
    ctx.font = "13px monospace";
    ctx.fillText("$ git push origin main", 30, 270);
  });
}

export function linkedinScreen() {
  return make((ctx) => {
    base(ctx, "#6c63ff");
    ctx.fillText("linkedin.com/in/vanshtandel", 46, 22);
    ctx.fillStyle = "#6c63ff";
    ctx.beginPath();
    ctx.arc(70, 110, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "700 20px sans-serif";
    ctx.fillText("Vansh Tandel", 120, 100);
    ctx.fillStyle = "#a0a0a0";
    ctx.font = "13px sans-serif";
    ctx.fillText("Software & DevOps Engineer", 120, 124);
    ["500+ connections", "Open to opportunities", "Building in public"].forEach((t, i) => {
      ctx.fillStyle = "rgba(108,99,255,0.18)";
      ctx.fillRect(30, 168 + i * 40, 452, 28);
      ctx.fillStyle = "#cfd2ff";
      ctx.font = "13px sans-serif";
      ctx.fillText(t, 44, 187 + i * 40);
    });
  });
}
