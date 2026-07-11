/**
 * ============================================================
 *  ENGINEERING JOURNEY — a cinematic flight through the solar
 *  system, 2023 → 2027 and beyond. Each stop is a career milestone.
 *  Bodies are laid along a path down -Z; the camera flies past them.
 * ============================================================
 */

export const STOPS = [
  {
    id: "earth", year: "2023", name: "Earth", theme: "The Beginning",
    accent: "#5fb0ff", kind: "earth", pos: [0, 0, 0], radius: 6, spin: 0.02,
    cam: { pos: [7, 1.6, 15], look: [0, 0, 0] },
    skills: ["Programming fundamentals", "First DSA problems", "Git basics"],
    projects: ["First GitHub account", "Early practice repos"],
    lesson: "Every expert was once a beginner writing their first line of code.",
    detail: "Started B.Tech CSE at Nirma University. First exposure to Computer Science — small satellites of curiosity launching from home.",
  },
  {
    id: "moon", year: "2023", name: "Moon", theme: "Learning Foundations",
    accent: "#c8ccd4", kind: "moon", pos: [14, -2, -24], radius: 2, spin: 0.015,
    cam: { pos: [19, 0, -18], look: [14, -2, -24] },
    skills: ["C++", "Java", "Data Structures", "OOP", "Operating Systems"],
    projects: ["DSA practice", "Course projects"],
    lesson: "Fundamentals are the low-gravity ground you push off from.",
    detail: "A brief landing to build core CS foundations before taking off again.",
  },
  {
    id: "iss", year: "2023", name: "ISS", theme: "Collaboration",
    accent: "#8b7bff", kind: "station", pos: [-6, 3, -46], radius: 2.4, spin: 0.05,
    cam: { pos: [-1, 4.5, -37], look: [-6, 3, -46] },
    skills: ["Git", "GitHub", "Version control", "Team workflows"],
    projects: ["First team projects"],
    lesson: "Software is a team sport — you dock, you sync, you ship together.",
    detail: "Docked at the station of collaboration. Windows reveal the first shared engineering work.",
  },
  {
    id: "mars", year: "2024", name: "Mars", theme: "Building Real Products",
    accent: "#d9603b", kind: "mars", pos: [10, -3, -72], radius: 3.6, spin: 0.02,
    cam: { pos: [16, -1, -63], look: [10, -3, -72] },
    skills: ["React", "Node.js", "Express", "MongoDB", "REST APIs", "JWT"],
    projects: ["InnoMate", "Full-stack MERN builds"],
    lesson: "Real products are colonies — you don't just visit, you build to stay.",
    detail: "Descended toward the Martian surface. Engineering colonies mark full-stack skills taking root.",
  },
  {
    id: "jupiter", year: "2025", name: "Jupiter", theme: "Engineering at Scale",
    accent: "#d8a06a", kind: "gas", palette: ["#6b4a2a", "#c9a06a", "#e6c79a", "#8a5a3a"], pos: [-14, 4, -108], radius: 10, spin: 0.03, rings: false,
    cam: { pos: [-4, 6, -95], look: [-14, 4, -108] },
    skills: ["FastAPI", "Scalable APIs", "Authentication", "WebSockets", "Real-time systems"],
    projects: ["FinAgent (backend core)"],
    lesson: "Scale is a gas giant — mass you design for, not against.",
    detail: "Cloud-sized infrastructure, banded and immense — engineering that holds under real load.",
  },
  {
    id: "saturn", year: "2026", name: "Saturn", theme: "Innovation",
    accent: "#e8d29a", kind: "gas", palette: ["#b89a6a", "#d8c49a", "#e8dcc0", "#c9b48a"], pos: [12, -5, -150], radius: 8, spin: 0.03, rings: true,
    cam: { pos: [21, -2, -139], look: [12, -5, -150] },
    skills: ["LLMs", "Multi-Agent Systems", "Prompt Engineering", "Gemini 2.0"],
    projects: ["HushrutAI", "DocLing AI (Runner-Up)", "FinAgent (Top 25)"],
    lesson: "Innovation is the rings — order and brilliance emerging from countless small pieces.",
    detail: "Flew between the rings, each band a glowing engineering milestone from a year of hackathons.",
  },
  {
    id: "uranus", year: "2026", name: "Uranus", theme: "Infrastructure",
    accent: "#7fd6e6", kind: "gas", palette: ["#5a8a9a", "#8ac0cc", "#b0e0e6", "#6aa0b0"], pos: [-10, 3, -190], radius: 5, spin: 0.02, rings: false,
    cam: { pos: [-3, 5, -180], look: [-10, 3, -190] },
    skills: ["Docker", "Linux", "CI/CD", "Deployment", "Automation"],
    projects: ["Containerized deployments"],
    lesson: "Good infrastructure is cold and quiet — it just works, out at the edge.",
    detail: "A calm blue world ringed by small orbital stations — the automation that makes deploys boring.",
  },
  {
    id: "neptune", year: "2027", name: "Neptune", theme: "Future Engineering",
    accent: "#4f7ae0", kind: "gas", palette: ["#25408a", "#3a5ac0", "#5a7ae0", "#2a4a9a"], pos: [9, -3, -226], radius: 5, spin: 0.025, rings: false,
    cam: { pos: [16, -1, -216], look: [9, -3, -226] },
    skills: ["Kubernetes", "AWS", "Terraform", "System Design", "Scalable Architecture"],
    projects: ["Learning in progress"],
    lesson: "The frontier isn't a destination — you enter orbit and keep moving.",
    detail: "Storm systems on a deep blue giant. The spacecraft enters orbit but never lands — always forward.",
  },
  {
    id: "deep", year: "2027 →", name: "Deep Space", theme: "The journey has only begun",
    accent: "#8cf8ff", kind: "galaxy", pos: [0, 1, -330], radius: 0, spin: 0,
    cam: { pos: [0, 2, -272], look: [0, 1, -330] },
    skills: [], projects: [], lesson: "",
    detail: "",
  },
];

export const CLOSING = ["Always Learning.", "Always Building.", "Always Exploring."];
