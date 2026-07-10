import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "../store/useStore";
import { profile } from "../data/portfolio";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a",
];

/** Konami code, console art, and the Matrix rain overlay. */
export default function EasterEggs() {
  const { matrix, setMatrix, openZone } = useStore();
  const seq = useRef([]);

  // console greeting
  useEffect(() => {
    const s1 = "color:#00e5ff;font:600 18px monospace";
    const s2 = "color:#a0a0a0;font:13px monospace";
    console.log("%c> Hey, curious engineer 👋", s1);
    console.log(`%cYou opened the console. Respect. Type %csudo hire ${profile.handle.split(".")[0]}%c in the on-screen terminal.`, s2, "color:#00ff9c", s2);
    console.log("%c> This whole workspace is React + Three.js. Poke around.", s2);
  }, []);

  // konami
  useEffect(() => {
    const onKey = (e) => {
      seq.current = [...seq.current, e.key].slice(-KONAMI.length);
      if (KONAMI.every((k, i) => seq.current[i]?.toLowerCase() === k.toLowerCase())) {
        setMatrix(true);
        setTimeout(() => setMatrix(false), 6000);
        seq.current = [];
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setMatrix]);

  return (
    <AnimatePresence>
      {matrix && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-[70]"
        >
          <MatrixRain />
          <div className="absolute inset-0 grid place-items-center">
            <div className="font-mono text-lg text-success" style={{ textShadow: "0 0 12px #00ff9c" }}>
              wake up, {profile.handle.split(".")[0]}…
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MatrixRain() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    const cols = Math.floor(canvas.width / 16);
    const drops = Array(cols).fill(1);
    const chars = "アイウエオカキ01<>{}[]#$/\\|=+*".split("");
    const draw = () => {
      ctx.fillStyle = "rgba(5,5,5,0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff9c";
      ctx.font = "15px monospace";
      drops.forEach((y, i) => {
        const c = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(c, i * 16, y * 16);
        if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="h-full w-full" style={{ background: "rgba(5,5,5,0.85)" }} />;
}
