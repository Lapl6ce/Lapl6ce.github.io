/* File writes behind the dev-only routes in src/app/api/owner-*: text edited in
   the page goes into site.ts, and the /settings switches go into settings.json.
   Text is swapped one string literal for another rather than by parsing the
   file, so the original must appear exactly once as a plain double-quoted
   literal (which every TODO(owner) placeholder is). */

import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const CONTENT = join(process.cwd(), "src/content");

/** Rejects anything but a same-origin JSON POST; returns the error response, or null if the request may proceed. */
export function rejectRequest(req: Request): Response | null {
  // Requiring JSON forces a CORS preflight on cross-site requests, which these
  // routes never answer; the origin check covers browsers that skip it.
  const origin = req.headers.get("origin");
  if (req.headers.get("content-type") !== "application/json") return new Response("Expected JSON.", { status: 415 });
  if (origin && new URL(origin).host !== req.headers.get("host")) return new Response("Wrong origin.", { status: 403 });
  return null;
}

/** Replaces the literal `from` with `to` in site.ts; returns an error message, or null on success. */
export async function saveOwnerText(from: string, to: string): Promise<string | null> {
  const text = to.replace(/\s+/g, " ").trim(); // each field is one line or one paragraph
  if (!text) return "Nothing to save: the text is empty.";
  const file = join(CONTENT, "site.ts");
  const src = await readFile(file, "utf8");
  const needle = JSON.stringify(from);
  const at = src.indexOf(needle);
  if (at < 0 || src.includes(needle, at + 1)) {
    return "Couldn't find exactly one copy of the original text in site.ts. Edit it there by hand.";
  }
  await writeFile(file, src.slice(0, at) + JSON.stringify(text) + src.slice(at + needle.length));
  return null;
}

export type Settings = { demoMode: boolean; previewInDev: boolean };

/** Writes settings.json; returns an error message, or null on success. */
export async function saveSettings(input: unknown): Promise<string | null> {
  const { demoMode, previewInDev } = (input ?? {}) as Partial<Record<keyof Settings, unknown>>;
  if (typeof demoMode !== "boolean" || typeof previewInDev !== "boolean") return "Expected { demoMode, previewInDev } booleans.";
  const settings: Settings = { demoMode, previewInDev };
  await writeFile(join(CONTENT, "settings.json"), JSON.stringify(settings, null, 2) + "\n");
  return null;
}
