/**
 * ============================================================
 *  ENGINEERING SOLAR SYSTEM
 * ------------------------------------------------------------
 *  Each body is an engineering domain rendered as a themed world.
 *  Ordered inner → outer by orbit radius. Content is grounded in
 *  real projects; edit freely.
 * ============================================================
 */

export const STAR = {
  name: "Engineering Core",
  tagline: "Curiosity, compounding.",
  blurb: "The star at the center is me — an artificial energy core that keeps learning, building, and shipping. Every world here orbits that drive.",
};

export const PLANETS = [
  {
    id: "cpp", name: "C++", theme: "Systems Engineering World",
    tagline: "Precision machinery. Nothing wasted.",
    style: "mechanical", accent: "#9fb0c8", c1: "#2a2f3a", c2: "#12151c", night: "#c9d4e6",
    size: 1.5, orbit: 9, orbitSpeed: 0.05, spin: 0.06, tilt: 0.2, y: 0.4,
    status: "production",
    blurb: "A clockwork planet of memory cores and low-level circuitry — where data structures and algorithms are forged in C++.",
    concepts: ["DSA", "OOP", "Memory model", "STL", "Complexity"],
    projects: ["Competitive Programming"],
  },
  {
    id: "js", name: "JavaScript", theme: "Dynamic Runtime World",
    tagline: "Always in motion. Never blocking.",
    style: "circuit", accent: "#ffd166", c1: "#2b2410", c2: "#0f0c05", night: "#ffe08a",
    size: 1.8, orbit: 13, orbitSpeed: 0.04, spin: 0.08, tilt: 0.35, y: -0.6,
    status: "production",
    blurb: "An electric storm-world where functions crackle as circuits and the event loop turns as a great energy ring.",
    concepts: ["Closures", "Async / await", "Event loop", "ES6+", "DOM"],
    projects: ["Every project"],
  },
  {
    id: "react", name: "React", theme: "Modern Interface Civilization",
    tagline: "Composed, reactive, elegant.",
    style: "gridCity", accent: "#00e5ff", c1: "#08222b", c2: "#030d12", night: "#5ff3ff",
    size: 2.0, orbit: 17, orbitSpeed: 0.032, spin: 0.05, tilt: 0.15, y: 0.5, rings: false, sats: 2,
    status: "production",
    blurb: "A luminous smart-city of glass towers and floating panels that assemble themselves — components snapping into place, state flowing along glowing lines.",
    concepts: ["Components", "Hooks", "State (Zustand)", "R3F", "Perf"],
    projects: ["ShushrutAI", "InnoMate", "This portfolio"],
  },
  {
    id: "node", name: "Node.js", theme: "Backend Infrastructure World",
    tagline: "Reliable at scale.",
    style: "industrial", accent: "#00ffb2", c1: "#0a2620", c2: "#03110d", night: "#4dffcf",
    size: 2.1, orbit: 21, orbitSpeed: 0.026, spin: 0.045, tilt: 0.1, y: -0.4, sats: 2,
    status: "production",
    blurb: "An industrial megacity of server towers and data highways — packets stream between API gateways along pulsing communication lines.",
    concepts: ["Express", "REST", "WebSockets", "JWT", "Middleware"],
    projects: ["FinAgent", "InnoMate"],
  },
  {
    id: "python", name: "Python & AI", theme: "Intelligence Research World",
    tagline: "Agents that reason.",
    style: "neural", accent: "#8b6cff", c1: "#160f34", c2: "#070518", night: "#b9a6ff",
    size: 2.6, orbit: 26, orbitSpeed: 0.02, spin: 0.04, tilt: 0.25, y: 0.6, rings: true, sats: 3,
    status: "production",
    blurb: "A glowing neural forest where knowledge flows between crystal structures — AI cores, research labs, and multi-agent pathways lighting up in thought.",
    concepts: ["LLMs", "Gemini 2.0", "Multi-Agent", "Prompt Eng.", "NLP", "FastAPI"],
    projects: ["ShushrutAI", "FinAgent", "DocLing AI"],
  },
  {
    id: "mongo", name: "MongoDB", theme: "Living Data Planet",
    tagline: "Documents, flowing.",
    style: "crystal", accent: "#4bd66f", c1: "#0a2417", c2: "#04120a", night: "#7bf29a",
    size: 2.0, orbit: 31, orbitSpeed: 0.017, spin: 0.05, tilt: 0.18, y: -0.5, sats: 2,
    status: "production",
    blurb: "Massive crystal databases float above rivers of light — aggregation pipelines, index towers, and replica sets linked by orbital satellites.",
    concepts: ["Documents", "Aggregation", "Indexing", "Schemas", "Replica sets"],
    projects: ["FinAgent", "InnoMate"],
  },
  {
    id: "sql", name: "SQL", theme: "Relational World",
    tagline: "Structure and symmetry.",
    style: "geometric", accent: "#4f8cff", c1: "#0c1e3a", c2: "#040c1c", night: "#8fb6ff",
    size: 1.8, orbit: 35, orbitSpeed: 0.015, spin: 0.04, tilt: 0.12, y: 0.4,
    status: "production",
    blurb: "A perfectly geometric city of relational bridges and query streams — every table connected in flawless symmetry.",
    concepts: ["Joins", "Indexes", "Normalization", "Transactions", "Optimization"],
    projects: ["Coursework · DBMS"],
  },
  {
    id: "linux", name: "Linux", theme: "Engineering Command World",
    tagline: "Where automation runs.",
    style: "terminal", accent: "#39d353", c1: "#0a1410", c2: "#030805", night: "#5bf27a",
    size: 1.9, orbit: 39, orbitSpeed: 0.013, spin: 0.035, tilt: 0.08, y: -0.4,
    status: "production",
    blurb: "A dark metallic landscape of terminal towers and fiber-optic grids, lit only by green command-line holograms.",
    concepts: ["Shell", "Permissions", "Filesystem", "Processes", "Automation"],
    projects: ["DevOps Lab"],
  },
  {
    id: "devops", name: "DevOps Station", theme: "Deployment Orbit",
    tagline: "Ship it, reproducibly.",
    style: "station", accent: "#2b9fe0", c1: "#0b1f2e", c2: "#040c14", night: "#7fd0ff",
    size: 1.7, orbit: 44, orbitSpeed: 0.011, spin: 0.03, tilt: 0.15, y: 0.5,
    status: "production", moon: "docker",
    blurb: "An orbital station where the Docker moon endlessly loads and unloads containers — the last stop from commit to production.",
    concepts: ["CI/CD", "Reproducible builds", "Rollouts", "Monitoring"],
    projects: ["ShushrutAI", "FinAgent"],
  },
];

