/* Owner's checklist, shown only under `next dev`. Text items come from the
   TODO(owner) lines in site.ts, read from disk on each render, so a saved edit
   drops off the list on reload. Images are ticked once their file exists.
   Temporary: remove with the rest of src/professional/owner. */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { SITE } from "@/content/site";
import settings from "@/content/settings.json";
import { findImage } from "../assets";

const MARK = "TODO(owner):";
const WIDE = "1600×1000 JPG, 16:10";

type TextItem = { line: number; where: string; note: string };

/** Each TODO(owner) line, labelled with its field (or, for comments, the entry below it). */
function textItems(): TextItem[] {
  const lines = readFileSync(join(process.cwd(), "src/content/site.ts"), "utf8").split("\n");
  let project = "";
  const items: TextItem[] = [];
  lines.forEach((raw, i) => {
    const name = raw.match(/^\s*name: "([^"]+)"/);
    if (name) project = name[1];
    const at = raw.indexOf(MARK);
    if (at < 0) return;
    const note = raw.slice(at + MARK.length).replace(/",?\s*$/, "").trim();
    let where: string;
    if (raw.trimStart().startsWith("//")) {
      // a keep-or-cut comment: name the entry it sits above
      const next = lines.slice(i + 1, i + 4).join("\n");
      where = next.match(/name: "([^"]+)"/)?.[1] ?? next.match(/^\s*(\w+):/m)?.[1] ?? "?";
    } else {
      const key = raw.match(/^\s*(\w+):/)?.[1] ?? "about"; // bare strings only occur in the about array
      where = ["problem", "approach", "whatBroke", "result"].includes(key) ? `${project} · ${key}` : key;
    }
    items.push({ line: i + 1, where, note });
  });
  return items;
}

function imageItems() {
  const items: { path: string; spec: string; what: string }[] = [];
  for (const p of SITE.projects) {
    if (p.imageNeeded && !p.sites?.length && !p.preview) items.push({ path: p.imageNeeded, spec: WIDE, what: `${p.name} card` });
    for (const src of p.caseStudy?.images ?? []) items.push({ path: src, spec: WIDE, what: `${p.name} case study` });
  }
  items.push({ path: SITE.photo ?? "/assets/photo.jpg", spec: "800×800 JPG, square (optional)", what: "About photo" });
  // one file can fill two slots (thrift_feed's card and case study)
  const byPath = new Map<string, (typeof items)[number]>();
  for (const it of items) {
    const seen = byPath.get(it.path);
    byPath.set(it.path, seen ? { ...seen, what: `${seen.what} + ${it.what}` } : it);
  }
  return [...byPath.values()].map((it) => ({ ...it, done: !!findImage(it.path) }));
}

export default function OwnerTodo() {
  const text = textItems();
  const images = imageItems();
  const left = text.length + images.filter((i) => !i.done).length;

  return (
    <details className="owner-todo" open>
      <summary>owner to-do: {left} left (dev only)</summary>
      <div className="owner-todo-body">
        <p className="owner-todo-hint">Dashed text on the page is editable: type, then save (or Ctrl+Enter).</p>
        <p className="owner-todo-hint">
          Demo mode for the built site: <strong>{settings.demoMode ? "on" : "off"}</strong> ·{" "}
          <a href="/settings/">settings</a>
        </p>
        <h4>Text, src/content/site.ts</h4>
        <ul>
          {text.map((t) => (
            <li key={t.line}>
              <span className="owner-todo-where">
                L{t.line} {t.where}
              </span>{" "}
              {t.note}
            </li>
          ))}
          {text.length === 0 && <li>All written.</li>}
        </ul>
        <h4>Images, public/</h4>
        <ul>
          {images.map((img) => (
            <li key={img.path} className={img.done ? "is-done" : undefined}>
              <span aria-hidden="true">{img.done ? "[x]" : "[ ]"}</span> <code>public{img.path}</code>{" "}
              <span className="owner-todo-where">
                {img.what}, {img.spec}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
