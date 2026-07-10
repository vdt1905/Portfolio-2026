/**
 * ============================================================
 *  PORTFOLIO CONTENT  —  single source of truth
 * ------------------------------------------------------------
 *  Everything the site displays lives here.
 *  Populated with Vansh Tandel's real details.
 *  ✏️ = double-check / update (e.g. LeetCode handle, repo links).
 * ============================================================
 */

export const profile = {
  name: "Vansh Tandel",
  handle: "vansh.dev",
  role: "Software Development Engineer",
  subRole: "DevOps & Full Stack",
  tagline: "I don't just build software. I build products.",
  location: "Ahmedabad, India",
  email: "tandelvansh0511@gmail.com",
  phone: "+91 8140531884",
  availability: "Open to SDE / DevOps internships & roles",
  education: {
    degree: "B.Tech, Computer Science & Engineering",
    school: "Nirma University",
    year: "2023 – 2027",
    cgpa: "8.35",
  },
  mission:
    "To build resilient, human-centered systems where great engineering is invisible — it just works.",
};

export const socials = {
  github: "https://github.com/vdt1905", // ✏️ confirm handle
  linkedin: "https://www.linkedin.com/in/vansh-tandel-78710928a/", // ✏️ confirm handle
  leetcode: "https://leetcode.com/u/vansh2119", // ✏️ confirm / update
  resume: "/resume.pdf", // ✏️ drop your PDF in /public as resume.pdf
  calendar: "https://cal.com/", // ✏️ optional booking link
};

/* Core operating principles shown in the About zone */
export const principles = [
  { title: "Build Products", desc: "Ship things people actually use, not demos." },
  { title: "Automate Everything", desc: "If I do it twice, a pipeline does it next." },
  { title: "Learn Continuously", desc: "Every project ends knowing more than it began." },
  { title: "Think in Systems", desc: "Trace the data, the failure modes, the blast radius." },
  { title: "Solve Real Problems", desc: "Impact over novelty. Outcomes over output." },
];

/* Animated journey timeline */
export const timeline = [
  { year: "2023", title: "Nirma University", desc: "Began B.Tech CSE. First lines of code, first all-nighters." },
  { year: "2024", title: "Full Stack", desc: "Went deep on the MERN stack — end-to-end ownership." },
  { year: "2025", title: "Hackathons + AI", desc: "3rd at HackNUthon 6.0. Started building agentic AI systems." },
  { year: "2026", title: "Multi-Agent AI", desc: "DocLing & FinAgent — LLM pipelines, Runner-Up & Top-25 finishes." },
  { year: "2027", title: "Graduation → SDE", desc: "Graduating May 2027, shipping production software." },
  { year: "Next", title: "Future Goals", desc: "Scale systems for millions. Mentor. Build a company." },
];

