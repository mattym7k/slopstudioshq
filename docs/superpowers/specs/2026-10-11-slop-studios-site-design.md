# Slop Studios website – design spec (2026-10-11)

## Goal
A simple, professional one-page marketing site for Slop Studios (game development,
web3 / general software development, AI influencer creation). Must look technologically
capable and visually polished. Will be attached to a custom domain and a Google Workspace
business email later.

## Stack
Static HTML/CSS/JS, no build step. Files: `index.html`, `styles.css`, `script.js`, `favicon.svg`.
Deploy by uploading the folder to Netlify / Cloudflare Pages / Vercel / GitHub Pages.
Can be migrated to Next.js later; markup and styles port directly.
Local preview: `.claude/launch.json` entry "site" runs `npx serve` on port 5173.

## Design read
Creative tech studio landing for prospective clients, dark-tech language, native CSS,
restrained motion. Dials: variance 8, motion 6, density 4.

## Visual system
- Base: zinc near-black (#09090b) with slightly lighter surfaces. One accent only: electric
  cyan (#2dd4e6). No outer glows, no gradient text, no purple.
- Type: Space Grotesk for everything, JetBrains Mono for capability tags only.
- Shape rule: interactive elements are pills, containers are 20px radius, tags 8px.
- Containers use a double-bezel shell (outer hairline tray, inner surface core).
- Motion: scroll reveals via IntersectionObserver, nested-icon button hover, live canvas
  wireframe terrain in the hero that tilts with the pointer. All motion disabled under
  prefers-reduced-motion. Canvas pauses when off screen or tab hidden.

## Copy rules
Plain, direct sentences. No em dashes. One contact label on the whole page: "Start a project".

## Sections
1. Floating pill nav: wordmark, Services / Approach / Contact, "Start a project" mailto.
   Hamburger with full-screen menu below 768px.
2. Hero, split layout: headline "Games, on-chain products, and AI creators." plus a
   one-sentence lead and two CTAs on the left, live wireframe canvas on the right.
3. Services, bento 1+2: Game Development (tall cell with photo, cyan-tinted),
   Web3 & Software Development (accent-tinted cell), AI Influencer Creation (grid-pattern cell).
4. Approach: "How we work." with three plain text columns: Scope, Ship, Automate.
5. Contact band: headline, lead, "Start a project" mailto.
6. Footer: wordmark, email, copyright.

## Placeholders to replace
- `team@slopstudioshq.com` appears in nav, menu, hero, contact, footer. Swap once the
  business email exists.
- Game Development photo is a picsum placeholder. Replace with a real game still,
  1200x750 or larger. The CSS tints any photo toward the accent.

## Out of scope (for now)
About/team, project showcase, contact form, CMS, analytics.
