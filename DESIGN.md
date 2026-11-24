---
name: Ebrahim Daginawala — professional site
description: Cold paper, blue pen. A student's work shown plainly, with confidence.
colors:
  paper: "#eef1f4"
  paper-deep: "#e2e7ec"
  ink: "#0b0e11"
  ink-soft: "#3b444e"
  ink-faint: "#5a6470"
  hairline: "#c3cad2"
  ballpoint: "#1b33c2"
  ballpoint-deep: "#0f2190"
  signal: "#b3261e"
  night-paper: "#0c0f13"
  night-paper-deep: "#141920"
  night-ink: "#e3e7eb"
  night-ink-soft: "#a6b0bb"
  night-ink-faint: "#8692a0"
  night-hairline: "#2a323b"
  night-ballpoint: "#8a9cff"
  night-signal: "#ff7b6e"
typography:
  display:
    fontFamily: "'Nunito Sans', ui-sans-serif, sans-serif"
    fontSize: "clamp(3rem, 8vw, 6rem)"
    fontWeight: 800
    fontVariation: "'wdth' 125"
    lineHeight: 0.92
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Nunito Sans', ui-sans-serif, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 750
    fontVariation: "'wdth' 118"
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  title:
    fontFamily: "'Nunito Sans', ui-sans-serif, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 650
    fontVariation: "'wdth' 105"
    lineHeight: 1.2
  lead:
    fontFamily: "'Nunito Sans', ui-sans-serif, sans-serif"
    fontSize: "1.3125rem"
    fontWeight: 400
    fontVariation: "'wdth' 100"
    lineHeight: 1.45
  body:
    fontFamily: "'Nunito Sans', ui-sans-serif, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    fontVariation: "'wdth' 100"
    lineHeight: 1.6
  note:
    fontFamily: "'Nunito Sans', ui-sans-serif, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    fontVariation: "'wdth' 90"
    lineHeight: 1.45
  data:
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
    fontFeature: "'tnum' 1, 'zero' 1"
rounded:
  none: "0px"
  hair: "2px"
spacing:
  "1": "4px"
  "2": "8px"
  "3": "12px"
  "4": "16px"
  "5": "24px"
  "6": "32px"
  "7": "48px"
  "8": "72px"
  "9": "112px"
  "10": "160px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.ballpoint}"
    textColor: "{colors.paper}"
  link:
    textColor: "{colors.ballpoint}"
  link-hover:
    textColor: "{colors.ballpoint-deep}"
  nav-link:
    textColor: "{colors.ink-soft}"
    typography: "{typography.note}"
  nav-link-current:
    textColor: "{colors.ink}"
  figure:
    backgroundColor: "{colors.paper-deep}"
    rounded: "{rounded.none}"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "10px 12px"
  kbd:
    backgroundColor: "{colors.paper-deep}"
    textColor: "{colors.ink-soft}"
    typography: "{typography.data}"
    rounded: "{rounded.hair}"
    padding: "1px 5px"
---

# DESIGN.md — professional site (`/`)

Scope: the professional site under `src/app/(professional)`. Fun mode (`/play`) has its own visual world and is out of scope here.

## Overview

**North star: cold paper, blue pen.** Picture a cool white page under fluorescent light, black type set big and sure of itself, and one blue ballpoint that a student used to underline, annotate and link. The page should look like one person made it on purpose. It should not look like an agency or a template made it.

Three words: **confident, cold, student-made.**

- **Confident** means a big type scale with real jumps, one primary action, no hedging copy and no decoration standing in for content. Every fact is said once.
- **Cold** means blue-gray paper, near-black ink and a cool blue accent, with flat surfaces, hard edges and no warm tints, gradients, glows or soft shadows.
- **Student-made** means the work leads: real screenshots, GIFs and hand-drawn diagrams in full colour, captioned like figures in a lab report, plus margin notes in ballpoint blue and a personal voice in the copy. It's honest rather than polished, and narrow and plain like a personal site, not a product site.

Reference points, for spirit and not for copying: zoch.dev (one odd, personal display voice; a narrow column; plain underlined links) and Mithi's hexapod blog (the project's own colourful output is the hero; the chrome stays out of the way).

