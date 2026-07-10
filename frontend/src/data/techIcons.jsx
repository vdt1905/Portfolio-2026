/**
 * Real brand logos (Simple Icons via react-icons) keyed by the exact
 * tech names used in engineeringCore.js. Techs without a brand mark
 * (REST APIs, JWT, LLMs, DSA, CI/CD, AWS…) simply resolve to null.
 */
import {
  SiReact, SiJavascript, SiTailwindcss, SiFramer, SiThreedotjs,
  SiNodedotjs, SiExpress, SiFastapi, SiSocketdotio,
  SiPython, SiGooglegemini,
  SiMongodb, SiFirebase, SiRedis, SiPostgresql,
  SiGit, SiGithub, SiDocker, SiLinux, SiGnubash, SiKubernetes,
  SiCplusplus, SiPostman, SiVite, SiFigma,
} from "react-icons/si";

const MAP = {
  "React": [SiReact, "#61DAFB"],
  "JavaScript": [SiJavascript, "#F7DF1E"],
  "Tailwind CSS": [SiTailwindcss, "#38BDF8"],
  "Framer Motion": [SiFramer, "#E1E1E6"],
  "React Three Fiber": [SiThreedotjs, "#E1E1E6"],
  "Node.js": [SiNodedotjs, "#5FA04E"],
  "Express.js": [SiExpress, "#E1E1E6"],
  "FastAPI": [SiFastapi, "#009688"],
  "Socket.IO": [SiSocketdotio, "#E1E1E6"],
  "Python": [SiPython, "#FFD343"],
  "Gemini API": [SiGooglegemini, "#8E7CFF"],
  "MongoDB": [SiMongodb, "#47A248"],
  "Firebase": [SiFirebase, "#FFCA28"],
  "Redis": [SiRedis, "#FF4438"],
  "PostgreSQL": [SiPostgresql, "#4169E1"],
  "Git": [SiGit, "#F05032"],
  "GitHub": [SiGithub, "#E1E1E6"],
  "Docker": [SiDocker, "#2496ED"],
  "Linux": [SiLinux, "#FCC624"],
  "Bash": [SiGnubash, "#4EAA25"],
  "Kubernetes": [SiKubernetes, "#326CE5"],
  "C++": [SiCplusplus, "#00599C"],
  "Postman": [SiPostman, "#FF6C37"],
  "Vite / npm": [SiVite, "#646CFF"],
  "Figma": [SiFigma, "#F24E1E"],
};

/** The signature brand logo shown on each orbiting domain sphere. */
export const DOMAIN_FLAGSHIP = {
  frontend: "React",
  backend: "Node.js",
  ai: "Python",
  databases: "MongoDB",
  devops: "Docker",
  cs: "C++",
  tools: "Postman",
};

export function hasBrand(name) {
  return !!MAP[name];
}

/** Renders the brand logo for `name`, or nothing if there isn't one. */
export function BrandIcon({ name, size = 16, brand = true }) {
  const entry = MAP[name];
  if (!entry) return null;
  const [Icon, color] = entry;
  return <Icon size={size} color={brand ? color : "currentColor"} />;
}

export function brandColor(name) {
  return MAP[name]?.[1] || null;
}
