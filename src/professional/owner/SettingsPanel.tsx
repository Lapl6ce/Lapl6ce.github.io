"use client";

/* The dev-only /settings page. Each switch saves straight to settings.json
   through the dev route; the dev server then reloads with it applied.
   Temporary: remove with the rest of src/professional/owner. */

import { useState } from "react";
import type { Settings } from "./save";

const OPTIONS: { key: keyof Settings; label: string; note: string }[] = [
  {
    key: "demoMode",
    label: "Demo mode",
    note:
      "Builds (what goes online) fill unwritten text with your earlier wording, hide unfinished case studies " +
      "and IMAGE NEEDED boxes, and show no to-do list. The dev server keeps showing your real draft so you can fill it in.",
  },
  {
    key: "previewInDev",
    label: "Preview demo here",
    note: "Show the demo version on this dev server too, to check what visitors will see. In-page editing is off while it's on.",
  },
];

/** Switches for demo mode, saved to src/content/settings.json. */
export default function SettingsPanel({ initial }: { initial: Settings }) {
  const [settings, setSettings] = useState(initial);
  const [status, setStatus] = useState("");

  async function toggle(key: keyof Settings) {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    setStatus("saving...");
    try {
      const res = await fetch("/api/owner-settings/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`);
      setStatus("saved to src/content/settings.json");
    } catch (e) {
      setSettings(settings); // the file wasn't written, so show what's really saved
      setStatus("not saved: " + (e instanceof Error ? e.message : String(e)));
    }
  }

  return (
    <main className="settings">
      <p>
        <a href="/">&lt; back to the site</a>
      </p>
      <h1>Settings</h1>
      <p className="settings-note">Dev only: this page and its switches don't exist in the built site.</p>
      <ul className="settings-list">
        {OPTIONS.map((o) => (
          <li key={o.key}>
            <label>
              <input
                type="checkbox"
                checked={settings[o.key]}
                disabled={o.key === "previewInDev" && !settings.demoMode}
                onChange={() => toggle(o.key)}
              />{" "}
              <span className="settings-label">{o.label}</span>
            </label>
            <p className="settings-note">{o.note}</p>
          </li>
        ))}
      </ul>
      <p className="settings-status" role="status">
        {status}
      </p>
      <p className="settings-note">
        Demo mode takes effect in the next <code>npm run build</code>, so commit settings.json along with the rest
        before deploying.
      </p>
    </main>
  );
}
