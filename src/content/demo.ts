/* Demo mode: lets a build go online before the TODO(owner) fields are written.
   Placeholders are swapped for the owner's own earlier wording (from before the
   placeholders went in), so demo mode adds no new claims. Unfinished case
   studies are hidden rather than padded out, and the professional site hides
   IMAGE NEEDED boxes. Switched in /settings under `next dev`, which writes
   settings.json. */

import settings from "./settings.json";
import type { Site } from "./site";

/** Demo applies to builds when switched on, and to `next dev` only as an explicit
 *  preview, so the dev server normally shows the real draft for editing. */
export const DEMO_ACTIVE = settings.demoMode && (process.env.NODE_ENV === "production" || settings.previewInDev);

export const isPlaceholder = (s?: string) => !!s?.startsWith("TODO(owner):");

const DEMO = {
  summary:
    "Second-year Computer Science student at York University and freelance full-stack developer. " +
    "I build web applications, API integrations and automation that help businesses run more reliably.",
  now: "Building a lightweight CRM for AKD Jewelers that tracks customers through the sales pipeline.",
  contactNote: "Open to software development internships and freelance work. Email is the fastest way to reach me.",
  about: [
    "I'm a second-year Computer Science student at York University in Toronto, and I freelance as a " +
      "full-stack developer. I work mostly in Java, Python and TypeScript, with React, Node.js and Next.js " +
      "on the web side, and I'm currently learning Rust.",
    "My main client right now is AKD Jewelers, a retailer in Mumbai. I built the Shopify–WordPress sync " +
      "that keeps inventory and orders consistent across their two sites, plus a custom Shopify dashboard so " +
      "non-technical staff can monitor it. I'm now building them a lightweight CRM.",
    "Before York, I completed the IB Diploma at JBCN International School in Mumbai on a full-tuition " +
      "scholarship. Outside of code I've founded a STEAM club, served as Cultural Captain, finished the " +
      "Tata Mumbai Marathon 10 km, and won a national online debate final.",
  ],
};

/** The site with every unwritten field replaced or hidden. */
export function withDemo(site: Site): Site {
  const pick = (value: string, demo: string) => (isPlaceholder(value) ? demo : value);
  // Short facts (a year, a bullet, a flow step) have no earlier wording to fall
  // back on, so an unwritten one is left out rather than shown as a placeholder.
  const written = (list: string[] = []) => list.filter((x) => !isPlaceholder(x));
  const dropBullets = <T extends { points?: string[] }>(entries: T[]) => entries.map((e) => ({ ...e, points: written(e.points) }));
  return {
    ...site,
    summary: pick(site.summary, DEMO.summary),
    now: site.now && pick(site.now, DEMO.now),
    contactNote: pick(site.contactNote, DEMO.contactNote),
    about: site.about.map((p, i) => pick(p, DEMO.about[i] ?? "")).filter(Boolean),
    experience: dropBullets(site.experience),
    education: dropBullets(site.education),
    leadership: dropBullets(site.leadership),
    projects: site.projects.map((p) => {
      const cs = p.caseStudy;
      const unfinished = cs && [cs.problem, cs.approach, cs.whatBroke, cs.result].some(isPlaceholder);
      return {
        ...p,
        year: isPlaceholder(p.year) ? "" : p.year,
        myPart: isPlaceholder(p.myPart) ? undefined : p.myPart,
        flow: p.flow && written(p.flow),
        caseStudy: unfinished ? undefined : cs,
      };
    }),
  };
}