/* ---------------- PROJECT MUSEUM ---------------- */
export const projects = [
  {
    id: "shushrutai",
    name: "ShushrutAI",
    tag: "Agentic Healthcare AI",
    accent: "#00e5ff",
    summary:
      "An AI-native dermatology platform: a multi-agent pipeline that analyzes skin lesions and automates clinical reporting for practitioners.",
    architecture: ["Patient", "Multi-Agent Pipeline", "Gemini 2.0", "Lesion Analysis", "Practitioner Dashboard", "Clinical Report"],
    tech: ["React", "Express", "FastAPI", "Gemini 2.0", "Firebase", "Python"],
    features: [
      "Multi-agent AI pipeline on Gemini 2.0 for skin-lesion analysis",
      "Automated clinical report generation",
      "Secure practitioner dashboard with real-time diagnosis previews",
      "Context-aware medical chatbot surfacing insights from past cases",
    ],
    challenges:
      "Keeping LLM output clinically safe and structured. Solved with role-scoped agents and practitioner-in-the-loop review before any report is finalized.",
    scalability:
      "Stateless agents behind FastAPI; Firebase for real-time sync; analysis jobs decoupled so each agent role can scale independently.",
    future: ["EHR integration", "On-device privacy mode", "Expanded lesion taxonomy"],
    metrics: [
      { label: "AI agents", value: "Multi" },
      { label: "Model", value: "Gemini 2.0" },
      { label: "HackNUthon", value: "3rd" },
    ],
    links: { github: "https://github.com/vanshtandel", demo: "" }, // ✏️ repo/demo
  },
  {
    id: "docling",
    name: "DocLing AI",
    tag: "Document Intelligence",
    accent: "#6c63ff",
    summary:
      "A multi-agent system that converts raw DOCX manuscripts into publication-ready papers across APA, IEEE, Vancouver, MLA, and Chicago — with automatic LaTeX generation.",
    architecture: ["DOCX", "OpenXML Parse", "Structure Detection", "Citation Normalize", "Format Rules", "LaTeX Paper"],
    tech: ["Python", "LLMs", "NLP", "LaTeX", "MERN", "Regex"],
    features: [
      "6-agent pipeline: parse → detect → normalize → transform → validate → render",
      "Hybrid heuristic + LLM structure detection over OpenXML",
      "Citation normalization across 5 academic formats",
      "Rule-based formatting with automatic LaTeX output",
    ],
    challenges:
      "Real manuscripts are messy and inconsistent. Solved with a hybrid heuristic + LLM detector and a rule engine that validates compliance per format category.",
    scalability:
      "Each agent is an isolated stage in the pipeline, so formats and rules can be added without touching the others; parsing runs async per document.",
    future: ["More citation styles", "Web upload UI", "Batch processing"],
    metrics: [
      { label: "Agents", value: "6" },
      { label: "Formats", value: "5" },
      { label: "Hackamined", value: "Runner-Up" },
    ],
    links: { github: "https://github.com/vanshtandel", demo: "" }, // ✏️ repo/demo
  },
  {
    id: "finagent",
    name: "FinAgent",
    tag: "Autonomous Finance",
    accent: "#00ff9c",
    summary:
      "An agentic AI platform that automates financial workflows — payments, transfers, investments — with LLM intent detection and human-in-the-loop security.",
    architecture: ["User Intent", "LLM Detection", "Decision Orchestration", "Human-in-Loop", "WebSocket Txn", "Live Update"],
    tech: ["FastAPI", "MERN", "LLMs", "WebSockets", "MongoDB"],
    features: [
      "Agentic automation of payments, transfers, and investment ops",
      "LLM-based intent detection + decision orchestration",
      "Human-in-the-loop security controls on sensitive actions",
      "Real-time transaction handling over WebSockets",
    ],
    challenges:
      "Autonomy vs. safety in a financial context. Solved with confirmation gates on high-risk actions and a human-in-the-loop checkpoint before execution.",
    scalability:
      "Event-driven core with FastAPI + MongoDB; WebSocket layer for instant updates; agents orchestrated so new workflows plug in cleanly.",
    future: ["Broker integrations", "Portfolio simulation", "Audit trail dashboard"],
    metrics: [
      { label: "Realtime", value: "WebSocket" },
      { label: "Backend", value: "FastAPI" },
      { label: "IIT-B TechFest", value: "Top 25" },
    ],
    links: { github: "https://github.com/vanshtandel", demo: "" }, // ✏️ repo/demo
  },
  {
    id: "innomate",
    name: "InnoMate",
    tag: "Team + Idea Platform",
    accent: "#00e5ff",
    summary:
      "A collaboration platform for idea sharing, team formation, and project building — with secure auth, role-based access, and personalized feeds.",
    architecture: ["Profile", "Idea Board", "Team Formation", "Collaboration", "Showcase"],
    tech: ["MERN", "JWT", "MongoDB", "REST API", "Zustand"],
    features: [
      "Idea sharing, team formation, and project collaboration",
      "JWT authentication with role-based access control",
      "Personalized feeds per user",
      "Scalable REST APIs with modular Zustand state management",
    ],
    challenges:
      "Keeping the frontend modular as features grew. Solved with a clean REST API contract and Zustand slices instead of prop-drilling.",
    scalability:
      "Stateless REST services over MongoDB; role-based access keeps authorization centralized; feed generation isolated for future caching.",
    future: ["Mentor matching", "Recruiter view", "GitHub integration"],
    metrics: [
      { label: "Auth", value: "JWT" },
      { label: "Stack", value: "MERN" },
      { label: "State", value: "Zustand" },
    ],
    links: { github: "https://github.com/vanshtandel", demo: "" }, // ✏️ repo/demo
  },
];

/* ---------------- DEVOPS LAB ---------------- */
export const pipeline = [
  { stage: "Developer", detail: "Commit + push", icon: "code" },
  { stage: "GitHub", detail: "PR + review", icon: "git" },
  { stage: "CI/CD", detail: "Build + lint + test", icon: "workflow" },
  { stage: "Docker", detail: "Containerize", icon: "box" },
  { stage: "Testing", detail: "Unit + integration", icon: "flask" },
  { stage: "Deployment", detail: "Ship the image", icon: "rocket" },
  { stage: "Production", detail: "Monitor + iterate", icon: "activity" },
];

