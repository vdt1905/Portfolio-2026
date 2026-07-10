/**
 * ============================================================
 *  CASE STUDIES — deep per-project content for the immersive
 *  Engineering Showcase. Keyed by the project `id` in portfolio.js.
 * ------------------------------------------------------------
 *  Every section here is data-driven, so you can extend a
 *  project's story without touching component code.
 *  Numbers in `perf` are illustrative — swap for real telemetry.
 * ============================================================
 */

export const caseStudies = {
  /* ==================================================================== */
  shushrutai: {
    status: "Live · Hackathon Build",
    role: "Full-Stack + AI Engineer",
    timeline: "Feb – Mar 2025",
    mission: "Turn a lesion photo and a few symptoms into a doctor-ready dermatology report.",

    architecture: {
      layers: ["Client", "AI Core", "Data", "Delivery"],
      nodes: [
        { id: "intake", label: "Patient Intake", layer: "Client", tech: "React",
          desc: "Web form + image upload. Symptoms and the lesion photo are captured and validated client-side before anything hits the API." },
        { id: "orch", label: "Agent Orchestrator", layer: "AI Core", tech: "FastAPI",
          desc: "Routes each case through specialized agents — triage, vision, and report — and enforces a strict output schema at every hop." },
        { id: "vision", label: "Gemini 2.0 Vision", layer: "AI Core", tech: "Gemini",
          desc: "Multimodal analysis of the lesion image, grounded in the patient's symptom context to reduce spurious findings." },
        { id: "engine", label: "Analysis Engine", layer: "AI Core", tech: "Python",
          desc: "Aggregates agent outputs into a single schema-validated result with a confidence score per finding." },
        { id: "dash", label: "Practitioner Dashboard", layer: "Delivery", tech: "Firebase",
          desc: "Real-time review queue. A doctor confirms or edits every case before it is ever finalized — human-in-the-loop by design." },
        { id: "report", label: "Clinical Report", layer: "Delivery", tech: "Python",
          desc: "Generates a formatted, shareable report with findings, confidence, and the reasoning trail." },
      ],
      edges: [["intake", "orch"], ["orch", "vision"], ["vision", "engine"], ["engine", "dash"], ["dash", "report"]],
    },

    decisions: [
      { tech: "Gemini 2.0 (multimodal)",
        why: "One model reasons over image + text together, so we skipped a separate CV pipeline and shipped in a hackathon window.",
        tradeoff: "Vendor lock-in and per-call cost at scale.",
        alt: "Self-hosted vision model + separate LLM — more control, far more infra to stand up." },
      { tech: "FastAPI",
        why: "Async, typed, and purpose-built for AI backends; Pydantic gave us the output schema enforcement for free.",
        tradeoff: "Younger ecosystem than Flask/Django.",
        alt: "Flask (simpler, synchronous) or a Node backend to unify the stack — weaker ML tooling." },
      { tech: "Multi-agent design",
        why: "Splitting triage / vision / report made each stage independently testable and swappable.",
        tradeoff: "Orchestration complexity and added latency.",
        alt: "A single monolithic prompt — simpler, but far less reliable and impossible to debug." },
    ],

    journey: [
      { phase: "Research", detail: "Studied how clinicians actually triage skin lesions and where an assistant could safely help vs. where it must defer." },
      { phase: "Design", detail: "Mapped the agent graph and locked the report schema first — the contract everything else had to satisfy." },
      { phase: "Development", detail: "Built the FastAPI orchestrator, wired Gemini vision, and shipped the React intake + Firebase dashboard in parallel." },
      { phase: "Testing", detail: "Adversarial prompts and edge-case images to probe unsafe or empty outputs; tightened the schema until they failed closed." },
      { phase: "Deployment", detail: "Containerized the API and deployed the dashboard on Firebase Hosting for the demo." },
      { phase: "Reflection", detail: "The human-in-the-loop gate was the feature, not a fallback — safety is a product decision, not an afterthought." },
    ],

    challenges: [
      { problem: "The model occasionally produced confident but unsafe medical text.",
        cause: "Open-ended generation with no structural constraints on the output.",
        solution: "Schema-constrained responses via Pydantic + a mandatory practitioner review gate before any report is finalized.",
        lesson: "Constrain the model and keep a human on high-stakes output — reliability comes from the system, not the prompt." },
      { problem: "Multi-agent calls made a single case feel slow.",
        cause: "Agents ran strictly sequentially, even when independent.",
        solution: "Parallelized independent agents and cached image embeddings between stages.",
        lesson: "Profile the critical path before optimizing — the fix was in the orchestration, not the model." },
    ],

    perf: {
      counters: [
        { label: "P95 API latency", value: 1.4, suffix: "s", decimals: 1 },
        { label: "Agents", value: 4, suffix: "" },
        { label: "Commits", value: 180, suffix: "+" },
        { label: "Modules", value: 38, suffix: "" },
      ],
      commits: [4, 9, 6, 12, 8, 15, 11, 18, 7, 14, 10, 16],
      languages: [
        { name: "Python", pct: 46, color: "#6c63ff" },
        { name: "JavaScript", pct: 38, color: "#00e5ff" },
        { name: "CSS", pct: 16, color: "#00ff9c" },
      ],
    },

    code: {
      tree: [
        { name: "server", type: "folder", children: [
          { name: "orchestrator.py", type: "file", snippet: "orch" },
          { name: "agents", type: "folder", children: [
            { name: "vision_agent.py", type: "file" },
            { name: "report_agent.py", type: "file" },
          ]},
          { name: "schema.py", type: "file" },
        ]},
        { name: "client", type: "folder", children: [
          { name: "useIntake.js", type: "file", snippet: "intake" },
          { name: "Dashboard.jsx", type: "file" },
        ]},
      ],
      snippets: [
        { id: "orch", file: "server/orchestrator.py", lang: "python",
          note: "The orchestrator runs independent agents concurrently, then validates the merged result against a strict schema — nothing leaves unvalidated.",
          code: `async def analyze(case: Case) -> Report:
    # independent agents run concurrently
    triage, vision = await asyncio.gather(
        triage_agent.run(case.symptoms),
        vision_agent.run(case.image),
    )
    merged = engine.merge(triage, vision)
    # fails closed if the model drifts from the contract
    return Report.model_validate(merged)` },
        { id: "intake", file: "client/useIntake.js", lang: "jsx",
          note: "Client-side validation keeps malformed cases out of the pipeline and gives instant feedback before any network call.",
          code: `export function useIntake() {
  const [errors, setErrors] = useState({});

  const submit = async (form) => {
    const problems = validate(form);      // no image? no symptoms?
    if (Object.keys(problems).length) return setErrors(problems);
    return api.post("/analyze", toPayload(form));
  };

  return { submit, errors };
}` },
      ],
    },

    demo: {
      title: "Run a diagnosis",
      steps: [
        { label: "Upload lesion image", detail: "Validated client-side · 2.1 MB · JPEG" },
        { label: "Triage agent", detail: "Parsing symptoms → risk band: MODERATE" },
        { label: "Gemini vision", detail: "Analyzing image grounded in symptom context…" },
        { label: "Assemble report", detail: "Merged findings · schema OK · confidence 0.86" },
        { label: "Practitioner review", detail: "Queued for doctor sign-off ✓" },
      ],
    },

    roadmap: [
      { title: "EHR Integration", detail: "Push signed reports straight into hospital record systems.", tag: "Product" },
      { title: "On-prem model option", detail: "Self-hosted vision model for privacy-sensitive deployments.", tag: "AI" },
      { title: "CI/CD", detail: "GitHub Actions: lint, test, build, and deploy on every merge.", tag: "DevOps" },
      { title: "Containerize + orchestrate", detail: "Docker images per agent, scaled behind a queue.", tag: "DevOps" },
      { title: "Monitoring", detail: "Latency + confidence dashboards to catch model drift early.", tag: "Observability" },
    ],

    resources: [
      { label: "GitHub", kind: "github", key: "github" },
      { label: "Live Demo", kind: "demo", key: "demo" },
      { label: "Architecture PDF", kind: "pdf", href: "" },
      { label: "Docs", kind: "docs", href: "" },
    ],
  },

  /* ==================================================================== */
  docling: {
    status: "Runner-Up · Hackamined 2026",
    role: "AI / Backend Engineer",
    timeline: "Jan – Feb 2026",
    mission: "Turn a messy DOCX manuscript into a publication-ready paper in any citation style.",

    architecture: {
      layers: ["Ingest", "Understand", "Transform", "Output"],
      nodes: [
        { id: "docx", label: "DOCX Upload", layer: "Ingest", tech: "MERN",
          desc: "Raw academic manuscripts arrive in every possible shape — inconsistent headings, mixed citation styles, stray formatting." },
        { id: "parse", label: "OpenXML Parser", layer: "Ingest", tech: "Python",
          desc: "Extracts the document tree from OpenXML — paragraphs, styles, and runs — into a normalized intermediate form." },
        { id: "detect", label: "Structure Detection", layer: "Understand", tech: "Heuristic + LLM",
          desc: "A hybrid detector labels sections (abstract, methods, references) using heuristics first, LLM only where ambiguous." },
        { id: "cite", label: "Citation Normalizer", layer: "Transform", tech: "Regex + Rules",
          desc: "Parses and re-emits every citation into the target style — APA, IEEE, Vancouver, MLA, or Chicago." },
        { id: "rules", label: "Format Rule Engine", layer: "Transform", tech: "JSON Rules",
          desc: "Applies per-style layout rules and validates compliance category by category." },
        { id: "latex", label: "LaTeX Renderer", layer: "Output", tech: "LaTeX",
          desc: "Emits a clean, compilable LaTeX document ready for submission." },
      ],
      edges: [["docx", "parse"], ["parse", "detect"], ["detect", "cite"], ["cite", "rules"], ["rules", "latex"]],
    },

    decisions: [
      { tech: "Hybrid heuristic + LLM detection",
        why: "Heuristics are free and deterministic for the 80% obvious cases; the LLM only touches genuinely ambiguous structure.",
        tradeoff: "Two code paths to maintain and keep in sync.",
        alt: "Pure-LLM detection — simpler code, but slower, costlier, and non-deterministic." },
      { tech: "6-agent pipeline",
        why: "Each stage owns one responsibility, so a new citation style is a rule change, not a rewrite.",
        tradeoff: "More moving parts and inter-stage contracts.",
        alt: "A single mega-function — fast to prototype, impossible to extend." },
      { tech: "LaTeX output",
        why: "Deterministic, publication-grade typesetting that journals already accept.",
        tradeoff: "Steeper output format than HTML/PDF-direct.",
        alt: "Direct PDF generation — easier, but far less precise for academic layout." },
    ],

    journey: [
      { phase: "Research", detail: "Collected real manuscripts across five citation styles to understand how inconsistent input truly is." },
      { phase: "Design", detail: "Split the problem into six single-responsibility agents with a shared intermediate representation." },
      { phase: "Development", detail: "Built the OpenXML parser and rule engine, then layered LLM detection only where heuristics failed." },
      { phase: "Testing", detail: "Ran compliance validation per formatting category against known-good reference papers." },
      { phase: "Deployment", detail: "Packaged the pipeline behind a MERN interface for upload-to-download in one flow." },
      { phase: "Reflection", detail: "Won Runner-Up because the hybrid approach was both accurate and explainable — judges could see why each choice was made." },
    ],

    challenges: [
      { problem: "Real manuscripts were wildly inconsistent — no two structured the same way.",
        cause: "Authors use styles loosely; headings and citations rarely follow a spec.",
        solution: "A hybrid heuristic + LLM detector with a rule engine that validates compliance category by category.",
        lesson: "Deterministic rules first, LLM only for the ambiguous edges — accuracy and cost both win." },
      { problem: "Citation conversion broke on unusual formats.",
        cause: "Regex alone couldn't capture every citation variant.",
        solution: "Parsed citations into a normalized model, then re-emitted per target style from that single source of truth.",
        lesson: "Normalize to one intermediate representation before transforming — never convert format-to-format directly." },
    ],

    perf: {
      counters: [
        { label: "Agents", value: 6, suffix: "" },
        { label: "Citation styles", value: 5, suffix: "" },
        { label: "Commits", value: 140, suffix: "+" },
        { label: "Rules", value: 60, suffix: "+" },
      ],
      commits: [3, 7, 5, 10, 9, 13, 8, 12, 6, 11, 9, 14],
      languages: [
        { name: "Python", pct: 62, color: "#6c63ff" },
        { name: "JavaScript", pct: 30, color: "#00e5ff" },
        { name: "TeX", pct: 8, color: "#00ff9c" },
      ],
    },

    code: {
      tree: [
        { name: "pipeline", type: "folder", children: [
          { name: "parse_openxml.py", type: "file", snippet: "parse" },
          { name: "detect_structure.py", type: "file", snippet: "detect" },
          { name: "citations.py", type: "file" },
          { name: "render_latex.py", type: "file" },
        ]},
        { name: "rules", type: "folder", children: [
          { name: "apa.json", type: "file" },
          { name: "ieee.json", type: "file" },
        ]},
      ],
      snippets: [
        { id: "detect", file: "pipeline/detect_structure.py", lang: "python",
          note: "Heuristics handle the obvious 80%; the LLM is only invoked for genuinely ambiguous blocks — cheaper and more deterministic.",
          code: `def detect(block: Block) -> Section:
    # cheap, deterministic first pass
    if guess := heuristic_label(block):
        return guess
    # fall back to the model only when unsure
    return llm_classify(block, examples=REFERENCE_SECTIONS)` },
        { id: "parse", file: "pipeline/parse_openxml.py", lang: "python",
          note: "Everything downstream depends on one clean intermediate representation, so parsing is the contract the whole pipeline trusts.",
          code: `def parse(docx_path: str) -> list[Block]:
    doc = OpenXML.load(docx_path)
    return [
        Block(style=p.style, runs=p.runs, text=p.text)
        for p in doc.paragraphs
    ]` },
      ],
    },

    demo: {
      title: "Format a manuscript",
      steps: [
        { label: "Upload manuscript.docx", detail: "Detected: inconsistent headings, mixed citations" },
        { label: "Parse OpenXML", detail: "142 blocks extracted → intermediate form" },
        { label: "Detect structure", detail: "Abstract · Methods · Results · References tagged" },
        { label: "Normalize citations", detail: "Target style: IEEE · 37 references rewritten" },
        { label: "Render LaTeX", detail: "paper.tex generated · compiles clean ✓" },
      ],
    },

    roadmap: [
      { title: "More citation styles", detail: "Add Harvard, ACM, and journal-specific templates.", tag: "Product" },
      { title: "Web upload UI", detail: "Polished drag-and-drop with live preview.", tag: "Frontend" },
      { title: "Batch processing", detail: "Queue-backed workers for whole-issue conversion.", tag: "Scaling" },
      { title: "CI/CD + Docker", detail: "Reproducible builds and one-command deploys.", tag: "DevOps" },
    ],

    resources: [
      { label: "GitHub", kind: "github", key: "github" },
      { label: "Live Demo", kind: "demo", key: "demo" },
      { label: "Architecture PDF", kind: "pdf", href: "" },
    ],
  },

  /* ==================================================================== */
  finagent: {
    status: "Top 25 · IIT-B TechFest",
    role: "Agentic AI Engineer",
    timeline: "Nov – Dec 2025",
    mission: "Let an AI agent run financial workflows safely — with a human on the risky calls.",

    architecture: {
      layers: ["Input", "Reason", "Guard", "Execute"],
      nodes: [
        { id: "intent", label: "User Intent", layer: "Input", tech: "React",
          desc: "Natural-language requests — 'move ₹5k to savings', 'rebalance to 60/40' — enter through a chat-style UI." },
        { id: "detect", label: "Intent Detection", layer: "Reason", tech: "LLM",
          desc: "An LLM classifies the request into a structured action with typed parameters." },
        { id: "orch", label: "Decision Orchestrator", layer: "Reason", tech: "FastAPI",
          desc: "Plans the sequence of operations and decides which need human confirmation." },
        { id: "guard", label: "Human-in-Loop Guard", layer: "Guard", tech: "Policy",
          desc: "High-risk actions (transfers, trades) pause for explicit user approval before anything executes." },
        { id: "txn", label: "Transaction Engine", layer: "Execute", tech: "MongoDB",
          desc: "Executes approved actions atomically and records an auditable trail." },
        { id: "live", label: "Live Updates", layer: "Execute", tech: "WebSockets",
          desc: "Pushes state changes to the client the instant they happen — no polling." },
      ],
      edges: [["intent", "detect"], ["detect", "orch"], ["orch", "guard"], ["guard", "txn"], ["txn", "live"]],
    },

    decisions: [
      { tech: "Human-in-the-loop guard",
        why: "In finance, wrong-and-autonomous is unacceptable. A confirmation gate on risky actions makes autonomy safe.",
        tradeoff: "Adds friction on high-value operations.",
        alt: "Fully autonomous execution — smoother, but a single bad classification could move real money." },
      { tech: "WebSockets",
        why: "Financial state changes must feel instant; clients see balances update the moment they commit.",
        tradeoff: "Stateful connections to manage and scale.",
        alt: "Polling — trivial to build, but laggy and wasteful under load." },
      { tech: "FastAPI + MongoDB",
        why: "Async orchestration with a flexible document model for evolving transaction shapes.",
        tradeoff: "Eventual-consistency care needed around money.",
        alt: "Postgres for stricter transactional guarantees — more rigid schema." },
    ],

    journey: [
      { phase: "Research", detail: "Mapped which financial actions are safe to automate vs. which demand a human checkpoint." },
      { phase: "Design", detail: "Designed an agent loop with an explicit guard stage between reasoning and execution." },
      { phase: "Development", detail: "Built intent detection, the orchestrator, and a WebSocket transaction feed." },
      { phase: "Testing", detail: "Simulated adversarial and ambiguous requests to confirm the guard always caught risky actions." },
      { phase: "Deployment", detail: "Ran the stack behind FastAPI with MongoDB for the TechFest demo." },
      { phase: "Reflection", detail: "Selected in the national Top 25 — the guard stage was what made judges trust it." },
    ],

    challenges: [
      { problem: "Balancing agent autonomy against financial safety.",
        cause: "An LLM misclassification could trigger a real, irreversible transaction.",
        solution: "A policy guard that routes any high-risk action through explicit human confirmation before execution.",
        lesson: "Autonomy is a spectrum — put a human exactly where the cost of being wrong is highest." },
      { problem: "Keeping the UI in perfect sync with fast-changing state.",
        cause: "Request/response polling lagged behind rapid transaction updates.",
        solution: "A WebSocket channel pushing every committed change to the client immediately.",
        lesson: "For live financial data, push beats pull — model the update, not the request." },
    ],

    perf: {
      counters: [
        { label: "Update latency", value: 180, suffix: "ms" },
        { label: "Agents", value: 3, suffix: "" },
        { label: "Commits", value: 120, suffix: "+" },
        { label: "Endpoints", value: 24, suffix: "" },
      ],
      commits: [5, 8, 4, 11, 7, 13, 9, 12, 6, 10, 8, 12],
      languages: [
        { name: "JavaScript", pct: 52, color: "#00e5ff" },
        { name: "Python", pct: 40, color: "#6c63ff" },
        { name: "Other", pct: 8, color: "#00ff9c" },
      ],
    },

    code: {
      tree: [
        { name: "agent", type: "folder", children: [
          { name: "detect_intent.py", type: "file", snippet: "intent" },
          { name: "orchestrator.py", type: "file" },
          { name: "guard.py", type: "file", snippet: "guard" },
        ]},
        { name: "realtime", type: "folder", children: [
          { name: "socket.js", type: "file" },
        ]},
      ],
      snippets: [
        { id: "guard", file: "agent/guard.py", lang: "python",
          note: "The guard is the whole safety story: any action above a risk threshold cannot execute without an explicit human OK.",
          code: `RISKY = {"transfer", "trade", "withdraw"}

async def gate(action: Action) -> Result:
    if action.type in RISKY or action.amount > THRESHOLD:
        await request_confirmation(action)   # blocks on human OK
    return await execute(action)` },
        { id: "intent", file: "agent/detect_intent.py", lang: "python",
          note: "Free-form text becomes a typed, validated action — the boundary where fuzzy language turns into safe structure.",
          code: `def detect_intent(text: str) -> Action:
    raw = llm.classify(text, schema=ACTION_SCHEMA)
    return Action.model_validate(raw)   # typed + validated` },
      ],
    },

    demo: {
      title: "Run a workflow",
      steps: [
        { label: "User request", detail: '"Transfer ₹5,000 to savings"' },
        { label: "Detect intent", detail: "action: transfer · amount: 5000 · risk: HIGH" },
        { label: "Orchestrate", detail: "1 step planned · requires confirmation" },
        { label: "Human guard", detail: "Awaiting approval… ✓ confirmed" },
        { label: "Execute + push", detail: "Committed · balance updated over WebSocket" },
      ],
    },

    roadmap: [
      { title: "Broker integrations", detail: "Connect real brokerage and banking APIs.", tag: "Product" },
      { title: "Portfolio simulation", detail: "Backtest strategies before executing them.", tag: "AI" },
      { title: "Audit dashboard", detail: "Full, queryable trail of every agent decision.", tag: "Observability" },
      { title: "Docker + scaling", detail: "Containerized services scaled behind a queue.", tag: "DevOps" },
    ],

    resources: [
      { label: "GitHub", kind: "github", key: "github" },
      { label: "Live Demo", kind: "demo", key: "demo" },
      { label: "Architecture PDF", kind: "pdf", href: "" },
    ],
  },

  /* ==================================================================== */
  innomate: {
    status: "Shipped",
    role: "Full-Stack Engineer",
    timeline: "2024",
    mission: "Match builders, form teams, and turn ideas into shipped projects.",

    architecture: {
      layers: ["Client", "API", "Data"],
      nodes: [
        { id: "profile", label: "Profile + Auth", layer: "Client", tech: "React",
          desc: "Users sign in and build a skill profile; JWT secures every request from here on." },
        { id: "ideas", label: "Idea Board", layer: "Client", tech: "React",
          desc: "A shared board for posting ideas, voting, and gauging traction before teams form." },
        { id: "api", label: "REST API", layer: "API", tech: "Express",
          desc: "Stateless REST services with role-based access control enforced centrally." },
        { id: "match", label: "Team Formation", layer: "API", tech: "Node.js",
          desc: "Turns profiles and interests into suggested teams around each idea." },
        { id: "feed", label: "Personalized Feed", layer: "API", tech: "Zustand",
          desc: "Client-side state slices keep the feed responsive without prop-drilling." },
        { id: "db", label: "MongoDB", layer: "Data", tech: "MongoDB",
          desc: "Document store for users, ideas, teams, and activity." },
      ],
      edges: [["profile", "api"], ["ideas", "api"], ["api", "match"], ["match", "feed"], ["feed", "db"], ["api", "db"]],
    },

    decisions: [
      { tech: "JWT + role-based access",
        why: "Stateless auth that scales horizontally, with authorization centralized in one middleware.",
        tradeoff: "Token revocation is harder than server sessions.",
        alt: "Server-side sessions — easy revocation, but stateful and harder to scale." },
      { tech: "Zustand",
        why: "Minimal, hook-based state with slices — no boilerplate, no prop-drilling as features grew.",
        tradeoff: "Less structure/tooling than Redux on very large apps.",
        alt: "Redux Toolkit — more conventions, more ceremony for this size." },
      { tech: "MongoDB",
        why: "Flexible documents matched fast-moving product schemas during rapid iteration.",
        tradeoff: "Weaker relational guarantees across entities.",
        alt: "Postgres — stronger relations, more upfront schema design." },
    ],

    journey: [
      { phase: "Research", detail: "Talked to hackathon teams about why good ideas stall before they ever ship." },
      { phase: "Design", detail: "Modeled profiles, ideas, and teams as clean REST resources with a clear contract." },
      { phase: "Development", detail: "Built the MERN stack with JWT auth, role-based access, and Zustand state." },
      { phase: "Testing", detail: "Verified auth flows and access boundaries across roles." },
      { phase: "Deployment", detail: "Shipped the full stack with a modular, extensible frontend." },
      { phase: "Reflection", detail: "Keeping the API contract clean was what let features stack without regressions." },
    ],

    challenges: [
      { problem: "The frontend risked becoming tangled as features multiplied.",
        cause: "Shared state passed down through many component layers.",
        solution: "A clean REST contract plus Zustand slices scoped per concern, instead of prop-drilling.",
        lesson: "Draw state boundaries early — modularity is a design decision, not a refactor you get to later." },
      { problem: "Different roles needed different access to the same resources.",
        cause: "Authorization logic risked being scattered across routes.",
        solution: "Centralized role-based access control in one middleware layer over stateless JWT.",
        lesson: "Authorization belongs in one place — never re-checked ad hoc per route." },
    ],

    perf: {
      counters: [
        { label: "REST endpoints", value: 28, suffix: "" },
        { label: "Roles", value: 3, suffix: "" },
        { label: "Commits", value: 100, suffix: "+" },
        { label: "Components", value: 46, suffix: "" },
      ],
      commits: [6, 4, 9, 7, 11, 8, 12, 6, 10, 7, 9, 11],
      languages: [
        { name: "JavaScript", pct: 74, color: "#00e5ff" },
        { name: "CSS", pct: 20, color: "#00ff9c" },
        { name: "Other", pct: 6, color: "#6c63ff" },
      ],
    },

    code: {
      tree: [
        { name: "server", type: "folder", children: [
          { name: "auth.middleware.js", type: "file", snippet: "auth" },
          { name: "routes", type: "folder", children: [
            { name: "ideas.js", type: "file" },
            { name: "teams.js", type: "file" },
          ]},
        ]},
        { name: "client", type: "folder", children: [
          { name: "store.js", type: "file", snippet: "store" },
        ]},
      ],
      snippets: [
        { id: "auth", file: "server/auth.middleware.js", lang: "jsx",
          note: "One middleware owns authorization — every protected route composes it, so access rules live in exactly one place.",
          code: `export const requireRole = (...roles) => (req, res, next) => {
  const user = verifyJwt(req.headers.authorization);
  if (!user) return res.status(401).end();
  if (!roles.includes(user.role)) return res.status(403).end();
  req.user = user;
  next();
};` },
        { id: "store", file: "client/store.js", lang: "jsx",
          note: "Zustand slices keep feature state isolated and composable — no provider tree, no prop-drilling.",
          code: `export const useFeed = create((set) => ({
  items: [],
  load: async () => set({ items: await api.get("/feed") }),
  vote: (id) => set((s) => ({
    items: s.items.map((i) => i.id === id ? { ...i, votes: i.votes + 1 } : i),
  })),
}));` },
      ],
    },

    demo: {
      title: "Form a team",
      steps: [
        { label: "Post an idea", detail: '"AI study-buddy for exam prep"' },
        { label: "Gather traction", detail: "12 upvotes · 4 interested builders" },
        { label: "Match teammates", detail: "Suggested: 1 backend · 1 ML · 1 designer" },
        { label: "Form team", detail: "Roles assigned · workspace created" },
        { label: "Showcase", detail: "Project published to the public board ✓" },
      ],
    },

    roadmap: [
      { title: "Mentor matching", detail: "Connect teams with experienced mentors.", tag: "Product" },
      { title: "Recruiter view", detail: "Let recruiters discover shipped work.", tag: "Product" },
      { title: "GitHub integration", detail: "Auto-import repos and contribution signals.", tag: "Integration" },
      { title: "CI/CD + Docker", detail: "Automated pipeline and containerized deploys.", tag: "DevOps" },
    ],

    resources: [
      { label: "GitHub", kind: "github", key: "github" },
      { label: "Live Demo", kind: "demo", key: "demo" },
    ],
  },
};
