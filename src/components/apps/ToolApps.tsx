"use client";

/* Interactive apps: Case Files, Terminal, AshNet, Whiteboard, Contact. */
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { profile } from "@/content/profile";
import { APPS, type AppId, type AppParams } from "@/lib/apps";
import { Icon, type IconName } from "@/lib/icons";
import { KEYS, clamp, store } from "@/lib/storage";
import { useOS, type Theme } from "../os/OSProvider";
import type { AppProps } from "../os/WindowLayer";
import { EXT } from "./shared";

const P = profile;

/* Case Files ------------------------------------------------------------ */
interface FileEntry { name: string; kind: string; icon: IconName; folder: string; app: AppId; params?: AppParams }

export function FinderApp({ params, navKey, setState }: AppProps) {
  const { open } = useOS();
  const folders = useMemo(() => ["Start Here", ...new Set(P.projects.map((p) => p.category))], []);
  const all = useMemo<FileEntry[]>(
    () => [
      { name: "About.txt", kind: "Text", icon: "about", folder: "Start Here", app: "about" },
      { name: "Ashwin-Shrestha-Resume.pdf", kind: "PDF", icon: "file", folder: "Start Here", app: "browser", params: { url: P.identity.resumeUrl } },
      { name: "Journey.timeline", kind: "Timeline", icon: "journey", folder: "Start Here", app: "journey" },
      ...P.projects.map((p) => ({ name: `${p.name}.case`, kind: "Case", icon: p.glyph, folder: p.category, app: "projects" as AppId, params: { project: p.id } }))
    ],
    []
  );
  const [hist, setHist] = useState({ list: [params.folder ?? "Start Here"], pos: 0 });
  const [query, setQuery] = useState("");
  const folder = hist.list[hist.pos];

  const go = (f: string) => {
    setHist((h) => ({ list: [...h.list.slice(0, h.pos + 1), f], pos: h.pos + 1 }));
    setQuery("");
  };
  useEffect(() => {
    if (params.folder) go(params.folder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navKey]);

  const q = query.trim().toLowerCase();
  const items = q ? all.filter((x) => x.name.toLowerCase().includes(q) || x.folder.toLowerCase().includes(q)) : all.filter((x) => x.folder === folder);
  useEffect(() => {
    setState(`${items.length} item${items.length === 1 ? "" : "s"}`);
  }, [items.length, setState]);

  return (
    <div className="finder">
      <nav className="finder-side" aria-label="Folders">
        {folders.map((f) => (
          <button key={f} type="button" aria-current={!q && f === folder} onClick={() => go(f)}>
            <Icon name="finder" />
            <span>{f}</span>
          </button>
        ))}
      </nav>
      <div className="finder-main">
        <div className="finder-tool">
          <button type="button" className="icon-btn" aria-label="Back" disabled={hist.pos === 0} onClick={() => setHist((h) => ({ ...h, pos: h.pos - 1 }))}>
            <Icon name="back" />
          </button>
          <button type="button" className="icon-btn" aria-label="Forward" disabled={hist.pos >= hist.list.length - 1} onClick={() => setHist((h) => ({ ...h, pos: h.pos + 1 }))}>
            <Icon name="fwd" />
          </button>
          <span className="crumbs" aria-live="polite">{q ? `Search: "${query.trim()}"` : `Case Files / ${folder}`}</span>
          <input type="search" placeholder="Search files" aria-label="Search case files" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <ul className="finder-list">
          {items.length ? (
            items.map((x) => (
              <li key={x.name}>
                <button type="button" className="finder-item" onClick={(e) => open(x.app, x.params ?? {}, e.currentTarget)}>
                  <Icon name={x.icon} />
                  <span>{x.name}</span>
                  <span className="fi-kind">{q ? x.folder : x.kind}</span>
                </button>
              </li>
            ))
          ) : (
            <li className="palette-empty">No files match.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

/* Terminal -------------------------------------------------------------- */
export function TerminalApp({ setState }: AppProps) {
  const { open, setTheme } = useOS();
  const [lines, setLines] = useState<ReactNode[]>([
    <>
      <span className="t-ok">AshwinOS terminal v1.0</span> <span className="t-dim">Type &quot;help&quot; for commands.</span>
    </>
  ]);
  const [value, setValue] = useState("");
  const history = useRef<string[]>([]);
  const hIdx = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setState("zsh — ashwin@os");
  }, [setState]);
  useEffect(() => {
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, []);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  const run = (raw: string): ReactNode | "clear" => {
    const [c, ...args] = raw.split(/\s+/);
    switch (c.toLowerCase()) {
      case "help":
        return (
          <>
            <span className="t-ok">Available commands</span>
            {`
  whoami          who is Ashwin
  ls              list projects
  open <name>     open an app or project (try: open medhavhi)
  skills          languages, frameworks, tools
  experience      roles, newest first
  contact         how to reach me
  resume          download the résumé
  theme <mode>    day | night | dark
  clear           clear the screen`}
          </>
        );
      case "whoami":
        return (
          <>
            {`${P.identity.fullName} — ${P.identity.roles[0]}\n${P.identity.location}\n`}
            <span className="t-dim">{P.identity.intro}</span>
          </>
        );
      case "ls":
        return P.projects.map((p) => (
          <span key={p.id}>
            <span className="t-cmd">{p.id.padEnd(28)}</span>
            {p.tagline}
            {"\n"}
          </span>
        ));
      case "skills":
        return Object.entries(P.skills).map(([g, s]) => (
          <span key={g}>
            <span className="t-ok">{g}:</span> {s.join(", ")}
            {"\n"}
          </span>
        ));
      case "experience":
        return [...P.journey].reverse().map((j) => (
          <span key={j.date}>
            <span className="t-cmd">{j.date}</span> {j.title} @ {j.org}
            {"\n"}
          </span>
        ));
      case "contact":
        return (
          <>
            {"email  "}<a href={`mailto:${P.conversion.email}`}>{P.conversion.email}</a>
            {"\nphone  "}<a href={P.conversion.phoneHref}>{P.conversion.phone}</a>
            {P.socials.map((s) => (
              <span key={s.network}>
                {`\n${s.network.toLowerCase().padEnd(9)}`}
                <a href={s.url} {...EXT}>{s.url}</a>
              </span>
            ))}
          </>
        );
      case "resume": {
        const a = document.createElement("a");
        a.href = P.identity.resumeUrl;
        a.download = "";
        a.click();
        return <span className="t-ok">Downloading résumé…</span>;
      }
      case "date":
        return new Date().toString();
      case "clear":
        return "clear";
      case "echo":
        return args.join(" ");
      case "sudo":
        if (args.join(" ") === "hire ashwin") {
          open("contact");
          return <span className="t-ok">Permission granted. Opening Contact…</span>;
        }
        return "sudo: nice try.";
      case "theme":
        if (["day", "night", "dark"].includes(args[0])) {
          setTheme(args[0] as Theme);
          return `Theme set to ${args[0]}.`;
        }
        return "usage: theme day|night|dark";
      case "open": {
        const q = (args[0] ?? "").toLowerCase();
        if (!q) return `usage: open <name>\napps: ${APPS.map((a) => a.id).join(", ")}`;
        const app = APPS.find((a) => a.id === q || a.name.toLowerCase().startsWith(q));
        if (app) {
          open(app.id);
          return `Opening ${app.name}…`;
        }
        const p = P.projects.find((x) => x.id.startsWith(q) || x.name.toLowerCase().startsWith(q));
        if (p) {
          open("projects", { project: p.id });
          return `Opening ${p.name}…`;
        }
        return `open: no app or project named "${q}"`;
      }
      default:
        return `zsh: command not found: ${c}. Try "help".`;
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const raw = value.trim();
    setValue("");
    if (!raw) return;
    history.current.push(raw);
    hIdx.current = history.current.length;
    const out = run(raw);
    if (out === "clear") {
      setLines([]);
      return;
    }
    setLines((l) => [...l, <><span className="t-dim">ashwin@os ~ %</span> {raw}</>, out]);
  };

  return (
    <div className="terminal" role="log" aria-label="Terminal" onClick={(e) => !(e.target as Element).closest("a") && inputRef.current?.focus()}>
      <div className="term-out">
        {lines.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
      <form className="term-line" onSubmit={submit}>
        <label className="t-prompt" htmlFor="termIn">ashwin@os ~ %</label>
        <input
          id="termIn"
          ref={inputRef}
          value={value}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            const h = history.current;
            if (e.key === "ArrowUp" && hIdx.current > 0) {
              e.preventDefault();
              setValue(h[--hIdx.current]);
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              hIdx.current = Math.min(h.length, hIdx.current + 1);
              setValue(h[hIdx.current] ?? "");
            }
          }}
        />
      </form>
      <div ref={endRef} />
    </div>
  );
}

/* AshNet browser -------------------------------------------------------- */
const HOME = "ashnet://home";
const NO_FRAME = ["github.com", "linkedin.com", "play.google.com", "apps.apple.com", "google.com"];

export function BrowserApp({ params, navKey, setState }: AppProps) {
  const bookmarks = useMemo(
    () => [
      ...P.projects.map((p) => ({ title: p.name, url: p.links[0].url })),
      ...P.socials.map((s) => ({ title: s.network, url: s.url })),
      { title: "Résumé (PDF)", url: P.identity.resumeUrl }
    ],
    []
  );
  const [hist, setHist] = useState({ list: [params.url ?? HOME], pos: 0 });
  const [reloadKey, setReloadKey] = useState(0);
  const url = hist.list[hist.pos];
  const [addr, setAddr] = useState(url);

  const nav = (raw: string) => {
    let u = raw.trim();
    if (!u) return;
    if (u !== HOME && !/^(https?:|\/)/.test(u)) u = "https://" + u;
    setHist((h) => ({ list: [...h.list.slice(0, h.pos + 1), u], pos: h.pos + 1 }));
  };
  useEffect(() => {
    if (params.url) nav(params.url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navKey]);

  const host = (() => {
    try {
      return new URL(url, window.location.href).hostname.replace(/^www\./, "");
    } catch {
      return "";
    }
  })();
  const blocked = NO_FRAME.some((h) => host === h || host.endsWith("." + h));
  useEffect(() => {
    setAddr(url);
    setState(url === HOME ? "Home" : host || "local file");
  }, [url, host, setState]);

  const openBtn = (
    <a className="btn btn-primary btn-sm" href={url} {...EXT}>
      Open in new tab <Icon name="external" size={14} />
    </a>
  );

  return (
    <div className="browser">
      <div className="br-bar">
        <button type="button" className="icon-btn" aria-label="Back" disabled={hist.pos === 0} onClick={() => setHist((h) => ({ ...h, pos: h.pos - 1 }))}><Icon name="back" /></button>
        <button type="button" className="icon-btn" aria-label="Forward" disabled={hist.pos >= hist.list.length - 1} onClick={() => setHist((h) => ({ ...h, pos: h.pos + 1 }))}><Icon name="fwd" /></button>
        <button type="button" className="icon-btn" aria-label="Refresh" onClick={() => setReloadKey((k) => k + 1)}><Icon name="reload" /></button>
        <button type="button" className="icon-btn" aria-label="Home" onClick={() => nav(HOME)}><Icon name="home" /></button>
        <form onSubmit={(e) => { e.preventDefault(); nav(addr); }}>
          <input type="text" aria-label="Address" spellCheck={false} value={addr} onChange={(e) => setAddr(e.target.value)} />
        </form>
      </div>
      <div className="br-view">
        {url === HOME ? (
          <>
            <h2>AshNet</h2>
            <p className="lede">Bookmarks for everything public about my work.</p>
            <div className="bookmarks">
              {bookmarks.map((b) => (
                <button key={b.url} type="button" className="bookmark" onClick={() => nav(b.url)}>
                  <b>{b.title}</b>
                  <span>{b.url.replace(/^https?:\/\//, "")}</span>
                </button>
              ))}
            </div>
          </>
        ) : blocked ? (
          <>
            <h2>{host}</h2>
            <p className="lede">This site doesn&apos;t allow other pages to embed it (its security headers block framing), so AshNet can&apos;t show it inline.</p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 14, wordBreak: "break-all" }}>{url}</p>
            {openBtn}
          </>
        ) : (
          <>
            <div className="br-note">
              <span>Some sites refuse to load inside frames. If the page stays blank, open it in a new tab.</span>
              {openBtn}
            </div>
            <iframe key={`${url}-${reloadKey}`} src={url} title={url} loading="lazy" referrerPolicy="no-referrer" sandbox="allow-scripts allow-same-origin allow-popups allow-downloads" />
          </>
        )}
      </div>
    </div>
  );
}

/* Whiteboard ------------------------------------------------------------ */
const COLORS = ["#ffe58a", "#ffc2d1", "#b9e6ff", "#c8f2c2", "#e0d1ff"];
const MAX_NOTE = 240;
interface Note { id: number; text: string; color: string; x: number; y: number }

function Sticky({ note, board, onChange, onDelete }: { note: Note; board: React.RefObject<HTMLDivElement | null>; onChange: (n: Note, persist?: boolean) => void; onDelete: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const s = useRef<{ x: number; y: number; l: number; t: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  return (
    <div ref={ref} className={`sticky${dragging ? " dragging" : ""}`} style={{ background: note.color, left: note.x, top: note.y }}>
      <div
        className="grip"
        title="Drag to move"
        aria-hidden="true"
        onPointerDown={(e) => {
          s.current = { x: e.clientX, y: e.clientY, l: note.x, t: note.y };
          e.currentTarget.setPointerCapture(e.pointerId);
          setDragging(true);
        }}
        onPointerMove={(e) => {
          const d = s.current;
          const b = board.current;
          const el = ref.current;
          if (!d || !b || !el) return;
          onChange({ ...note, x: clamp(d.l + e.clientX - d.x, 0, b.clientWidth - el.offsetWidth), y: clamp(d.t + e.clientY - d.y, 0, b.clientHeight - el.offsetHeight) }, false);
        }}
        onPointerUp={() => {
          s.current = null;
          setDragging(false);
          onChange(note, true);
        }}
        onPointerCancel={() => {
          s.current = null;
          setDragging(false);
        }}
      />
      <button type="button" className="del" aria-label="Delete note" onClick={onDelete}>×</button>
      <textarea maxLength={MAX_NOTE} aria-label="Note" value={note.text} onChange={(e) => onChange({ ...note, text: e.target.value.slice(0, MAX_NOTE) })} />
    </div>
  );
}

export function WhiteboardApp({ setState }: AppProps) {
  const { open, companion } = useOS();
  const [notes, setNotes] = useState<Note[]>([]);
  const [color, setColor] = useState(COLORS[0]);
  const [text, setText] = useState("");
  const [armed, setArmed] = useState(false);
  const board = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    const raw = store.get<unknown>(KEYS.whiteboard, []);
    const list = Array.isArray(raw) ? raw : [];
    setNotes(
      list
        .filter((n): n is Note => !!n && typeof n === "object" && typeof (n as Note).text === "string")
        .map((n) => ({ ...n, text: n.text.slice(0, MAX_NOTE), x: Number(n.x) || 0, y: Number(n.y) || 0 }))
    );
    loaded.current = true;
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, []);

  const persist = (list: Note[]) => store.set(KEYS.whiteboard, list);
  useEffect(() => {
    setState(`${notes.length} notes`);
  }, [notes.length, setState]);

  const update = (n: Note, save = true) =>
    setNotes((list) => {
      const next = list.map((x) => (x.id === n.id ? n : x));
      if (save) persist(next);
      return next;
    });

  const add = (e: FormEvent) => {
    e.preventDefault();
    const t = text.trim().slice(0, MAX_NOTE);
    if (!t) {
      inputRef.current?.focus();
      return;
    }
    const w = Math.max(200, board.current?.clientWidth ?? 400);
    const h = Math.max(200, board.current?.clientHeight ?? 380);
    const n: Note = { id: Date.now(), text: t, color, x: Math.round(Math.random() * Math.max(0, w - 180)), y: Math.round(Math.random() * Math.max(0, h - 150)) };
    setNotes((list) => {
      const next = [...list, n];
      persist(next);
      return next;
    });
    setText("");
    companion.react("excited", 1800);
  };

  useEffect(() => {
    if (!armed) return;
    const t = window.setTimeout(() => setArmed(false), 3000);
    return () => window.clearTimeout(t);
  }, [armed]);

  return (
    <>
      <form className="wb-tools" onSubmit={add}>
        <input ref={inputRef} type="text" maxLength={MAX_NOTE} placeholder="Write a note…" aria-label="Sticky note text" value={text} onChange={(e) => setText(e.target.value)} />
        <div className="swatches" role="radiogroup" aria-label="Note colour">
          {COLORS.map((c, i) => (
            <button key={c} type="button" className="swatch" role="radio" aria-checked={c === color} aria-label={`Colour ${i + 1}`} style={{ background: c }} onClick={() => setColor(c)} />
          ))}
        </div>
        <button type="submit" className="btn btn-primary btn-sm">Add Sticky</button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => {
            if (!armed) {
              setArmed(true);
              return;
            }
            setNotes([]);
            persist([]);
            setArmed(false);
          }}
        >
          {armed ? "Click again to clear" : "Clear board"}
        </button>
      </form>
      <p className="wb-note-hint">
        Notes are saved only in this browser. Ashwin won&apos;t see them. To send him a message, use{" "}
        <button type="button" className="link-btn" onClick={(e) => open("contact", {}, e.currentTarget)}>Contact</button>.
      </p>
      <div className="board" aria-label="Whiteboard" ref={board}>
        {notes.map((n) => (
          <Sticky
            key={n.id}
            note={n}
            board={board}
            onChange={update}
            onDelete={() => {
              setNotes((list) => {
                const next = list.filter((x) => x.id !== n.id);
                persist(next);
                return next;
              });
              companion.react("sad", 2200);
            }}
          />
        ))}
      </div>
    </>
  );
}

/* Contact --------------------------------------------------------------- */
export function ContactApp({ setState }: AppProps) {
  const { companion } = useOS();
  const c = P.conversion;
  const [copyMsg, setCopyMsg] = useState("Click to copy");
  const [msg, setMsg] = useState<ReactNode>(null);
  useEffect(() => {
    setState("Replies by email");
  }, [setState]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(c.email);
      setCopyMsg("Copied ✓");
    } catch {
      setCopyMsg("Copy failed. Select the address above.");
    }
    window.setTimeout(() => setCopyMsg("Click to copy"), 2500);
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (d.company_website) return; // honeypot
    if (!d.name?.trim() || !/^\S+@\S+\.\S+$/.test(d.email?.trim() ?? "")) {
      setMsg("Please add your name and a valid email address.");
      companion.react("sad", 2000);
      return;
    }
    const body = [
      `Name: ${d.name}`, `Email: ${d.email}`, `Need: ${d.build}`, `Timeline: ${d.timeline || "-"}`,
      "", "Context:", d.context || "-", "", "Success looks like:", d.success || "-"
    ].join("\n");
    window.location.href = `mailto:${c.email}?subject=${encodeURIComponent(`Project brief from ${d.name}`)}&body=${encodeURIComponent(body)}`;
    setMsg(
      <>
        Your email app should open with the brief ready to send. If it didn&apos;t, email <a href={`mailto:${c.email}`}>{c.email}</a> directly.
      </>
    );
    companion.react("excited", 3000);
  };

  return (
    <>
      <h2>Let&apos;s build your app</h2>
      <p className="lede">Hiring for a mobile role, or need a Flutter or Android app built? Reach me directly.</p>
      <div className="contact-grid">
        <button type="button" className="contact-card" onClick={copy}>
          <b>Email</b>
          <span>{c.email}</span>
          <span>{copyMsg}</span>
        </button>
        <a className="contact-card" href={c.phoneHref}>
          <b>Call</b>
          <span>{c.phone}</span>
          <span>Nepal Time (UTC+5:45)</span>
        </a>
        <a className="contact-card" href={P.identity.resumeUrl} download>
          <b>Résumé</b>
          <span>PDF, 3 pages</span>
        </a>
      </div>
      <h3>What I can help with</h3>
      <ul className="services">{P.services.map((s) => <li key={s}>{s}</li>)}</ul>
      <h3 style={{ marginTop: 18 }}>Send a project brief</h3>
      <form className="form" noValidate onSubmit={submit}>
        <div className="row">
          <label>Name<input name="name" required autoComplete="name" /></label>
          <label>Email<input name="email" type="email" required autoComplete="email" /></label>
        </div>
        <div className="row">
          <label>
            What do you need?
            <select name="build">
              {P.services.map((s) => <option key={s}>{s}</option>)}
              <option>Full-time or contract role</option>
              <option>Something else</option>
            </select>
          </label>
          <label>Timeline<input name="timeline" placeholder="e.g. 3 months" /></label>
        </div>
        <label>Current stack or context<textarea name="context" placeholder="What exists today? Any back end, designs, store accounts?" /></label>
        <label>What does success look like?<input name="success" placeholder="e.g. App live on both stores by March" /></label>
        <div className="hp" aria-hidden="true">
          <label>Leave this empty<input name="company_website" tabIndex={-1} autoComplete="off" /></label>
        </div>
        <div><button type="submit" className="btn btn-primary">Open in my email app</button></div>
        {msg ? <div className="form-msg" role="status">{msg}</div> : null}
      </form>
      <p className="disclosure">This form doesn&apos;t store anything. It opens your email app with the brief filled in, addressed to {c.email}.</p>
    </>
  );
}
