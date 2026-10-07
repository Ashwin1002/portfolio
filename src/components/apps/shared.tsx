import type { CSSProperties } from "react";
import type { Project } from "@/content/profile";
import { Icon, iconMarkup } from "@/lib/icons";

export const EXT = { target: "_blank", rel: "noreferrer noopener" } as const;

/* One consistent illustration grammar for every project cover. */
export function CaseArt({ p }: { p: Project }) {
  const h = p.hue;
  const g = `g-${p.id}`;
  return (
    <div
      className="case-art"
      style={{ "--h": h } as CSSProperties}
      role="img"
      aria-label={`Illustration for ${p.name}: a phone showing an abstract ${p.category.toLowerCase()} interface`}
    >
      <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={`hsl(${h} 80% 64%)`} />
            <stop offset="1" stopColor={`hsl(${h} 70% 42%)`} />
          </linearGradient>
        </defs>
        <circle cx="250" cy="40" r="70" fill={`hsl(${h} 70% 70% / .35)`} />
        <circle cx="60" cy="160" r="60" fill={`hsl(${(h + 40) % 360} 70% 70% / .25)`} />
        <g transform="translate(118 18) rotate(-6)">
          <rect width="84" height="156" rx="16" fill="#1b1f2a" />
          <rect x="5" y="5" width="74" height="146" rx="12" fill="#fbf8f1" />
          <rect x="12" y="16" width="60" height="34" rx="8" fill={`url(#${g})`} />
          <g
            transform="translate(30 21)"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            dangerouslySetInnerHTML={{ __html: iconMarkup(p.glyph) }}
          />
          <rect x="12" y="58" width="42" height="6" rx="3" fill="#1b1f2a" opacity=".75" />
          <rect x="12" y="70" width="60" height="5" rx="2.5" fill="#1b1f2a" opacity=".2" />
          <rect x="12" y="80" width="52" height="5" rx="2.5" fill="#1b1f2a" opacity=".2" />
          <rect x="12" y="94" width="28" height="24" rx="6" fill={`hsl(${h} 70% 88%)`} />
          <rect x="44" y="94" width="28" height="24" rx="6" fill={`hsl(${h} 70% 88%)`} />
          <rect x="12" y="124" width="60" height="16" rx="8" fill={`url(#${g})`} />
        </g>
        <g transform="translate(222 108)">
          <rect width="64" height="40" rx="10" fill="#fbf8f1" stroke="#1b1f2a" strokeWidth="2" />
          <circle cx="16" cy="20" r="7" fill={`url(#${g})`} />
          <rect x="28" y="13" width="26" height="5" rx="2.5" fill="#1b1f2a" opacity=".7" />
          <rect x="28" y="23" width="18" height="4" rx="2" fill="#1b1f2a" opacity=".25" />
        </g>
        <g transform="translate(34 30)">
          <rect width="62" height="30" rx="9" fill="#fbf8f1" stroke="#1b1f2a" strokeWidth="2" />
          <path d="M10 20l8-7 7 5 9-9 8 6 10-6" fill="none" stroke={`hsl(${h} 70% 45%)`} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

export function ExternalLinks({ links, className = "btn btn-secondary btn-sm" }: { links: { label: string; url: string }[]; className?: string }) {
  return (
    <>
      {links.map((l) => (
        <a key={l.url} className={className} href={l.url} {...EXT}>
          {l.label} <Icon name="external" size={14} />
        </a>
      ))}
    </>
  );
}
