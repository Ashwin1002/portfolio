"use client";

import { useEffect, useRef, useState } from "react";
import { KEYS, reducedMotion } from "@/lib/storage";
import { BotMark } from "./BotSprite";
import { useOS } from "./OSProvider";

const STEPS = ["Loading projects…", "Mounting case files…", "Reading the journey…", "Indexing the stack…", "Waking Bit…"];

export function Boot() {
  const { companion } = useOS();
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);
  const finished = useRef(false);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    setDone(true);
    try {
      sessionStorage.setItem(KEYS.boot, "1");
    } catch {
      /* ignore */
    }
    window.setTimeout(() => setGone(true), 450);
    companion.greet();
  };

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEYS.boot) === "1";
    } catch {
      /* ignore */
    }
    const total = reducedMotion() ? 300 : seen ? 600 : 1900;
    const start = performance.now();
    let raf = 0;
    const step = (t: number) => {
      if (finished.current) return;
      const k = Math.min(1, (t - start) / total);
      setProgress(k);
      if (k < 1) raf = requestAnimationFrame(step);
      else window.setTimeout(finish, 120);
    };
    raf = requestAnimationFrame(step);
    const failSafe = window.setTimeout(finish, total + 1500); // never block indefinitely
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(failSafe);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;
  return (
    <div className={`boot${done ? " done" : ""}`} role="status" aria-live="polite" aria-hidden={done}>
      <div className="boot-inner">
        <BotMark className="boot-mark" />
        <p className="boot-title">
          AshwinOS <span className="boot-ver">v1.0</span>
        </p>
        <p className="boot-line">{STEPS[Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length))]}</p>
        <div className="boot-bar">
          <span style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
        <button className="btn btn-ghost" type="button" onClick={finish}>
          Skip boot
        </button>
      </div>
    </div>
  );
}
