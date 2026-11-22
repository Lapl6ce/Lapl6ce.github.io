// Content only fun mode shows; shared content is in src/content/site.ts.

/** extra links in the "Network" category, listed after the profile links */
export const BOOKMARKS: { name: string; url: string; note?: string }[] = [];

/** "System Information" update history, newest first */
export const CHANGELOG: { version: string; date: string; note: string }[] = [
  { version: "4.1", date: "2026-11", note: "Fun mode: project backdrops, ambient music, new menu sounds." },
  { version: "4.0", date: "2026-11", note: "Rebuilt in React with Next.js." },
  { version: "3.1", date: "2026-11", note: "Filled in from résumé; added website previews." },
  { version: "3.0", date: "2026-11", note: "Merged both sites; added XMB mode." },
  { version: "2.0", date: "2026-09", note: "Interactive room experiment." },
  { version: "1.0", date: "2026-07", note: "First single-page version." },
];
