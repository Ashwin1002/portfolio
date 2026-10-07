import type { IconName } from "./icons";

export type AppId =
  | "projects"
  | "proof"
  | "journey"
  | "stack"
  | "about"
  | "finder"
  | "terminal"
  | "browser"
  | "whiteboard"
  | "contact"
  | "socials"
  | "settings";

export interface AppMeta {
  id: AppId;
  name: string;
  desc: string;
  icon: IconName;
  hue: number;
  badge?: string;
  w: number;
  h: number;
}

export const APPS: AppMeta[] = [
  { id: "projects", name: "Projects", desc: "Shipped apps & libraries", icon: "projects", hue: 212, badge: "MAIN DRIVE", w: 900, h: 640 },
  { id: "proof", name: "Live Apps", desc: "Store listings to install", icon: "proof", hue: 150, badge: "PROOF", w: 720, h: 600 },
  { id: "journey", name: "Journey", desc: "2017 to now, 5 teams", icon: "journey", hue: 28, w: 720, h: 640 },
  { id: "stack", name: "Stack", desc: "Skills & how I work", icon: "stack", hue: 262, w: 760, h: 600 },
  { id: "about", name: "About.txt", desc: "In my own words", icon: "about", hue: 45, w: 640, h: 600 },
  { id: "finder", name: "Case Files", desc: "Browse work by domain", icon: "finder", hue: 195, w: 820, h: 560 },
  { id: "terminal", name: "Terminal", desc: "Type help to start", icon: "terminal", hue: 220, w: 700, h: 460 },
  { id: "browser", name: "AshNet", desc: "Bookmarks & links", icon: "browser", hue: 180, w: 880, h: 620 },
  { id: "whiteboard", name: "Whiteboard", desc: "Leave a sticky note", icon: "whiteboard", hue: 52, w: 820, h: 620 },
  { id: "contact", name: "Contact", desc: "Email, call or send a brief", icon: "contact", hue: 350, badge: "HIRE", w: 760, h: 660 },
  { id: "socials", name: "Socials", desc: "GitHub & LinkedIn", icon: "socials", hue: 300, w: 560, h: 420 },
  { id: "settings", name: "Settings", desc: "Theme & resets", icon: "settings", hue: 230, w: 600, h: 560 }
];

export const DOCK_APPS: AppId[] = ["projects", "proof", "journey", "stack", "finder", "terminal", "browser", "whiteboard", "contact"];

export const appById = (id: AppId) => APPS.find((a) => a.id === id)!;

export type AppParams = { project?: string; tab?: string; folder?: string; url?: string };
