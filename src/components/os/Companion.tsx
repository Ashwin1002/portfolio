"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { KEYS, clamp, isDesktop, reducedMotion, store } from "@/lib/storage";
import { BotSprite } from "./BotSprite";
import { useOS, type CompanionState } from "./OSProvider";

const LINES = [
  "Hi! I'm Bit. Press ⌘K (or Ctrl K) to search everything.",
  "Tip: drag the desktop icons around. They remember where you left them.",
  "Open Terminal and type help. Ashwin left some commands in there.",
  "Every project links to a real store listing.",
  "Try Night mode in the top bar."
];

type Pos = { x: number; y: number } | null;

export function Companion() {
  const { registerCompanion } = useOS();
  const rootRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CompanionState>("idle");
  const [bubble, setBubble] = useState<string | null>(null);
  const [pos, setPos] = useState<Pos>(null);
  const timers = useRef<{ state?: number; bubble?: number; idle?: number }>({});
  const line = useRef(0);
  const drag = useRef<{ dx: number; dy: number; sx: number; sy: number } | null>(null);
  const moved = useRef(false);
  const actions = useRef<{ react: (s: CompanionState, ms?: number) => void; say: (t: string) => void } | null>(null);

  /* Keep Bit inside the viewport, below the system bar and clear of the dock. */
  const place = (x: number, y: number): { x: number; y: number } => {
    const el = rootRef.current;
    const w = el?.offsetWidth ?? 72;
    const h = el?.offsetHeight ?? 86;
    const cx = clamp(x, 6, window.innerWidth - w - 6);
    let cy = clamp(y, 50, window.innerHeight - h - 6);
    const dock = document.getElementById("dock")?.getBoundingClientRect();
    if (dock && cx + w > dock.left && cx < dock.right && cy + h > dock.top) cy = dock.top - h - 8;
    const p = { x: cx, y: cy };
    setPos(p);
    return p;
  };

  useEffect(() => {
    const t = timers.current;
    const poke = () => {
      window.clearTimeout(t.idle);
      setState((s) => (s === "sleeping" ? "idle" : s));
      t.idle = window.setTimeout(() => {
        setState("sleeping");
        setBubble(null);
      }, 60000);
    };
    const react = (s: CompanionState, ms = 2000) => {
      window.clearTimeout(t.state);
      setState(s);
      t.state = window.setTimeout(() => setState("idle"), reducedMotion() ? Math.min(ms, 1200) : ms);
      poke();
    };
    const say = (text: string, ms = 5500) => {
      window.clearTimeout(t.bubble);
      setBubble(text);
      t.bubble = window.setTimeout(() => setBubble(null), ms);
    };
    const reset = () => {
      setPos(null);
      store.del(KEYS.companion);
      react("happy", 1500);
    };
    const greet = () => {
      window.setTimeout(() => {
        react("happy", 2500);
        say(LINES[0]);
      }, 500);
    };
    actions.current = { react, say };
    registerCompanion({ react, say, reset, greet });

    const restore = () => {
      const saved = store.get<Pos>(KEYS.companion, null);
      if (isDesktop() && saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) place(saved.x, saved.y);
      else setPos(null);
    };
    restore();
    poke();
    window.addEventListener("pointerdown", poke, { passive: true });
    window.addEventListener("keydown", poke);
    window.addEventListener("resize", restore);
    return () => {
      registerCompanion(null);
      window.removeEventListener("pointerdown", poke);
      window.removeEventListener("keydown", poke);
      window.removeEventListener("resize", restore);
      Object.values(t).forEach((id) => window.clearTimeout(id));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerCompanion]);

  const style: CSSProperties | undefined = pos ? { left: pos.x, top: pos.y, bottom: "auto" } : undefined;

  return (
    <div className="companion" id="companion" data-state={state} ref={rootRef} style={style}>
      {bubble ? (
        <div className="bubble" role="status" aria-live="polite">
          {bubble}
        </div>
      ) : null}
      <button
        type="button"
        className="bot"
        aria-label="Bit, the AshwinOS companion. Click to say hi. Double-click to reset position. Arrow keys move Bit."
        onPointerDown={(e) => {
          if (!isDesktop() || e.button !== 0) return;
          const r = rootRef.current!.getBoundingClientRect();
          drag.current = { dx: e.clientX - r.left, dy: e.clientY - r.top, sx: e.clientX, sy: e.clientY };
          moved.current = false;
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          if (!moved.current && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) < 5) return;
          moved.current = true;
          setState("excited");
          place(e.clientX - d.dx, e.clientY - d.dy);
        }}
        onPointerUp={() => {
          if (!drag.current) return;
          drag.current = null;
          if (moved.current) {
            const r = rootRef.current!.getBoundingClientRect();
            store.set(KEYS.companion, place(r.left, r.top));
            actions.current?.react("happy", 1500);
          }
        }}
        onPointerCancel={() => (drag.current = null)}
        onClick={() => {
          if (moved.current) {
            moved.current = false;
            return;
          }
          line.current = (line.current + 1) % LINES.length;
          actions.current?.react("excited", 1600);
          actions.current?.say(LINES[line.current]);
        }}
        onDoubleClick={() => {
          setPos(null);
          store.del(KEYS.companion);
        }}
        onKeyDown={(e) => {
          const step = e.shiftKey ? 40 : 12;
          const map: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
          const m = map[e.key];
          if (!m || !isDesktop()) return;
          e.preventDefault();
          const r = rootRef.current!.getBoundingClientRect();
          store.set(KEYS.companion, place(r.left + m[0], r.top + m[1]));
        }}
      >
        <BotSprite />
      </button>
    </div>
  );
}
