"use client";

/* Read-mostly apps: Projects, Live Apps, Journey, Stack, About.txt, Socials, Settings. */
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { profile } from "@/content/profile";
import { Icon, Tile } from "@/lib/icons";
import { KEYS } from "@/lib/storage";
import { useOS } from "../os/OSProvider";
import { ThemeSwitch } from "../os/SystemBar";
import type { AppProps } from "../os/WindowLayer";
import { CaseArt, EXT, ExternalLinks } from "./shared";

const P = profile;

export function ProjectsApp({ params, navKey, setState }: AppProps) {
  const [current, setCurrent] = useState<string | null>(params.project ?? null);
  const backRef = useRef<HTMLButtonElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrent(params.project ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navKey]);

  const p = current ? P.projects.find((x) => x.id === current) : undefined;
  useEffect(() => {
    setState(p ? p.name : `${P.projects.length} projects`);
    topRef.current?.parentElement?.scrollTo({ top: 0 });
    if (p) backRef.current?.focus({ preventScroll: true });
  }, [p, setState]);

  if (!p) {
    return (
      <div ref={topRef}>
        <h2>Projects</h2>
        <p className="lede">Apps I&apos;ve built and shipped. Every card links to a live store listing or source code.</p>
        <div className="project-grid">
          {P.projects.map((x) => (
            <button key={x.id} type="button" className="project-card" onClick={() => setCurrent(x.id)}>
              <CaseArt p={x} />
              <span className="pc-body">
                <span className="pc-cat">{x.category}</span>
                <span className="pc-name">{x.name}</span>
                <span className="pc-tag">{x.tagline}</span>
                <span className="pc-plat">{x.platforms.join(" · ")}</span>
              </span>
            </button>
          ))}
        </div>
        <p className="disclosure">{P.legal.metricDisclaimer}</p>
      </div>
    );
  }
  return (
    <div className="case-detail" ref={topRef}>
      <button type="button" className="btn btn-ghost btn-sm back-btn" ref={backRef} onClick={() => setCurrent(null)}>
        <Icon name="back" size={16} /> All projects
      </button>
      <p className="pc-cat">
        {p.category} · {p.role}
      </p>
      <h2>{p.name}</h2>
      <p className="lede">{p.tagline}</p>
      <CaseArt p={p} />
      <div className="case-grid">
        <div className="case-block"><h4>Problem</h4><p>{p.problem}</p></div>
        <div className="case-block"><h4>What I built</h4><p>{p.intervention}</p></div>
        <div className="case-block">
          <h4>Outcome</h4>
          <p>{p.outcome}</p>
          <p style={{ marginTop: 8 }}><span className="status-tag">● Published</span></p>
        </div>
      </div>
      <h3>Stack</h3>
      <ul className="chip-row">{p.stack.map((s) => <li key={s} className="chip">{s}</li>)}</ul>
      <h3 style={{ marginTop: 14 }}>Platforms</h3>
      <p>{p.platforms.join(", ")}</p>
      <div className="link-row"><ExternalLinks links={p.links} className="btn btn-primary btn-sm" /></div>
    </div>
  );
}

export function ProofApp({ setState }: AppProps) {
  useEffect(() => {
    setState(`${P.projects.reduce((n, p) => n + p.links.length, 0)} public links`);
  }, [setState]);
  return (
    <>
      <h2>Live Apps</h2>
      <p className="lede">The proof is installable. These are the public listings for the apps on my résumé.</p>
      <ul className="store-list">
        {P.projects.map((p) => (
          <li key={p.id}>
            <Tile hue={p.hue} icon={p.glyph} />
            <span className="store-meta">
              <b>{p.name}</b>
              <span>{p.tagline} · {p.platforms.join(", ")}</span>
            </span>
            <span className="link-row" style={{ margin: 0 }}><ExternalLinks links={p.links} /></span>
          </li>
        ))}
      </ul>
      <p className="disclosure">
        Listings were linked from Ashwin&apos;s résumé. Availability depends on each app&apos;s publisher, and some apps were built for employers or clients who own them.
      </p>
    </>
  );
}

