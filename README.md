# AshwinOS — Portfolio of Ashwin Shrestha

A personal portfolio that works like a small operating system: a desktop with draggable app icons, windows, a dock, a command palette, three themes and a companion robot named Bit. All content comes from Ashwin's résumé.

Built with Next.js 16 (App Router), React 19 and TypeScript, exported as a static site.

## Run locally

```bash
cd ~/Development/ashwin-os-portfolio
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in out/
npm run typecheck
```

## Project layout

```
src/
  app/                layout.tsx (metadata, fonts, JSON-LD), page.tsx, globals.css, icon.svg
  content/profile.ts  all text about Ashwin (typed)
  lib/                apps.ts (app registry), icons.tsx, storage.ts
  components/os/      OSProvider (window manager + theme state), SystemBar, Desktop, Dock,
                      WindowLayer, Boot, Companion (Bit), Palette (search)
  components/apps/    ContentApps.tsx, ToolApps.tsx, shared.tsx
public/               résumé PDF, robots.txt, sitemap.xml
```

## Edit content

All text about Ashwin lives in `src/content/profile.ts`: identity, projects, journey, skills, method, About.txt, daily quotes, socials and services. Change it there; the UI picks it up.

To add a project, add an object to `projects` with a unique `id`, a `hue` (0–360) for its colour and a `glyph` (`pin`, `book`, `school`, `pulse`, `bag`, `tabs`). The project appears in Projects, Live Apps, Case Files, AshNet, the Terminal and Search automatically.

## Apps

| App | What it does |
| --- | --- |
| Projects | Six projects, each with a case page (problem, build, outcome, stack, store links) |
| Live Apps | Every public store and GitHub listing |
| Journey | Timeline from 2017 to now |
| Stack | Skills, and a five-step working method |
| About.txt | Notepad-style note in Ashwin's voice |
| Case Files | Finder with folders by domain, back/forward and search |
| Terminal | `help`, `whoami`, `ls`, `open <name>`, `skills`, `experience`, `contact`, `resume`, `theme <mode>` |
| AshNet | Bookmark browser; explains when a site refuses to be framed |
| Whiteboard | Sticky notes saved in the visitor's browser only |
| Contact | Copy email, call, download résumé, or compose a brief in the visitor's email app |
| Socials | GitHub and LinkedIn |
| Settings | Theme, reset icons, reset Bit, replay boot |

Shortcuts: `⌘K` / `Ctrl K` opens search. `Esc` closes the top window. Double-click Bit to reset its position; arrow keys move Bit when focused.

## Local storage keys

`personal-os-theme-v1`, `personal-os-layout-v1`, `personal-os-whiteboard-v1`, `personal-os-companion-v1`. Malformed values are ignored.

## Deploy

Vercel: import the GitHub repo; no settings needed.
Netlify: connect the repo. `netlify.toml` runs `npm run build`, publishes `out/` and sets security headers.
Any static host works: upload the `out/` folder.

After choosing a domain:

1. Set `NEXT_PUBLIC_SITE_URL=https://your-domain` in the host's environment variables (enables the canonical URL).
2. Set `identity.domain` in `src/content/profile.ts`.
3. Fill in `public/sitemap.xml` and uncomment the sitemap line in `public/robots.txt`.

## Still to decide (TBD)

- Domain and hosting.
- Booking link (Calendly or Cal.com). Without one, the call-to-action opens Contact.
- WhatsApp: left out until Ashwin confirms it should be public.
- A photo or headshot, if Ashwin wants one on the desktop.
- Review the drafted copy: headline, About.txt, the five-step method and the daily quotes were written from the résumé and need Ashwin's approval.
- Testimonials, client names and metrics beyond the résumé: none were supplied, so none are shown.
- A form provider (Netlify Forms, Formspree) if briefs should arrive without the visitor's email app.

## Notes on the build

- Built from a reference prompt for "personal AI operating systems". No reference owner's names, links or assets are used; everything visible comes from `src/content/profile.ts`.
- No image generator was used. App icons, project covers and Bit are original inline SVG.
- No music player, video proof, voice agent, blog or booking ping: there was no approved source material for them.
