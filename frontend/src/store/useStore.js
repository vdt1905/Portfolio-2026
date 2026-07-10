import { create } from "zustand";

/**
 * Global experience state.
 * - booted: has the boot sequence finished (Zone 1 -> Zone 2)
 * - activeZone: which content overlay is open (null = free-roam workspace)
 * - hovered: which 3D hotspot is under the cursor (drives HUD + cursor)
 * - theme / muted / reducedMotion / lowPower: user + device preferences
 */
export const useStore = create((set, get) => ({
  booted: false,
  setBooted: (v) => set({ booted: v }),

  entering: false, // camera fly-in in progress
  setEntering: (v) => set({ entering: v }),

  activeZone: null,
  openZone: (zone) => set({ activeZone: zone }),
  closeZone: () => set({ activeZone: null }),

  // Immersive project case-study takeover (Engineering Showcase)
  activeProject: null,
  openProject: (id) => set({ activeProject: id, activeZone: null }),
  closeProject: () => set({ activeProject: null }),

  hovered: null,
  setHovered: (h) => set({ hovered: h }),

  theme: "dark",
  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    set({ theme: next });
  },
  setTheme: (t) => {
    document.documentElement.setAttribute("data-theme", t);
    set({ theme: t });
  },

  muted: true,
  toggleMuted: () => set((s) => ({ muted: !s.muted })),

  matrix: false, // easter egg
  setMatrix: (v) => set({ matrix: v }),

  // Persistent terminal session (survives closing/reopening the zone)
  term: { booted: false, lines: [], history: [] },
  setTerm: (patch) => set((s) => ({ term: { ...s.term, ...patch } })),

  reducedMotion:
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,

  lowPower:
    typeof navigator !== "undefined" &&
    (navigator.hardwareConcurrency ?? 8) <= 4,

  // Adaptive render quality — High / Medium / Low
  quality:
    typeof navigator !== "undefined" && (navigator.hardwareConcurrency ?? 8) <= 4
      ? "low"
      : "high",
  cycleQuality: () =>
    set((s) => ({ quality: s.quality === "high" ? "medium" : s.quality === "medium" ? "low" : "high" })),
  setQuality: (q) => set({ quality: q }),
}));

/** Per-quality tuning shared by the space/effects systems. */
export const QUALITY = {
  high: { stars: 6000, galaxy: 3500, satellites: 12, nebula: 4, dust: 260, dpr: 1.8, effects: true, dof: true },
  medium: { stars: 3200, galaxy: 1800, satellites: 6, nebula: 3, dust: 140, dpr: 1.4, effects: true, dof: false },
  low: { stars: 1200, galaxy: 700, satellites: 0, nebula: 2, dust: 60, dpr: 1, effects: false, dof: false },
};
