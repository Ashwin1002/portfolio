/* Versioned local-storage keys. Every access is wrapped so a blocked or
   malformed store never breaks the page. */
export const KEYS = {
  theme: "personal-os-theme-v1",
  layout: "personal-os-layout-v1",
  whiteboard: "personal-os-whiteboard-v1",
  companion: "personal-os-companion-v1",
  boot: "personal-os-boot-v1"
} as const;

export const store = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw == null ? fallback : (JSON.parse(raw) as T);
    } catch {
      return fallback;
    }
  },
  set(key: string, value: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable */
    }
  },
  del(key: string) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* storage unavailable */
    }
  }
};

export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export const isDesktop = () => typeof window !== "undefined" && window.matchMedia("(min-width: 900px)").matches;
export const isPhone = () => typeof window !== "undefined" && window.matchMedia("(max-width: 599px)").matches;
export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