/** Docker — a moon orbiting the DevOps station. */
export const DOCKER = {
  id: "docker", name: "Docker", theme: "Container Moon",
  tagline: "Works everywhere.",
  accent: "#2496ed", c1: "#0a2540", c2: "#05121f", night: "#63b3ff",
  size: 0.7, orbit: 3.4, orbitSpeed: 0.4, spin: 0.1, parent: "devops",
  status: "production",
  blurb: "A moon of gigantic shipping containers and docking cranes — everything continuously loading, unloading, and launching to orbit.",
  concepts: ["Images", "Containers", "Volumes", "Compose", "Networking"],
  projects: ["ShushrutAI", "FinAgent"],
};

/** Git — an asteroid belt of commits at the outer edge. */
export const GIT_BELT = {
  id: "git", name: "Git", theme: "Commit Belt",
  tagline: "History as an artifact.",
  accent: "#f0883e", radius: 52, count: 320,
  status: "production",
  blurb: "An asteroid belt where every rock is a commit. Branches split, merges bridge them, and a fresh commit occasionally flares to life.",
  concepts: ["Branching", "Merges", "Pull requests", "Trunk-based", "Reviews"],
  projects: ["Every repo"],
};

export const STATUS_COLOR = { production: "#00ffb2", learning: "#00e5ff", planned: "#6c63ff" };
