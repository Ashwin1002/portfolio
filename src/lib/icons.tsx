import type { CSSProperties } from "react";

/* One stroke-icon family on a 24px grid. Markup is static and trusted. */
const ICON = {
  projects: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/><path d="M3.5 8v8M20.5 8v8"/>',
  journey: '<circle cx="6" cy="6" r="2"/><circle cx="18" cy="12" r="2"/><circle cx="6" cy="18" r="2"/><path d="M8 6h4a4 4 0 0 1 4 4M16 14a4 4 0 0 1-4 4H8"/>',
  stack: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 12.5l9 5 9-5"/><path d="M3 16.5l9 5 9-5"/>',
  proof: '<path d="M12 2.8l2.4 1.8 3-.2.9 2.9 2.4 1.8-1 2.8 1 2.8-2.4 1.8-.9 2.9-3-.2L12 21.2l-2.4-1.8-3 .2-.9-2.9-2.4-1.8 1-2.8-1-2.8 2.4-1.8.9-2.9 3 .2z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  about: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  finder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  terminal: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M7 9l3 3-3 3M12.5 15H17"/>',
  browser: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18"/>',
  whiteboard: '<path d="M4 4h16v11l-5 5H4z"/><path d="M15 20v-5h5M8 9h8M8 13h5"/>',
  contact: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/>',
  socials: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/>',
  settings: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  pin: '<path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2z"/><path d="M4 20a2 2 0 0 0 2 2h13v-4"/>',
  school: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5"/>',
  pulse: '<path d="M3 12h4l2-6 4 12 2-6h6"/>',
  bag: '<path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  tabs: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M3 11h18M8 7V4h5v3"/>',
  file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>',
  code: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M3 12h18"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  fwd: '<path d="M9 5l7 7-7 7"/>',
  reload: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 5v6h-6"/>',
  home: '<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-5h4v5"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  min: '<path d="M5 12h14"/>',
  max: '<rect x="5" y="5" width="14" height="14" rx="1.5"/>',
  restore: '<rect x="4" y="8" width="12" height="12" rx="1.5"/><path d="M8 8V4h12v12h-4"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>'
} as const;

export type IconName = keyof typeof ICON;
export const iconMarkup = (name: IconName) => ICON[name];

export function Icon({ name, size, style, className }: { name: IconName; size?: number; style?: CSSProperties; className?: string }) {
  const s: CSSProperties = size
    ? { width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", ...style }
    : { ...style };
  return <svg viewBox="0 0 24 24" aria-hidden="true" className={className} style={s} dangerouslySetInnerHTML={{ __html: ICON[name] }} />;
}

export function Tile({ hue, icon, badge, className = "" }: { hue: number; icon: IconName; badge?: string; className?: string }) {
  return (
    <span className={`app-tile ${className}`} style={{ "--h": hue } as CSSProperties}>
      <Icon name={icon} />
      {badge ? <span className="badge">{badge}</span> : null}
    </span>
  );
}
