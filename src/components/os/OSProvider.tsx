"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { appById, type AppId, type AppParams } from "@/lib/apps";
import { KEYS, store } from "@/lib/storage";

export type Theme = "day" | "night" | "dark";
export type CompanionState = "idle" | "happy" | "sad" | "excited" | "sleeping";

export interface Rect { x: number; y: number; w: number; h: number }

export interface Win {
  id: AppId;
  z: number;
  minimized: boolean;
  maximized: boolean;
  rect: Rect;
  params: AppParams;
  navKey: number;
}

export interface CompanionApi {
  react: (s: CompanionState, ms?: number) => void;
  say: (text: string, ms?: number) => void;
  reset: () => void;
  greet: () => void;
}

interface OS {
  wins: Win[];
  open: (id: AppId, params?: AppParams, opener?: Element | null) => void;
  close: (id: AppId) => void;
  focus: (id: AppId) => void;
  minimize: (id: AppId) => void;
  toggleMax: (id: AppId) => void;
  setRect: (id: AppId, rect: Rect) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  companion: CompanionApi;
  registerCompanion: (api: CompanionApi | null) => void;
  layoutVersion: number;
  resetIcons: () => void;
}

const Ctx = createContext<OS | null>(null);

export const NAV_H = 44;
export const dockTop = () => window.innerHeight - 86;

const THEME_COLOR: Record<Theme, string> = { day: "#fbf3e6", night: "#1a1a4a", dark: "#0a0b0f" };

export function OSProvider({ children }: { children: ReactNode }) {
  const [wins, setWins] = useState<Win[]>([]);
  const [theme, setThemeState] = useState<Theme>("day");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [layoutVersion, setLayoutVersion] = useState(0);
  const zRef = useRef(1000);
  const cascade = useRef(0);
  const openers = useRef(new Map<AppId, Element | null>());
  const companionRef = useRef<CompanionApi | null>(null);
  const winsRef = useRef(wins);
  winsRef.current = wins;

  const companion = useMemo<CompanionApi>(
    () => ({
      react: (s, ms) => companionRef.current?.react(s, ms),
      say: (t, ms) => companionRef.current?.say(t, ms),
      reset: () => companionRef.current?.reset(),
      greet: () => companionRef.current?.greet()
    }),
    []
  );

  /* Theme: the inline script in layout.tsx already applied the saved value. */
  useEffect(() => {
    const current = document.documentElement.dataset.theme as Theme | undefined;
    if (current === "day" || current === "night" || current === "dark") setThemeState(current);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    document.documentElement.dataset.theme = t;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[t]);
    store.set(KEYS.theme, t);
  }, []);

  const focus = useCallback((id: AppId) => {
    const z = ++zRef.current;
    setWins((ws) => ws.map((w) => (w.id === id ? { ...w, z, minimized: false } : w)));
  }, []);

  const open = useCallback(
    (id: AppId, params: AppParams = {}, opener: Element | null = null) => {
      companionRef.current?.react("happy", 2200);
      const z = ++zRef.current;
      const existing = winsRef.current.find((w) => w.id === id);
      if (existing) {
        const hasParams = Object.keys(params).length > 0;
        setWins((ws) =>
          ws.map((w) =>
            w.id === id ? { ...w, z, minimized: false, params: hasParams ? params : w.params, navKey: hasParams ? w.navKey + 1 : w.navKey } : w
          )
        );
        return;
      }
      if (opener) openers.current.set(id, opener);
      const app = appById(id);
      const vw = window.innerWidth;
      const w = Math.min(app.w, vw - 32);
      const h = Math.min(app.h, dockTop() - NAV_H - 24);
      const step = cascade.current++ % 6;
      const rect = { x: Math.max(16, (vw - w) / 2 + step * 26 - 60), y: NAV_H + 18 + step * 22, w, h };
      setWins((ws) => [...ws, { id, z, minimized: false, maximized: false, rect, params, navKey: 0 }]);
    },
    []
  );

  const close = useCallback((id: AppId) => {
    setWins((ws) => ws.filter((w) => w.id !== id));
    const opener = openers.current.get(id);
    openers.current.delete(id);
    const target = (opener && document.contains(opener) ? opener : document.getElementById("desktop")) as HTMLElement | null;
    target?.focus({ preventScroll: true });
  }, []);

  const minimize = useCallback((id: AppId) => {
    setWins((ws) => ws.map((w) => (w.id === id ? { ...w, minimized: true } : w)));
    const dockBtn = document.querySelector<HTMLElement>(`.dock-item[data-app="${id}"]`);
    (dockBtn ?? document.getElementById("desktop"))?.focus({ preventScroll: true });
  }, []);

  const toggleMax = useCallback((id: AppId) => {
    setWins((ws) => ws.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)));
  }, []);

  const setRect = useCallback((id: AppId, rect: Rect) => {
    setWins((ws) => ws.map((w) => (w.id === id ? { ...w, rect } : w)));
  }, []);

  const registerCompanion = useCallback((api: CompanionApi | null) => {
    companionRef.current = api;
  }, []);

  const resetIcons = useCallback(() => {
    store.del(KEYS.layout);
    setLayoutVersion((v) => v + 1);
  }, []);

  /* Global keys: ⌘K / Ctrl K toggles search, Escape closes the top window. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
        return;
      }
      const inPalette = e.target instanceof Element && e.target.closest(".palette");
      if (e.key === "Escape" && !e.defaultPrevented && !inPalette) {
        const top = winsRef.current.filter((w) => !w.minimized).sort((a, b) => b.z - a.z)[0];
        if (top) {
          e.preventDefault();
          close(top.id);
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close]);

  const value: OS = {
    wins, open, close, focus, minimize, toggleMax, setRect,
    theme, setTheme, paletteOpen, setPaletteOpen,
    companion, registerCompanion, layoutVersion, resetIcons
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOS() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useOS must be used inside OSProvider");
  return ctx;
}
