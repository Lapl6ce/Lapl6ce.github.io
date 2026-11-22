// Dev-only page (see next.config.ts): there is no server to save settings to once exported.

import type { Metadata } from "next";
import settings from "@/content/settings.json";
import SettingsPanel from "@/professional/owner/SettingsPanel";

export const metadata: Metadata = { title: "Settings (dev only)", robots: { index: false } };

export default function SettingsPage() {
  return <SettingsPanel initial={settings} />;
}
