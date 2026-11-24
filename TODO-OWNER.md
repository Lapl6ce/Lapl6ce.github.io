# Owner to-do

Everything here is marked `TODO(owner)` in the code (`grep -rn "TODO(owner)" src`).
The dev server shows placeholders on the page; demo builds hide or replace them (see below).

With `npm run dev`, dashed text on `/` can be edited in place. Click it, type, then
press **save** (or Ctrl+Enter), and the text is written into `src/content/site.ts`.
A panel in the bottom-left corner lists what's left. Both exist only on the dev server.
Delete `src/professional/owner/`, `src/app/api/owner-save/` and the `dev.ts`
branch in `next.config.ts` once you no longer need them.

## Everything still waiting on you

Every row is a `TODO(owner)` in `src/content/site.ts` (or a missing file under `public/`).
On the dev server the placeholders show on the page; in a demo build the short ones
(years, bullets, "My part", flow steps) are left out and the long ones fall back to the
earlier wording below, so nothing raw reaches the live site.

| Group | Where | What to write or provide |
| --- | --- | --- |
| Text | `summary` (site.ts:134) | One or two sentences in your own words: what you build and one concrete example. Also the page's meta description and link preview. |
| Text | `now` (site.ts:135) | What you're working on or learning right now, one line. Shown under the summary as "Now …". |
| Text | `contactNote` (site.ts:139) | One line on what you're looking for and how to reach you. |
| Text | `about[0]` (site.ts:143) | Who you are and what you like building, in your own voice. |
| Text | `about[1]` (site.ts:144) | The AKD Jewelers work and what was hard about it. |
| Text | `about[2]` (site.ts:145) | Something outside code that matters to you. |
| Text | York University `points[0]` (site.ts:181) | Relevant courses. |
| Text | Sync System `flow` (comment at site.ts:205) | The real steps of the sync, e.g. signature check, queue/retry, plugin call. The current four steps come from the description. |
| Text | Sync System `caseStudy` (site.ts:210–213) | Problem / approach / what broke / result. |
| Text | Dagina Designs `caseStudy` (site.ts:229–232) | Problem / approach / what broke / result. |
| Text | thrift_feed `caseStudy` (site.ts:265–268) | Problem / approach / what broke / result. |
| Text | Neighbor `myPart` (site.ts:250) | What you personally built; the repo is razoring's. Shown as "My part:". |
| Text | AI 3D Asset Generator `myPart` (site.ts:325) | What you personally built; the repo is anthskti's. Shown as "My part:". |
| Numbers | AKD Jewelers impact bullet (site.ts:159) | Products/orders synced, webhooks per day, hours saved, error rate: whichever you can stand behind. |
| Numbers | thrift_feed `year` (site.ts:254) | Year built. |
| Numbers | Vaie `year` (site.ts:274) | Year built. |
| Numbers | University LMS Platform `year` (site.ts:312) | Year built. (The repo's footer says "© 2025 Velvet", if that helps.) |
| Numbers | AI 3D Asset Generator `year` (site.ts:320) | Year built. |
| Links | Sync System, Dagina Designs, thrift_feed, JBCN MUN | Optional: a `links.code` repo URL for any that are public. A code link shows as "Code ↗" in the figure caption. |
| Images | `public/assets/previews/neighbor.jpg` | 1600×1000 JPG, 16:10. Neighbor's figure; the repo has no screenshots, so the flow diagram shows until this exists. |
| Images | `public/assets/previews/sync-system.jpg` | 1600×1000 JPG, 16:10. Sync System figure (the flow diagram shows until then). |
| Images | `public/assets/previews/sync-dashboard.jpg` | 1600×1000 JPG, 16:10. Sync System case study. |
| Images | `public/assets/previews/dagina-case.jpg` | 1600×1000 JPG, 16:10. Dagina Designs case study. |
| Decisions | WISE (site.ts, "More projects") | Keep or cut: no link or image to show. |
| Decisions | University LMS Platform | No screenshot added: without its backend the frontend shows a broken logo and placeholder grades. Add a real screenshot (`preview`), or leave it as a text row. |
| Decisions | AI 3D Asset Generator | No screenshot: the repo has no images or demo. Same choice as above. |

Done in this pass: `public/assets/previews/vaie.jpg` (three screens from the Vaie repo's
Media folder), `public/assets/photo.jpg`, and the thrift_feed case-study images.

Keep each image around 100–150 KB. Drop a file at its path and the page picks it up on the
next build (or on reload under `npm run dev`); no code change is needed.

## Previous text, for reference

The placeholders replaced this text. It's here in case you want to reuse any of the facts.

- **summary:** Second-year Computer Science student at York University and freelance
  full-stack developer. I build web applications, API integrations and automation that
  help businesses run more reliably.
- **contactNote:** Open to software development internships and freelance work. Email is
  the fastest way to reach me.
- **about[0]:** I'm a second-year Computer Science student at York University in Toronto,
  and I freelance as a full-stack developer. I work mostly in Java, Python and TypeScript,
  with React, Node.js and Next.js on the web side, and I'm currently learning Rust.
- **about[1]:** My main client right now is AKD Jewelers, a retailer in Mumbai. I built the
  Shopify–WordPress sync that keeps inventory and orders consistent across their two sites,
  plus a custom Shopify dashboard so non-technical staff can monitor it. I'm now building
  them a lightweight CRM.
- **about[2]:** Before York, I completed the IB Diploma at JBCN International School in
  Mumbai on a full-tuition scholarship. Outside of code I've founded a STEAM club, served
  as Cultural Captain, finished the Tata Mumbai Marathon 10 km, and won a national online
  debate final.
