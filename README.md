# Ebrahim Daginawala: Portfolio

Personal portfolio of Ebrahim Daginawala, a Computer Science student at York University and freelance
full-stack developer. Built with Next.js and React, exported as a fully static site, and hosted on
GitHub Pages at **https://lapl6ce.github.io**.

The site has two modes that share the same content:

| Mode | URL | Description |
|------|-----|-------------|
| **Classic** | `/` | A clean, professional single page covering experience, projects, skills, education and contact details. This is the default landing page. |
| **XMB** | `/play/` | An experimental interface modelled on handheld-console menus, with animated wave backgrounds, synthesized menu sounds, ambient background music and full-screen project backdrops. |

Each mode links to the other. The two are separate root layouts, so switching between them is a full
page load and their styles never mix.

## Content

All portfolio content (biography, experience, projects, skills, education and links) lives in a single
file, `src/content/site.ts`. Both modes render from that file, so a change there updates the whole site.
Static files such as the résumé PDF and project screenshots live in `public/assets/`.

### Website previews

A project can list live websites under `sites`. Each one renders as a clickable browser-window card
showing a screenshot of the site:

```ts
sites: [{ name: "JBCN MUN", url: "https://jbcnparelmun.com/", image: "/assets/previews/jbcn-mun.jpg" }]
```

Entries with an empty `url` are hidden. An entry without an `image` falls back to a styled placeholder
showing the domain name. Screenshots are stored in `public/assets/previews/` at a 16:10 ratio.

### Project previews

Every project card shows a preview, chosen in this order:

1. a live website from `sites`
2. a screenshot from `preview`
3. a short how-it-works diagram from `flow`
4. a generated cover built from the project name and technologies

## Interface details

### Classic mode

- Responsive layout, with the Projects section widened into a multi-column grid on large screens.
- Quiet click sounds on links and buttons, with a speaker toggle in the navigation bar.
- A print stylesheet, so the page also works as a printed one-pager.

### XMB mode

- **Navigation:** arrow keys, Enter and Escape on a keyboard; click and scroll with a mouse; swipe and
  tap on touch screens. Categories are defined in the `cats` list in `src/components/xmb/Xmb.tsx`.
- **Project backdrops:** resting on a project for a moment fades a full-screen background in behind
  the menu, similar to how game consoles display a game's artwork. Projects with a screenshot use a
  dimmed, softened version of it. Projects without one get generated artwork in a colour derived from
  the project name. Backdrops crossfade between projects (`src/components/xmb/Backdrop.tsx`).
- **Sound effects:** synthesized at runtime with the Web Audio API, with no audio files involved. The
  set includes soft cursor ticks, category clicks, confirm chimes and a startup swell, all passed
  through a shared reverb (`src/lib/sfx.ts`).
- **Background music:** an original ambient piece generated live with the Web Audio API. Custom audio
  tracks can replace it by placing files in `public/assets/audio/` and listing them in `TRACKS` in
  `src/lib/bgm.ts`. The music lowers in volume while a project backdrop is showing, and pauses when the
  browser tab is hidden.
- **Settings:** colour theme, wave background, sound effects and background music can all be toggled
  in the Settings category. A speaker button in the top bar mutes the music directly. All settings
  persist between visits.

### Terminal

Pressing the backtick key (`` ` ``) in either mode opens a small terminal easter egg. Typing `help` lists
its commands, which print portfolio details (`about`, `projects`, `skills`, `contact`), open the résumé,
and switch between the classic and XMB modes.

## Commands

```bash
npm install
npm run dev        # development server: http://localhost:3000 (classic) and /play/ (XMB)
npm run build      # static export to out/
npm run start      # serves out/ locally
npm run typecheck  # TypeScript check
```

## Project structure

```
src/content/site.ts               all portfolio content, plus shared types and helpers
src/app/(classic)/                classic mode: layout (fonts, metadata), page, classic.css
src/app/(xmb)/play/               XMB mode: layout, page, xmb.css
src/lib/sfx.ts                    synthesized sound effects (shared by both modes)
src/lib/bgm.ts                    XMB background music: file playback with a generated ambient fallback
src/components/Terminal.tsx       backtick terminal (shared by both modes)
src/components/classic/           website previews, project media, sound toggle, starfield, hero name
src/components/xmb/Xmb.tsx        the menu: categories, items, panels, keyboard, mouse and touch input
src/components/xmb/Backdrop.tsx   full-screen project backdrops
src/components/xmb/parts.tsx      panel contents, thumbnails and website previews
src/components/xmb/Wave.tsx       animated wave background
src/components/xmb/icons.tsx      menu icons
src/components/xmb/themes.ts      colour themes and persisted settings
.github/workflows/deploy.yml      builds the site and deploys it to GitHub Pages
```

## Deployment

`npm run build` produces a fully static site in `out/`, which any static host can serve.

The repository deploys automatically to GitHub Pages: every push to `main` triggers the workflow in
`.github/workflows/deploy.yml`, which installs dependencies, builds the site and publishes `out/`.
Because the repository is named `Lapl6ce.github.io`, the site is served from the domain root, which the
site's root-relative links (`/play/`, `/assets/...`) rely on.

Other hosts work too: Vercel needs no configuration, and Netlify or Cloudflare Pages need the build
command `npm run build` with the output directory `out`.
