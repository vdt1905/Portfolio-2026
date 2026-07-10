import { useEffect, useRef } from "react";

/**
 * Custom cursor: a precise dot + a lagging ring that grows over
 * interactive elements. Also feeds the CSS mouse-glow variables.
 */
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const pos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const ringPos = useRef({ ...pos.current });

  useEffect(() => {
    // skip on touch devices
    if (window.matchMedia("(hover: none)").matches) return;

    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dot.current) {
        dot.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
      }
      document.documentElement.style.setProperty("--mx", `${e.clientX}px`);
      document.documentElement.style.setProperty("--my", `${e.clientY}px`);

      const el = e.target;
      const interactive =
        el.closest?.("button, a, [data-cursor='hover'], input, textarea, [role='button']");
      ring.current?.classList.toggle("hovering", !!interactive);
    };

    let raf;
    const loop = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.18;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%,-50%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener("pointermove", move);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" />
      <div ref={dot} className="cursor-dot" />
    </>
  );
}
