"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { profile } from "@/content/profile";
import { APPS, DOCK_APPS, appById, type AppId } from "@/lib/apps";
import { Tile } from "@/lib/icons";
import { KEYS, clamp, isDesktop, reducedMotion, store } from "@/lib/storage";
import { useOS } from "./OSProvider";

const CELL_W = 128;
const CELL_H = 134;

function Transmission() {
  const { open } = useOS();
  const [today, setToday] = useState<{ date: string; quote: string } | null>(null);
  useEffect(() => {
    const now = new Date();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 864e5);
    setToday({
      date: new Intl.DateTimeFormat("en-GB", { timeZone: profile.identity.timezone, day: "numeric", month: "long", year: "numeric" }).format(now),
      quote: profile.transmissions[dayOfYear % profile.transmissions.length]
    });
  }, []);
  return (
    <section className="widget transmission" aria-labelledby="txTitle">
      <header className="widget-head">
        <span className="widget-label" id="txTitle">
          <i className="dot" /> Daily Transmission
        </span>
        <span className="widget-date">{today?.date}</span>
      </header>
      <p className="tx-quote">{today ? today.quote : profile.transmissions[0]}</p>
      <footer className="widget-foot">
        <span className="widget-os">{profile.identity.osName} · signal ok</span>
        <button type="button" className="link-btn" onClick={(e) => open("whiteboard", {}, e.currentTarget)}>
          + Add a Quick Sticky
        </button>
      </footer>
    </section>
  );
}

function Descriptor() {
  const list = profile.identity.descriptors;
  const [i, setI] = useState(0);
  const [swap, setSwap] = useState(false);
  useEffect(() => {
    if (reducedMotion()) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setSwap(true);
      window.setTimeout(() => {
        setI((n) => (n + 1) % list.length);
        setSwap(false);
      }, 260);
    }, 3400);
    return () => window.clearInterval(id);
  }, [list.length]);
  return (
    <p className="descriptor">
      <span className="desc-caret">&gt;</span> <span id="descriptor" className={swap ? "swap" : ""}>{list[i]}</span>
    </p>
  );
}

function Identity() {
  const { open } = useOS();
  const id = profile.identity;
  return (
    <section className="identity" aria-labelledby="ownerName">
      <p className="eyebrow">{id.roles.join(" · ")}</p>
      <h1 className="owner-name" id="ownerName">{id.fullName}</h1>
      <Descriptor />
      <p className="headline">{id.headline}</p>
      <p className="intro">{id.intro}</p>
      <div className="cta-row">
        <button type="button" className="btn btn-primary" onClick={(e) => open("projects", {}, e.currentTarget)}>
          {profile.conversion.primaryLabel}
        </button>
        <button type="button" className="btn btn-secondary" onClick={(e) => open("contact", {}, e.currentTarget)}>
          {profile.conversion.secondaryLabel}
        </button>
      </div>
      <ul className="metric-strip" aria-label="At a glance">
        {profile.metrics
          .filter((m) => m.public && m.status !== "private")
          .map((m) => (
            <li key={m.label} title={`${m.status} · ${m.source}`}>
              <b>{m.value}</b>
              <span>{m.label}</span>
            </li>
          ))}
      </ul>
    </section>
  );
}

type Positions = Partial<Record<AppId, { x: number; y: number }>>;

function AppIcon({ id, pos, area, onMoved }: { id: AppId; pos?: { x: number; y: number }; area: { w: number; h: number }; onMoved: (id: AppId, p: { x: number; y: number }) => void }) {
  const { open, wins } = useOS();
  const app = appById(id);
  const ref = useRef<HTMLButtonElement>(null);
  const start = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const moved = useRef(false);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const shown = dragPos ?? pos;
  const style: CSSProperties | undefined = shown ? { left: shown.x, top: shown.y } : undefined;
  const isOpen = wins.some((w) => w.id === id);

  return (
    <button
      ref={ref}
      type="button"
      className={`app-icon${dragPos ? " dragging" : ""}${isOpen ? " is-open" : ""}`}
      data-app={id}
      style={style}
      aria-label={`Open ${app.name}: ${app.desc}`}
      onPointerDown={(e) => {
        if (!isDesktop() || e.button !== 0 || !ref.current) return;
        start.current = { x: e.clientX, y: e.clientY, left: ref.current.offsetLeft, top: ref.current.offsetTop };
        moved.current = false;
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        const s = start.current;
        if (!s) return;
        const dx = e.clientX - s.x;
        const dy = e.clientY - s.y;
        if (!moved.current && Math.hypot(dx, dy) < 5) return;
        moved.current = true;
        setDragPos({ x: clamp(s.left + dx, 0, area.w - CELL_W + 4), y: clamp(s.top + dy, 0, area.h - 120) });
      }}
      onPointerUp={() => {
        if (!start.current) return;
        start.current = null;
        if (moved.current && dragPos) onMoved(id, dragPos);
        setDragPos(null);
      }}
      onPointerCancel={() => {
        start.current = null;
        setDragPos(null);
      }}
      onClick={(e) => {
        if (moved.current) {
          moved.current = false;
          return;
        }
        open(id, {}, e.currentTarget);
      }}
    >
      <Tile hue={app.hue} icon={app.icon} badge={app.badge} />
      <span className="app-name">{app.name}</span>
      <span className="app-desc">{app.desc}</span>
      <span className="app-open-dot" aria-hidden="true" />
    </button>
  );
}