Anti-references: the previous terminal look (all-mono text, `~/name`, `>` prompts, blinking cursors, `[ bracket ]` buttons, FIGlet names, `-- EOF --`), purple or any gradients, generic cards with icons, a centred hero with two buttons, SaaS landing pages, and glassmorphism.

## Colors

Light ("day") is the default. Dark ("night") follows `prefers-color-scheme` and an optional toggle. Both are cold. Contrast figures are WCAG ratios against `paper` / `paper-deep` (night: `night-paper` / `night-paper-deep`).

| Token | Hex | Role | Contrast |
|---|---|---|---|
| `paper` | `#eef1f4` | Page ground. Cool white, never cream. | — |
| `paper-deep` | `#e2e7ec` | Figure backgrounds, `kbd`, code, the one tinted band per page if any. | — |
| `ink` | `#0b0e11` | Headings, body text, primary button fill, section rules. | 17.1 / 15.6 |
| `ink-soft` | `#3b444e` | Secondary prose: project descriptions, nav links. | 8.7 / 8.0 |
| `ink-faint` | `#5a6470` | Metadata: dates, places, figure captions, stack lines. The floor for text. | 5.3 / 4.8 |
| `hairline` | `#c3cad2` | 1px dividers between list rows. Decorative only, never text. | — |
| `ballpoint` | `#1b33c2` | The only accent: links, margin notes, focus ring, selection, primary-button hover. | 8.1 / 7.3 |
| `ballpoint-deep` | `#0f2190` | Link hover/active. | 11.3 |
| `signal` | `#b3261e` | Form errors only. Never decorative. | 5.8 |

Night mapping: `night-paper #0c0f13`, `night-paper-deep #141920`, `night-ink #e3e7eb` (15.5), `night-ink-soft #a6b0bb` (8.7), `night-ink-faint #8692a0` (6.1), `night-hairline #2a323b`, `night-ballpoint #8a9cff` (7.6), `night-signal #ff7b6e` (7.6).

Rules:
- Use `ballpoint` sparingly. If more than about 5% of a viewport is blue, something is wrong. It marks things a person would mark with a pen: links, notes and the current item.
- No other hues in the UI. Colour comes from the work itself (screenshots, GIFs, the photo), shown at full saturation.
- No gradients, glows or tinted shadows, and no opacity tricks on text. Use the named tokens.
- Theme browser surfaces too: `::selection` is `ballpoint` with `paper` text, `caret-color` is `ballpoint`, and scrollbars use `hairline` on `paper`.

## Typography

**Nunito Sans** (variable, Google Fonts, axes `wght` 200–1000 and `wdth` 75–125) is the only text family. Its rounded, humanist letters soften the cold palette, and its **width axis is the system's voice**:
- expanded and heavy for display and headings (cold, wide, confident, like engineering plates)
- normal width for reading
- slightly condensed for notes and nav

**IBM Plex Mono** is kept, but only for data: dates, version numbers, tech stack lines, figure numbers, `kbd` and code. Mono is never used for prose, headings or buttons.

| Role | Size | Weight / width | Leading | Use |
|---|---|---|---|---|
| `display` | clamp(3rem, 8vw, 6rem) | 800 / 125 | 0.92 | Your name. Once per page. |
| `headline` | 2.25rem (36px) | 750 / 118 | 1.05 | Section headings: Work, Experience, Education, Contact. |
| `title` | 1.375rem (22px) | 650 / 105 | 1.2 | Project names, role titles, button labels. |
| `lead` | 1.3125rem (21px) | 400 / 100 | 1.45 | The one-paragraph intro under the name. |
| `body` | 1.0625rem (17px) | 400 / 100 | 1.6 | All prose. Measure 60–72ch. |
| `note` | 0.9375rem (15px) | 400 / 90 | 1.45 | Everything in the margin column (dates, stacks, skill groups) in `ink-soft`, plus nav, captions' text part, and the stack line under a featured project's title. |
| `data` | 0.8125rem (13px) mono | 400 | 1.5 | `Fig. n` and the small "Now" label. Tabular and slashed-zero numerals. Not used in the margin: people skimming skip small grey mono. |

