# Ebrahim Daginawala: Portfolio

**Live site: https://lapl6ce.github.io**

Personal portfolio of Ebrahim Daginawala, a Computer Science student at York University and freelance
full-stack developer. Next.js (App Router), React and TypeScript, exported as a static site and deployed
to GitHub Pages.

The site has two modes that render the same content:

| Mode | URL | |
|------|-----|-|
| Professional | [/](https://lapl6ce.github.io) | Single-page portfolio. |
| Fun mode | [/play](https://lapl6ce.github.io/play/) | Console-style menu with generated music and sound effects. |

Pressing <kbd>`</kbd> in either mode opens a small terminal (`help` lists its commands).

## Running locally

```bash
npm install
npm run dev        # http://localhost:3000 and http://localhost:3000/play/
npm run build      # static export to out/
npm run typecheck
```

Pushing to `main` deploys via `.github/workflows/deploy.yml`.

## Where things live

```
src/content/site.ts        all portfolio content, shared by both modes
src/app/                   route files only: one root layout per mode
src/professional/          the professional site
  sections/                one component per page section
  components/              pieces used by the sections
  professional.css
src/play/                  fun mode
  Xmb.tsx                  the menu: structure, layout and input handling
  config.ts                content only fun mode uses (changelog, bookmarks)
  bgm.ts                   background music, synthesized with Web Audio
  play.css
src/shared/                terminal, sound effects and link helpers used by both modes
public/assets/             résumé and project screenshots
```

Styles are plain CSS, one stylesheet per mode, with no UI framework.
