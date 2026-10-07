"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent } from "react";
import { appById, type AppParams } from "@/lib/apps";
import { Icon, Tile } from "@/lib/icons";
import { clamp, isDesktop } from "@/lib/storage";
import { NAV_H, dockTop, useOS, type Rect, type Win } from "./OSProvider";
import { APP_COMPONENTS } from "../apps";

export interface AppProps {
  params: AppParams;
  navKey: number;
  setState: (text: string) => void;
}

function useViewport() {
  const [vp, setVp] = useState({ w: 1280, h: 800, desktop: true });
  useEffect(() => {
    const read = () => setVp({ w: window.innerWidth, h: window.innerHeight, desktop: isDesktop() });
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);
  return vp;
}

function fit(win: Win, vp: { w: number; h: number; desktop: boolean }): CSSProperties {
  const dTop = dockTop();
  if (!vp.desktop) {
    return { left: 6, top: NAV_H + 6, width: vp.w - 12, height: Math.max(260, dTop - NAV_H - 14) };
  }
  if (win.maximized) return { left: 0, top: NAV_H, width: vp.w, height: dTop - NAV_H - 8 };
  const width = Math.min(win.rect.w, vp.w - 32);
  const height = Math.min(win.rect.h, dTop - NAV_H - 24);
  return {
    left: clamp(win.rect.x, 168 - width, vp.w - 160),
    top: clamp(win.rect.y, NAV_H + 4, vp.h - 60),
    width,
    height
  };
}

function Window({ win, active, vp }: { win: Win; active: boolean; vp: { w: number; h: number; desktop: boolean } }) {
  const os = useOS();
  const app = appById(win.id);
  const [state, setState] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; l: number; t: number } | null>(null);
  const size = useRef<{ x: number; y: number; w: number; h: number } | null>(null);
  const style = fit(win, vp);
  const Body = APP_COMPONENTS[win.id];

  useEffect(() => {
    bodyRef.current?.focus({ preventScroll: true });
  }, [win.navKey]);

  const onBarDown = (e: RPointerEvent<HTMLDivElement>) => {
    if (!vp.desktop || win.maximized || e.button !== 0 || (e.target as Element).closest("button")) return;
    drag.current = { x: e.clientX, y: e.clientY, l: Number(style.left), t: Number(style.top) };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onBarMove = (e: RPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    os.setRect(win.id, { ...win.rect, x: d.l + e.clientX - d.x, y: d.t + e.clientY - d.y });
  };
  const onResizeDown = (e: RPointerEvent<HTMLDivElement>) => {
    if (!vp.desktop || win.maximized) return;
    e.stopPropagation();
    size.current = { x: e.clientX, y: e.clientY, w: Number(style.width), h: Number(style.height) };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onResizeMove = (e: RPointerEvent<HTMLDivElement>) => {
    const s = size.current;
    if (!s) return;
    const rect: Rect = {
      x: Number(style.left),
      y: Number(style.top),
      w: Math.max(340, s.w + e.clientX - s.x),
      h: Math.max(260, s.h + e.clientY - s.y)
    };
    os.setRect(win.id, rect);
  };

  return (
    <section
      className={`window${active ? "" : " inactive"}${win.minimized ? " minimized" : ""}${win.maximized ? " maximized" : ""}`}
      role="dialog"
      aria-labelledby={`wt-${win.id}`}
      data-win={win.id}
      style={{ ...style, zIndex: win.z }}
      onPointerDown={() => !active && os.focus(win.id)}
    >
      <div
        className="win-bar"
        onPointerDown={onBarDown}
        onPointerMove={onBarMove}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
        onDoubleClick={(e) => {
          if (!(e.target as Element).closest("button") && vp.desktop) os.toggleMax(win.id);
        }}
      >
        <div className="win-controls">
          <button type="button" className="wc-close" aria-label={`Close ${app.name}`} onClick={() => os.close(win.id)}>
            <Icon name="close" />
          </button>
          <button type="button" className="wc-min" aria-label={`Minimize ${app.name}`} onClick={() => os.minimize(win.id)}>
            <Icon name="min" />
          </button>
          {vp.desktop ? (
            <button
              type="button"
              className="wc-max"
              aria-label={`${win.maximized ? "Restore" : "Maximize"} ${app.name}`}
              onClick={() => os.toggleMax(win.id)}
            >
              <Icon name={win.maximized ? "restore" : "max"} />
            </button>
          ) : null}
        </div>
        <div className="win-title" id={`wt-${win.id}`}>
          <Tile hue={app.hue} icon={app.icon} />
          <span>{app.name}</span>
        </div>
        <div className="win-state" aria-live="polite">{state}</div>
      </div>
      <div className="win-body" tabIndex={-1} ref={bodyRef}>
        <Body params={win.params} navKey={win.navKey} setState={setState} />
      </div>
      <div
        className="win-resize"
        aria-hidden="true"
        onPointerDown={onResizeDown}
        onPointerMove={onResizeMove}
        onPointerUp={() => (size.current = null)}
        onPointerCancel={() => (size.current = null)}
      />
    </section>
  );
}

export function WindowLayer() {
  const { wins } = useOS();
  const vp = useViewport();
  const topZ = Math.max(0, ...wins.filter((w) => !w.minimized).map((w) => w.z));
  return (
    <div id="windowLayer" className="window-layer">
      {wins.map((w) => (
        <Window key={w.id} win={w} active={w.z === topZ} vp={vp} />
      ))}
    </div>
  );
}