That's seven sizes, and nothing else is allowed. The steps are deliberately far apart (display → headline is roughly 2.7×, headline → title 1.6×) so the hierarchy reads at a glance.

Rules:
- Headings sit in `ink`, never in caps with letter-spacing, and never with an eyebrow or kicker label above them.
- Every heading gets `text-wrap: balance` and every paragraph `text-wrap: pretty`.
- Margin notes use `note` in `ballpoint`, with italics allowed. They read like pen annotations. Don't use a handwriting font.
- Load fonts with `next/font/google`. Nunito Sans needs `axes: ["wdth"]`.

## Layout

**A notebook page with a margin.** On desktop the content sits in a two-zone grid:

```
| margin 136px | gap 48px | main 680px |   → max 864px, centred in the viewport (tablet: margin 112px, gap 32px)
```

- **The margin** holds what a student writes in the margin: dates, stacks and skill groups, set in `note` `ink-soft` so they read at a glance, aligned to the top of the element they annotate. Featured projects leave it empty: their year is in the caption and their stack under the title.
- **The main column** holds headings, prose, figures and lists. Figures stay inside the main column, so every edge lines up.
- The page block is **centred** in the window, with equal empty space either side on wide screens. That space is never filled with decoration. Inside the block, text stays left-aligned against the margin column.
- **Under 720px**, the margin collapses: dates move above their entry, project notes below their row. There is one column with 20px side padding.

**Spacing scale** (4px base): 4 · 8 · 12 · 16 · 24 · 32 · 48 · 72 · 112 · 160.
- Inside a group (title → meta → description): 4–12.
- Between items in a list: 32–48.
- Above a section heading: 72 desktop / 48 mobile. Below a section heading: 24. Space above a heading is always at least 2× the space below it.
- Between featured projects: 48. Above a subheading inside a section: 48.
- Hero: the name starts 72px from the top. There is no full-viewport hero.

**Page order** (content is owned by `src/content`, not this file): hero (name, a short headline, the summary, a "Now" line, résumé + Email / GitHub / LinkedIn) → Projects (featured, then a ruled list) → Experience → Skills → About (with photo) → Background (Education, then Leadership) → Contact. The nav lists the same sections in the same order. Each fact appears in one place only.

## Elevation & Depth

**Flat. Nothing floats.** There are no shadows anywhere: no soft ones, no hard offset blocks, no glows.

Structure comes from three things only:
1. **Rules**: a 2px `ink` rule starts each section (full main-column width), and 1px `hairline` rules separate list rows.
2. **Ground tone**: `paper-deep` behind figures and code.
3. **Space**: the spacing scale above.

The sticky nav is the only layered element. It sits on `paper` (opaque, no blur) and gains a 1px `hairline` bottom border once the page scrolls.

## Shapes

- **Radius is 0** for everything: buttons, figures, images, inputs and the photo.
- **The only exception** is `kbd` keys, at 2px (`rounded.hair`).
- **Borders** are 1px `ink` around screenshots and inputs, 2px `ink` for section rules, and 1px `hairline` for row dividers. Never use a one-sided accent bar on a box.
- **Images** keep their real aspect ratio. Screenshots are never put in fake browser chrome, never desaturated or tinted, and never cropped into circles or masks.

## Components

**Primary button**: solid `ink` fill, `paper` text, `title` type at 17px, 12px × 20px padding, 0 radius. Hover/focus switches the fill to `ballpoint` (120ms). One per screen at most; on this site that's the résumé. Disabled is `ink-faint` fill with no hover.

**Links (the default action)**: `ballpoint`, with an underline that is always visible: 1px thick, 3px offset. Hover: `ballpoint-deep` and a 2px underline. External links get a small drawn ↗ SVG icon (1.5px stroke), not a Unicode glyph. Secondary actions (email, GitHub, LinkedIn, Upwork) are plain links in a sentence or a short line separated by ` / `. They are never buttons and never chips.

**Nav**: top bar, 56px tall, sticky.
- Left: your name in `title` weight at `wdth` 112, which links to the top.
- Right: section links in `note` type, `ink-soft`, with the current section in `ink` plus a 2px `ink` underline. The "fun mode" link sits last, in `ballpoint`.
- Mobile: the name stays at the left, and the section links become a horizontally scrollable row under it. The links never disappear on mobile.
- Keyboard shortcuts stay, but they are shown on hover as `kbd`, not by underlining letters.