/* Honest to the résumé — tools actually used. */
export const devopsStack = [
  "Docker", "Linux", "Git", "GitHub", "Bash / Shell",
  "AWS", "CI/CD", "Postman", "MongoDB", "REST APIs",
];

/* ---------------- SKILL LAB ---------------- */
export const skills = [
  {
    name: "React",
    kind: "Frontend",
    color: "#00e5ff",
    blurb: "Component trees, hooks, and buttery UIs. My default canvas.",
    concepts: ["Hooks", "State mgmt", "Zustand", "Responsive UI"],
    projects: ["ShushrutAI", "InnoMate"],
  },
  {
    name: "Node.js",
    kind: "Backend",
    color: "#00ff9c",
    blurb: "Express APIs, real-time services, and the glue between systems.",
    concepts: ["Express", "REST", "Socket.IO", "JWT Auth"],
    projects: ["FinAgent", "InnoMate"],
  },
  {
    name: "Python",
    kind: "AI / ML",
    color: "#6c63ff",
    blurb: "Where the agents and models live. FastAPI + LLM pipelines.",
    concepts: ["FastAPI", "LLMs", "NLP", "Multi-agent"],
    projects: ["ShushrutAI", "DocLing AI", "FinAgent"],
  },
  {
    name: "MongoDB",
    kind: "Database",
    color: "#00ff9c",
    blurb: "Flexible document core for fast-moving product schemas.",
    concepts: ["Schemas", "Aggregation", "Indexing"],
    projects: ["FinAgent", "InnoMate"],
  },
  {
    name: "Docker",
    kind: "DevOps",
    color: "#00e5ff",
    blurb: "Reproducible everywhere. 'Works on my machine' — deleted.",
    concepts: ["Images", "Compose", "Containers"],
    projects: ["ShushrutAI", "FinAgent"],
  },
  {
    name: "C++",
    kind: "DSA / Systems",
    color: "#6c63ff",
    blurb: "Where I sharpen data structures, algorithms, and problem solving.",
    concepts: ["DSA", "OOP", "STL", "Complexity"],
    projects: ["Competitive Programming"],
  },
  {
    name: "Git",
    kind: "Workflow",
    color: "#00e5ff",
    blurb: "Branch, review, ship. History as a first-class artifact.",
    concepts: ["Branching", "PRs", "GitHub", "Reviews"],
    projects: ["All of them"],
  },
  {
    name: "Linux",
    kind: "Systems",
    color: "#00ff9c",
    blurb: "The terminal is home. Where automation actually runs.",
    concepts: ["Shell", "Scripting", "Networking", "Perf"],
    projects: ["DevOps Lab"],
  },
];

/* ---------------- ACHIEVEMENTS ---------------- */
export const achievements = [
  { title: "HackNUthon 6.0", org: "Nirma University · Reve Soils Track · 3rd Place", year: "Mar 2025", kind: "trophy" },
  { title: "Hackamined 2026", org: "Paperpal Track · Runner-Up (DocLing AI)", year: "2026", kind: "trophy" },
  { title: "IIT Bombay TechFest", org: "Financial Agent Hackathon · Top 25 nationwide", year: "Dec 2025", kind: "star" },
  { title: "INSTINCT Hackathon", org: "Top 5 · AI predictive maintenance for smart meters", year: "Mar 2026", kind: "star" },
];

/* Certifications shown alongside achievements */
export const certifications = [
  "Full-Stack Web Dev — Angela Yu (Udemy)",
  "Python Bootcamp — Angela Yu (Udemy)",
  "Deep Learning & NLP — Krish Naik (in progress)",
  "AWS Certified Cloud Practitioner (in progress)",
  "Cybersecurity & Ethical Hacking — Rinex / Skill India",
];

export const stats = [
  { label: "Projects shipped", value: 5, suffix: "+" },
  { label: "Hackathon finishes", value: 4, suffix: "" },
  { label: "Current CGPA", value: 8.3, suffix: "", decimals: 1 },
  { label: "Certifications", value: 5, suffix: "" },
];

/* ---------------- BOOT SEQUENCE LINES ---------------- */
export const bootLines = [
  "Initializing System...",
  "Loading Engineering Workspace...",
  "Loading AI Modules...",
  "Loading Infrastructure...",
  "Loading Projects...",
  "Calibrating neon lighting...",
  "Loading Complete.",
];
