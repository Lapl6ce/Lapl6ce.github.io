# Owner to-do

Everything here is marked `TODO(owner)` in the code (`grep -rn "TODO(owner)" src`).
Placeholders show on the live page as they are, so fill them in before deploying.

With `npm run dev`, dashed text on `/` can be edited in place. Click it, type, then
press **save** (or Ctrl+Enter), and the text is written into `src/content/site.ts`.
A panel in the bottom-left corner lists what's left. Both exist only on the dev server.
Delete `src/professional/owner/`, `src/app/api/owner-save/` and the `dev.ts`
branch in `next.config.ts` once you no longer need them.

## Text: `src/content/site.ts`

| Field | What to write |
| --- | --- |
| `summary` | One or two sentences in your own words: what you build and one concrete example. Also used as the page's meta description and link-preview text. |
| `now` | What you're working on or learning right now, one line. Shown in the hero as `now: ...`. |
| `contactNote` | One line on what you're looking for and how to reach you. |
| `about[0]` | Paragraph 1: who you are and what you like building, in your own voice. |
| `about[1]` | Paragraph 2: the AKD Jewelers work and what was hard about it. |
| `about[2]` | Paragraph 3: something outside code that matters to you. |
| Dagina Designs `caseStudy.problem` | What needed solving, for whom, and why it mattered. |
| Dagina Designs `caseStudy.approach` | What you built and the key decisions. |
| Dagina Designs `caseStudy.whatBroke` | The hardest bug or failure and how you fixed it. |
| Dagina Designs `caseStudy.result` | What changed for the users, with numbers if you have them. |
| Sync System `caseStudy.problem` | As above. |
| Sync System `caseStudy.approach` | As above. |
| Sync System `caseStudy.whatBroke` | As above. |
| Sync System `caseStudy.result` | As above. |
| thrift_feed `caseStudy.problem` | As above. |
| thrift_feed `caseStudy.approach` | As above. |
| thrift_feed `caseStudy.whatBroke` | As above. |
| thrift_feed `caseStudy.result` | As above. |

`summary`, `about` and `contactNote` also appear in fun mode (`/play`) and in the
backtick terminal's `about` command.

### Keep or cut (comments in `site.ts`)

These have no link or image to show. Keep them, or delete the entry.

- Project "Physics Extended Essay"
- `also` (the line under Leadership)

### Previous text, for reference

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

## Images: `public/`

Drop each file at its path. The page switches from the IMAGE NEEDED box to the
picture on the next build (or on reload under `npm run dev`). No code change is needed.

| Path | Size | Used for |
| --- | --- | --- |
| `public/assets/previews/sync-system.jpg` | 1600×1000 JPG, 16:10 | Sync System project card |
| `public/assets/previews/sync-dashboard.jpg` | 1600×1000 JPG, 16:10 | Sync System case study |
| `public/assets/previews/dagina-case.jpg` | 1600×1000 JPG, 16:10 | Dagina Designs case study |
| `public/assets/photo.jpeg` | 800×800 JPG, square | About photo. Done. |

Keep each image around 100–150 KB.
