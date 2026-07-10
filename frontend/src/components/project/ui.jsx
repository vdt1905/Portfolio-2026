import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/** Animated count-up (supports decimals + suffix), triggers when in view. */
export function Counter({ to, suffix = "", decimals = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const dur = 1100;
    const t0 = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  const display = decimals ? n.toFixed(decimals) : Math.round(n).toLocaleString();
  return <span ref={ref}>{display}{suffix}</span>;
}

/** Section header used at the top of every showcase section. */
export function SectionHeader({ index, kicker, title, sub }) {
  return (
    <div className="mb-7">
      <div className="mb-2 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-cyan">
        <span className="tabular-nums opacity-60">{String(index).padStart(2, "0")}</span>
        <span className="h-px w-8 bg-cyan/40" />
        {kicker}
      </div>
      <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      {sub && <p className="mt-2 max-w-2xl text-muted">{sub}</p>}
    </div>
  );
}