function IconArea() {
  const { layoutVersion } = useOS();
  const ref = useRef<HTMLElement>(null);
  const [area, setArea] = useState({ w: 0, h: 0, desktop: false });
  const [saved, setSaved] = useState<Positions>({});

  useLayoutEffect(() => {
    const el = ref.current!;
    const read = () => setArea({ w: el.clientWidth, h: el.clientHeight, desktop: isDesktop() });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const s = store.get<Positions>(KEYS.layout, {});
    setSaved(s && typeof s === "object" ? s : {});
  }, [layoutVersion]);

  const onMoved = useCallback((id: AppId, p: { x: number; y: number }) => {
    setSaved((s) => {
      const next = { ...s, [id]: p };
      store.set(KEYS.layout, next);
      return next;
    });
  }, []);

  const positions: Positions = {};
  if (area.desktop && area.w > 0) {
    const cols = Math.max(2, Math.floor(area.w / CELL_W));
    const offset = Math.max(0, area.w - cols * CELL_W); // right-align the grid
    APPS.forEach((a, idx) => {
      const s = saved[a.id];
      const p = s && Number.isFinite(s.x) && Number.isFinite(s.y) ? s : { x: offset + (idx % cols) * CELL_W, y: Math.floor(idx / cols) * CELL_H };
      positions[a.id] = { x: clamp(p.x, 0, Math.max(0, area.w - CELL_W + 4)), y: clamp(p.y, 0, Math.max(0, area.h - 120)) };
    });
  }

  return (
    <section className="icon-area" aria-label="Applications" ref={ref}>
      {APPS.map((a) => (
        <AppIcon key={a.id} id={a.id} pos={positions[a.id]} area={area} onMoved={onMoved} />
      ))}
    </section>
  );
}

export function Dock() {
  const { open, wins } = useOS();
  const item = (id: AppId) => {
    const app = appById(id);
    return (
      <button
        key={id}
        type="button"
        className={`dock-item${wins.some((w) => w.id === id) ? " is-open" : ""}`}
        data-app={id}
        aria-label={app.name}
        onClick={(e) => open(id, {}, e.currentTarget)}
      >
        <Tile hue={app.hue} icon={app.icon} />
        <span className="app-open-dot" aria-hidden="true" />
        <span className="dock-tip">{app.name}</span>
      </button>
    );
  };
  return (
    <nav className="dock" id="dock" aria-label="Dock">
      {DOCK_APPS.map(item)}
      <span className="dock-sep" aria-hidden="true" />
      {item("settings")}
    </nav>
  );
}

export function Desktop() {
  const { open } = useOS();
  return (
    <main id="desktop" className="desktop" tabIndex={-1}>
      <div className="wallpaper" aria-hidden="true">
        <div className="wp-grid" />
        <div className="wp-stars" />
        <div className="wp-moon" />
        <div className="wp-glow" />
      </div>
      <div className="desk-left">
        <Transmission />
        <Identity />
      </div>
      <IconArea />
      <a
        className="fold"
        href={`mailto:${profile.conversion.email}`}
        aria-label="Need an app built? Contact Ashwin"
        onClick={(e) => {
          e.preventDefault();
          open("contact", {}, e.currentTarget);
        }}
      >
        <span className="fold-inner">
          <span className="fold-q">Need an app built?</span>
          <span className="fold-a">Let&apos;s talk →</span>
        </span>
      </a>
    </main>
  );
}