**Figure (replaces cards)**: the work, shown plainly.
- An image, GIF or video in full colour, with a 1px `ink` border on `paper-deep`.
- Below it, a caption: `Fig. 2` in `data`, then, separated by ` · `, the live-site link (or what the figure shows), "Code ↗" when there is a code link, and the year when known.
- ASCII or SVG diagrams you drew yourself are first-class figures, e.g. the Shopify → webhook → WordPress diagram.
- No hover lift, scale or shadow. If the figure links somewhere, the caption carries the link.

**Project entry**:
- **Featured**: a figure at main-column width, then the name in `title`, the stack line in `note` `ink-soft` (`Next.js / Drizzle / Neon Postgres`), one `body` paragraph, and for team projects a "My part:" line.
- **The rest**: rows in a ruled list. Name in `title` (ink, with a quiet underline and a blue arrow when it links), one sentence in `ink-soft`, and the year over the stack in the margin. No tech chips, no `./` prefixes, no repeated "Code ↗" button. The name itself is the link.

**Experience / education entry**: the role in `title`; the organisation and place in `body` `ink-soft`. Dates go in the margin as `note` `ink-soft`. Two to three bullets at most, using a plain en dash, and no tree-drawing characters.

**Margin note**: `note` in `ballpoint`, optionally italic, at most about 12 words. Use one or two per section at most. They carry personal asides ("first paid project", "still learning Rust"), never facts that belong in the main text.

**Forms** (owner settings, any future contact form):
- Labels sit above the field in `note` `ink-soft`.
- Inputs have a 1px `ink` border, 0 radius, a `paper` fill and `body` type, with 10px × 12px padding.
- Focus: a 2px `ballpoint` outline at 2px offset; the border stays.
- Errors: a `signal` border, with a `note` message in `signal` below that names the problem and the fix.
- Placeholder text uses `ink-faint`.

**Focus ring (global)**: `outline: 2px solid ballpoint; outline-offset: 2px`. It is never removed.

## Motion

Motion is cold too: quick, exact, rare.

- **One authored moment.** On first load the name's width axis opens from `wdth 75` to `wdth 125` over 700ms with `cubic-bezier(0.16, 1, 0.3, 1)`, like a label being stretched to its full width. The name is fully legible at frame 0. It plays once per session.
- **State changes**: colour and underline transitions at 120ms ease-out. That's it.
- **No** scroll-triggered reveals, fade-ups, parallax, typing effects, blinking cursors, hover lifts or animated gradients. Content is visible by default.
- GIFs and videos of your projects are the motion on this page. Videos autoplay muted and looping only when they are under about 8 seconds, and get a pause control.
- `prefers-reduced-motion: reduce` removes the name animation and pauses autoplay videos on their first frame.

## Do's and Don'ts

**Do**
- Let the work carry the colour: full-saturation screenshots, GIFs and the real photo.
- Use the width axis for hierarchy: expanded for headings, normal for reading.
- Caption figures like a lab report. Put dates and asides in the margin.
- Say each fact once. Cut repeated bios, repeated client mentions and filler projects.
- Write in your own voice, plainly. A slightly informal line is fine.
- Theme selection, caret, focus and scrollbars from the palette.

**Don't**
- Use monospace for prose, headings or buttons. Mono is for data.
- Use terminal costume: `~/`, `>` prompts, cursors, `[ brackets ]`, `./`, `cfg` boxes, `EOF`, FIGlet names.
- Use purple, gradients, glass, glows or any shadow.
- Build generic cards with icons, rows of equal cards, or tech-stack chips.
- Use a centred hero with two buttons, or more than one filled button on a screen.
- Put screenshots in fake browser frames, or make them grayscale, tinted or masked.
- Lay projects out in a zigzag of alternating image and text.
- Put eyebrow labels, uppercase tracked section labels or `01 / 02` numbering above headings.
- Add scroll animations, or any motion besides the one name moment and state changes.
- Use font sizes outside the seven roles above.
