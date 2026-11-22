# Ebrahim Daginawala: Portfolio

**Live site: https://lapl6ce.github.io**

Personal portfolio of Ebrahim Daginawala, a Computer Science student at York University and freelance
full-stack developer. Built with Next.js, React and TypeScript, exported as a fully static site, and
deployed to GitHub Pages.

## Two modes, one site

| Mode | Address | Description |
|------|---------|-------------|
| **Classic** | [lapl6ce.github.io](https://lapl6ce.github.io) | A clean, professional single page covering experience, projects, skills, education and contact details. |
| **XMB** | [lapl6ce.github.io/play](https://lapl6ce.github.io/play/) | An experimental interface modelled on handheld-console menus, with animated backgrounds, menu sounds, ambient music and full-screen project backdrops. |

Both modes render from the same content source, so the information always matches. Each mode links to
the other, and their styles are fully separated.

## Features

### Classic mode

- Responsive layout with a wide, multi-column project grid on large screens.
- Project cards with live website previews: clickable browser-window cards showing real screenshots of
  deployed client sites.
- Projects without a live site show a screenshot, a small how-it-works diagram, or a generated cover.
- Subtle click sounds with a mute toggle, and a print stylesheet that turns the page into a one-pager.

### XMB mode

- **Console-style navigation:** a horizontal row of categories with vertical item lists, driven by arrow
  keys, mouse clicks and scrolling, or touch swipes.
- **Project backdrops:** resting on a project fades a full-screen background in behind the menu, in the
  way game consoles display a game's artwork. Screenshots are dimmed and softened to keep the menu
  readable. Projects without one receive generated artwork in a colour derived from the project name.
- **Synthesized audio:** every sound effect is generated at runtime with the Web Audio API, with no audio
  files involved: soft cursor ticks, confirm chimes and a startup swell, all through a shared reverb.
- **Ambient background music:** an original piece generated live in the browser. The music lowers in
  volume while a project backdrop is showing, pauses in background tabs, and can be muted from the top
  bar or the Settings menu.
- **Settings:** colour themes (including one that changes by month), the wave background, sound effects
  and music can each be toggled, and all choices persist between visits.

### Terminal easter egg

Pressing the backtick key (`` ` ``) in either mode opens a small terminal. Typing `help` lists its
commands, which print portfolio details, open the résumé, and switch between the two modes.

## Tech stack

- **Framework:** Next.js (App Router, static export) with React and TypeScript
- **Styling:** hand-written CSS, one stylesheet per mode, with no UI framework
- **Graphics:** HTML canvas for the animated wave and starfield backgrounds
- **Audio:** Web Audio API for all sound effects and the generated music
- **Hosting:** GitHub Pages, deployed by a GitHub Actions workflow on every push to `main`

## Project structure

```
src/content/site.ts               single source of all portfolio content
src/app/(classic)/                classic mode: layout, page and styles
src/app/(xmb)/play/               XMB mode: layout, page and styles
src/components/classic/           website previews, project media, sound toggle, starfield
src/components/xmb/Xmb.tsx        XMB menu: categories, items, panels and input handling
src/components/xmb/Backdrop.tsx   full-screen project backdrops
src/components/xmb/Wave.tsx       animated wave background
src/components/Terminal.tsx       backtick terminal shared by both modes
src/lib/sfx.ts                    synthesized sound effects
src/lib/bgm.ts                    generated background music
public/assets/                    résumé and website screenshots
.github/workflows/deploy.yml      build and deploy pipeline
```

## Running locally

```bash
npm install
npm run dev     # http://localhost:3000 (classic) and http://localhost:3000/play/ (XMB)
npm run build   # static export to out/
```
