"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { APPS, appById } from "@/lib/apps";
import { Icon, Tile, type IconName } from "@/lib/icons";
import { useOS } from "./OSProvider";

interface Item {
  label: string;
  hint: string;
  type: string;
  hue: number;
  icon: IconName;
  run: () => void;
}

function score(text: string, q: string) {
  const t = text.toLowerCase();
  if (!q) return 1;
  const idx = t.indexOf(q);
  if (idx === 0) return 100;
  if (idx > 0) return 60 - idx;
  let ti = 0;
  for (const ch of q) {
    ti = t.indexOf(ch, ti);
    if (ti < 0) return 0;
    ti++;
  }
  return 10;
}

export function Palette() {
  const os = useOS();
  const { paletteOpen, setPaletteOpen, open, setTheme, resetIcons } = os;
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastFocus = useRef<Element | null>(null);

  const items = useMemo<Item[]>(() => {
    const as = (id: Parameters<typeof appById>[0]) => ({ hue: appById(id).hue, icon: appById(id).icon });
    return [
      ...APPS.map((a) => ({ label: a.name, hint: a.desc, type: "App", hue: a.hue, icon: a.icon, run: () => open(a.id) })),
      ...profile.projects.map((p) => ({ label: p.name, hint: p.tagline, type: "Project", hue: p.hue, icon: p.glyph, run: () => open("projects", { project: p.id }) })),
      ...[...profile.journey].reverse().map((j) => ({ label: j.title, hint: j.org, type: "Role", ...as("journey"), run: () => open("journey") })),
      ...Object.values(profile.skills).flat().map((s) => ({ label: s, hint: "Skill", type: "Skill", ...as("stack"), run: () => open("stack", { tab: "Skills" }) })),
      ...profile.services.map((s) => ({ label: s, hint: "Service", type: "Service", ...as("contact"), run: () => open("contact") })),
      { label: "Day theme", hint: "Switch theme", type: "Command", ...as("settings"), run: () => setTheme("day") },
      { label: "Night theme", hint: "Switch theme", type: "Command", ...as("settings"), run: () => setTheme("night") },
      { label: "Dark theme", hint: "Switch theme", type: "Command", ...as("settings"), run: () => setTheme("dark") },
      { label: "Email Ashwin", hint: profile.conversion.email, type: "Command", ...as("contact"), run: () => (window.location.href = `mailto:${profile.conversion.email}`) },
      { label: "Download résumé", hint: "PDF", type: "Command", ...as("about"), run: () => window.open(profile.identity.resumeUrl, "_blank", "noopener") },
      { label: "Reset desktop icons", hint: "Settings", type: "Command", ...as("settings"), run: resetIcons }
    ];
  }, [open, setTheme, resetIcons]);

  const query = q.trim().toLowerCase();
  const results = useMemo(
    () =>
      items
        .map((it) => ({ it, s: Math.max(score(it.label, query), score(it.hint, query) * 0.6) }))
        .filter((r) => r.s > 0)
        .sort((a, b) => b.s - a.s)
        .slice(0, query ? 14 : 12)
        .map((r) => r.it),
    [items, query]
  );

  useEffect(() => {
    if (paletteOpen) {
      lastFocus.current = document.activeElement;
      setQ("");
      setSel(0);
      window.setTimeout(() => inputRef.current?.focus(), 0);
    } else if (lastFocus.current instanceof HTMLElement && document.contains(lastFocus.current)) {
      lastFocus.current.focus({ preventScroll: true });
    }
  }, [paletteOpen]);

  useEffect(() => {
    document.getElementById(`pal-${sel}`)?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  if (!paletteOpen) return null;
  const run = (i: number) => {
    const r = results[i];
    setPaletteOpen(false);
    r?.run();
  };

  return (
    <div className="palette-backdrop" onPointerDown={(e) => e.target === e.currentTarget && setPaletteOpen(false)}>
      <div className="palette" role="dialog" aria-modal="true" aria-label={`Search ${profile.identity.osName}`}>
        <div className="palette-input">
          <Icon name="search" />
          <input
            ref={inputRef}
            type="text"
            value={q}
            placeholder="Search apps, projects, skills, commands…"
            autoComplete="off"
            aria-label="Search"
            aria-controls="paletteList"
            aria-activedescendant={results.length ? `pal-${sel}` : undefined}
            onChange={(e) => {
              setQ(e.target.value);
              setSel(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                if (results.length) setSel((s) => (s + 1) % results.length);
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                if (results.length) setSel((s) => (s - 1 + results.length) % results.length);
              } else if (e.key === "Enter") {
                e.preventDefault();
                run(sel);
              } else if (e.key === "Escape") {
                e.preventDefault();
                e.stopPropagation();
                setPaletteOpen(false);
              } else if (e.key === "Tab") {
                e.preventDefault(); // keep focus inside the dialog
              }
            }}
          />
          <kbd>Esc</kbd>
        </div>
        <ul className="palette-list" id="paletteList" role="listbox">
          {results.length ? (
            results.map((r, i) => (
              <li key={`${r.type}-${r.label}`} id={`pal-${i}`} role="option" aria-selected={i === sel} onClick={() => run(i)} onPointerMove={() => setSel(i)}>
                <Tile hue={r.hue} icon={r.icon} />
                <span>
                  <b>{r.label}</b> <span className="p-hint">{r.hint}</span>
                </span>
                <span className="p-type">{r.type}</span>
              </li>
            ))
          ) : (
            <li className="palette-empty">No results. Try &quot;flutter&quot; or &quot;medhavhi&quot;.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
