"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/profile";
import { Icon } from "@/lib/icons";
import { BotMark } from "./BotSprite";
import { useOS, type Theme } from "./OSProvider";

export function ThemeSwitch() {
  const { theme, setTheme } = useOS();
  return (
    <div className="theme-switch" role="radiogroup" aria-label="Theme">
      {(["day", "night", "dark"] as Theme[]).map((t) => (
        <button key={t} type="button" role="radio" aria-checked={theme === t} aria-label={`${t} mode`} onClick={() => setTheme(t)}>
          {t[0].toUpperCase() + t.slice(1)}
        </button>
      ))}
    </div>
  );
}

function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const tick = () => {
      setNow(new Date());
      setPhone(window.matchMedia("(max-width: 599px)").matches);
    };
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, []);
  if (!now) return <time className="sys-clock" />;
  const tz = profile.identity.timezone;
  const date = new Intl.DateTimeFormat("en-GB", { timeZone: tz, weekday: "short", day: "numeric", month: "short" }).format(now);
  const time = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false }).format(now);
  return (
    <time className="sys-clock" dateTime={now.toISOString()} aria-label="Local time in Kathmandu">
      {phone ? "" : `${date} · `}
      {time} {profile.identity.timezoneLabel}
    </time>
  );
}

export function SystemBar() {
  const { open, setPaletteOpen } = useOS();
  return (
    <header className="sysbar">
      <button className="sys-brand" type="button" aria-label="Open About.txt" onClick={(e) => open("about", {}, e.currentTarget)}>
        <BotMark className="sys-sprite" />
        <span className="sys-os">{profile.identity.osName}</span>
      </button>
      <nav className="sys-links" aria-label="Primary">
        <button type="button" onClick={(e) => open("projects", {}, e.currentTarget)}>Work</button>
        <button type="button" onClick={(e) => open("proof", {}, e.currentTarget)}>Proof</button>
        <button type="button" onClick={(e) => open("journey", {}, e.currentTarget)}>Journey</button>
        <button type="button" className="sys-search" aria-label="Search (Ctrl K)" onClick={() => setPaletteOpen(true)}>
          <Icon name="search" />
          <span>Search</span>
          <kbd>⌘K</kbd>
        </button>
      </nav>
      <div className="sys-right">
        <ThemeSwitch />
        <span className="sys-status" title="Based in Kathmandu">
          <i className="dot" />
          <span className="hide-sm">Kathmandu</span>
        </span>
        <Clock />
      </div>
    </header>
  );
}
