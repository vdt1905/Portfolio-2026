/**
 * Zone registry — maps the interactive workspace objects and the
 * navigation dock to the content overlays they open.
 */
export const ZONES = {
  about: { id: "about", label: "About", hint: "Robot Assistant", icon: "Bot" },
  projects: { id: "projects", label: "Projects", hint: "Laptop", icon: "FolderGit2" },
  devops: { id: "devops", label: "DevOps Lab", hint: "Server Rack", icon: "Server" },
  skills: { id: "skills", label: "Skills", hint: "Holograms", icon: "Cpu" },
  terminal: { id: "terminal", label: "Terminal", hint: "Keyboard", icon: "SquareTerminal" },
  achievements: { id: "achievements", label: "Achievements", hint: "Trophies", icon: "Trophy" },
  contact: { id: "contact", label: "Contact", hint: "Console", icon: "Radio" },
};

export const NAV_ORDER = [
  "about",
  "projects",
  "devops",
  "skills",
  "terminal",
  "achievements",
  "contact",
];
