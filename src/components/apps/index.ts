import type { ComponentType } from "react";
import type { AppId } from "@/lib/apps";
import type { AppProps } from "../os/WindowLayer";
import { AboutApp, JourneyApp, ProjectsApp, ProofApp, SettingsApp, SocialsApp, StackApp } from "./ContentApps";
import { BrowserApp, ContactApp, FinderApp, TerminalApp, WhiteboardApp } from "./ToolApps";

export const APP_COMPONENTS: Record<AppId, ComponentType<AppProps>> = {
  projects: ProjectsApp,
  proof: ProofApp,
  journey: JourneyApp,
  stack: StackApp,
  about: AboutApp,
  finder: FinderApp,
  terminal: TerminalApp,
  browser: BrowserApp,
  whiteboard: WhiteboardApp,
  contact: ContactApp,
  socials: SocialsApp,
  settings: SettingsApp
};
