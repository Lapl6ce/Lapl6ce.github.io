"use client";

/* Hand-written text that can be rewritten in place while running `next dev`.
   The save button posts to the dev-only route, which writes the text into
   site.ts; the dev server then reloads with the new value. Production renders
   plain text. Temporary: remove with the rest of src/professional/owner. */

import { useState, type FocusEvent, type KeyboardEvent } from "react";
import { DEMO_ACTIVE } from "@/content/demo";

// a demo preview shows stand-in text that isn't in site.ts, so there is nothing to save it over
const EDITABLE = process.env.NODE_ENV === "development" && !DEMO_ACTIVE;
const PLACEHOLDER = "TODO(owner):";

type Props = { value: string; as?: "p" | "span"; className?: string };

/** Text from site.ts that becomes an editable field with a save button under `next dev`. */
export default function OwnerText({ value, as: Tag = "p", className }: Props) {
  if (!EDITABLE) return <Tag className={className}>{value}</Tag>;
  // keyed on the value so a successful save, which reloads site.ts, starts a fresh draft
  return <Editor key={value} value={value} Tag={Tag} className={className} />;
}

function Editor({ value, Tag, className }: { value: string; Tag: "p" | "span"; className?: string }) {
  const [draft, setDraft] = useState(value);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState("");
  const dirty = draft.trim() !== "" && draft.trim() !== value;
  const isPlaceholder = value.startsWith(PLACEHOLDER);

  async function save() {
    if (!dirty || status === "saving") return;
    setStatus("saving");
    try {
      const res = await fetch("/api/owner-save/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ from: value, to: draft }),
      });
      if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`);
      setStatus("saved");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus("error");
    }
  }

  // Selecting a placeholder on focus means typing replaces it instead of
  // having to delete the note first.
  function onFocus(e: FocusEvent<HTMLSpanElement>) {
    if (!isPlaceholder || draft !== value) return;
    const range = document.createRange();
    range.selectNodeContents(e.currentTarget);
    const sel = getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }

  function onKeyDown(e: KeyboardEvent<HTMLSpanElement>) {
    if (e.key !== "Enter") return;
    e.preventDefault(); // one paragraph per field
    if (e.metaKey || e.ctrlKey) save();
  }

  return (
    <Tag className={className}>
      <span
        className={"owner-edit" + (isPlaceholder ? " is-placeholder" : "")}
        contentEditable="plaintext-only"
        suppressContentEditableWarning
        role="textbox"
        aria-label="Editable text (dev only)"
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        onInput={(e) => {
          setDraft(e.currentTarget.textContent ?? "");
          setStatus("idle");
        }}
      >
        {value}
      </span>
      {dirty && status !== "saved" && (
        <button type="button" className="owner-save" onClick={save} disabled={status === "saving"} title="Ctrl+Enter also saves">
          {status === "saving" ? "saving..." : "save"}
        </button>
      )}
      {status === "saved" && <span className="owner-msg">saved to site.ts</span>}
      {status === "error" && <span className="owner-msg is-error">{error}</span>}
    </Tag>
  );
}
