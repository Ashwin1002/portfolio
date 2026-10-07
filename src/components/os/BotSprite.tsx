/* Bit: an original two-legged desktop companion. Faces are toggled by the
   parent's data-state attribute (see .companion rules in globals.css). */
export function BotSprite() {
  const ink = "#1b1f2a";
  const shell = "#e8e3d8";
  return (
    <svg viewBox="0 0 72 86" aria-hidden="true" focusable="false">
      <g className="bot-body">
        <line x1="36" y1="14" x2="36" y2="6" stroke={ink} strokeWidth="2.5" strokeLinecap="round" />
        <circle className="antenna-tip" cx="36" cy="5" r="3.6" fill="#4ea8ff" stroke={ink} strokeWidth="2" />
        <rect x="23" y="60" width="8" height="13" rx="4" fill={shell} stroke={ink} strokeWidth="2.4" />
        <rect x="41" y="60" width="8" height="13" rx="4" fill={shell} stroke={ink} strokeWidth="2.4" />
        <ellipse cx="26" cy="75" rx="6.5" ry="3.6" fill="#7a4dff" stroke={ink} strokeWidth="2.2" />
        <ellipse cx="46" cy="75" rx="6.5" ry="3.6" fill="#7a4dff" stroke={ink} strokeWidth="2.2" />
        <rect x="5" y="34" width="8" height="14" rx="4" fill={shell} stroke={ink} strokeWidth="2.4" />
        <rect x="59" y="34" width="8" height="14" rx="4" fill={shell} stroke={ink} strokeWidth="2.4" />
        <rect x="10" y="14" width="52" height="48" rx="19" fill="#fbf8f1" stroke={ink} strokeWidth="2.6" />
        <rect x="16.5" y="21" width="39" height="30" rx="11" fill="#1b2233" />
        <circle cx="17" cy="54" r="2.6" fill="#ffb3c4" />
        <circle cx="55" cy="54" r="2.6" fill="#ffb3c4" />
        <g fill="#7ee2ff" stroke="#7ee2ff" strokeLinecap="round" strokeWidth="2.4">
          <g className="face face-idle">
            <rect className="eye" x="25.5" y="30" width="5" height="9" rx="2.5" stroke="none" />
            <rect className="eye" x="41.5" y="30" width="5" height="9" rx="2.5" stroke="none" />
            <path d="M33 44h6" fill="none" />
          </g>
          <g className="face face-happy" fill="none">
            <path d="M24.5 36q3.5-5 7 0M40.5 36q3.5-5 7 0" />
            <path d="M31 41.5q5 4.5 10 0" />
          </g>
          <g className="face face-sad" fill="none">
            <path d="M25 31l6 2.5M47 31l-6 2.5" />
            <circle cx="28" cy="37" r="1.6" fill="#7ee2ff" />
            <circle cx="44" cy="37" r="1.6" fill="#7ee2ff" />
            <path d="M31 46q5-4 10 0" />
          </g>
          <g className="face face-excited">
            <circle cx="28" cy="34" r="4.6" stroke="none" />
            <circle cx="44" cy="34" r="4.6" stroke="none" />
            <circle cx="29.5" cy="32.5" r="1.4" fill="#1b2233" stroke="none" />
            <circle cx="45.5" cy="32.5" r="1.4" fill="#1b2233" stroke="none" />
            <ellipse cx="36" cy="44" rx="3.6" ry="2.8" stroke="none" />
          </g>
          <g className="face face-sleeping" fill="none">
            <path d="M24.5 35q3.5 2.5 7 0M40.5 35q3.5 2.5 7 0" />
            <path d="M34 44h4" />
          </g>
        </g>
        <text className="zzz" x="58" y="12" fontFamily="var(--font-mono), monospace" fontSize="11" fontWeight="700" fill="#7a4dff">
          z
          <tspan dx="1" dy="-5" fontSize="8">
            z
          </tspan>
        </text>
      </g>
    </svg>
  );
}

/* Static mark for the system bar and boot screen: always shows the idle face. */
export function BotMark({ className }: { className?: string }) {
  return (
    <span className={`companion-mark ${className ?? ""}`} data-state="idle" aria-hidden="true">
      <BotSprite />
    </span>
  );
}