export function JourneyApp({ setState }: AppProps) {
  const { open } = useOS();
  useEffect(() => {
    setState("2017 → now");
  }, [setState]);
  return (
    <>
      <h2>Journey</h2>
      <p className="lede">From a computing degree to leading mobile teams, one upgrade at a time.</p>
      <ol className="timeline">
        {P.journey.map((j) => {
          const linked = j.project ? P.projects.find((x) => x.id === j.project) : undefined;
          return (
            <li key={j.date} className={j.current ? "current" : ""}>
              <span className="tl-date">{j.date}{j.current ? " · now" : ""}</span>
              <p className="tl-title">{j.title}</p>
              <p className="tl-org">{j.org}</p>
              <p className="tl-story">{j.story}</p>
              {j.bullets ? <ul>{j.bullets.map((b) => <li key={b}>{b}</li>)}</ul> : null}
              <span className="tl-upgrade">+ {j.upgrade}</span>
              {linked ? (
                <>
                  {" · "}
                  <button type="button" className="link-btn" onClick={(e) => open("projects", { project: linked.id }, e.currentTarget)}>
                    See {linked.name}
                  </button>
                </>
              ) : null}
            </li>
          );
        })}
      </ol>
      <a className="btn btn-secondary btn-sm" href={P.identity.resumeUrl} download>Download résumé (PDF)</a>
    </>
  );
}

const STACK_TABS = ["Skills", "How I work"] as const;

export function StackApp({ params, navKey, setState }: AppProps) {
  const [tab, setTab] = useState<string>(params.tab ?? "Skills");
  useEffect(() => {
    if (params.tab) setTab(params.tab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navKey]);
  useEffect(() => {
    setState(tab);
  }, [tab, setState]);
  return (
    <>
      <h2>Stack</h2>
      <div className="tabs" role="tablist">
        {STACK_TABS.map((t) => (
          <button key={t} type="button" role="tab" aria-selected={t === tab} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>
      <div role="tabpanel">
        {tab === "Skills" ? (
          Object.entries(P.skills).map(([g, items]) => (
            <div key={g} className="skill-group">
              <h3>{g}</h3>
              <ul className="chip-row">{items.map((s) => <li key={s} className="chip">{s}</li>)}</ul>
            </div>
          ))
        ) : (
          <>
            <p className="lede">Five habits I bring to every app.</p>
            <ol className="method">
              {P.method.map((m) => (
                <li key={m.step}>
                  <b>{m.step}</b>
                  {m.detail}
                  <div className="m-art">Produces: {m.artifact}</div>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
    </>
  );
}

export function AboutApp({ setState }: AppProps) {
  useEffect(() => {
    setState("read-only");
  }, [setState]);
  return (
    <pre className="notepad">
      {P.about.map((l, i) => (
        <span key={i}>
          {/^[A-Z][A-Z ]+$/.test(l) ? <span className="np-h">{l}</span> : l}
          {"\n"}
        </span>
      ))}
    </pre>
  );
}

export function SocialsApp({ setState }: AppProps) {
  useEffect(() => {
    setState(`${P.socials.length} profiles`);
  }, [setState]);
  const icon = { GitHub: "code", LinkedIn: "briefcase" } as const;
  return (
    <>
      <h2>Socials</h2>
      <p className="lede">Where my work lives in public.</p>
      <ul className="social-list">
        {P.socials.map((s) => (
          <li key={s.network}>
            <a href={s.url} {...EXT}>
              <Icon name={icon[s.network as keyof typeof icon] ?? "browser"} size={28} style={{ strokeWidth: 1.8 } as CSSProperties} />
              <span className="s-meta">
                <b>{s.network}</b>
                <span>@{s.handle} · {s.purpose}</span>
              </span>
              <Icon name="external" size={18} />
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

export function SettingsApp({ setState }: AppProps) {
  const { resetIcons, companion } = useOS();
  useEffect(() => {
    setState("Preferences");
  }, [setState]);
  return (
    <>
      <h2>Settings</h2>
      <div className="settings-list">
        <div className="setting">
          <div><b>Appearance</b><p>Day, Night or Dark.</p></div>
          <ThemeSwitch />
        </div>
        <div className="setting">
          <div><b>Desktop icons</b><p>Put every icon back in the default grid.</p></div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={resetIcons}>Reset icons</button>
        </div>
        <div className="setting">
          <div><b>Bit, the companion</b><p>Move Bit back to the bottom-left corner.</p></div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => companion.reset()}>Reset Bit</button>
        </div>
        <div className="setting">
          <div><b>Boot screen</b><p>Watch the full boot sequence again.</p></div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              try { sessionStorage.removeItem(KEYS.boot); } catch { /* ignore */ }
              window.location.reload();
            }}
          >
            Replay boot
          </button>
        </div>
        <div className="setting">
          <div><b>Stored data</b><p>This site keeps only your theme, icon layout, Bit&apos;s position and whiteboard notes, all in this browser.</p></div>
        </div>
      </div>
    </>
  );
}
