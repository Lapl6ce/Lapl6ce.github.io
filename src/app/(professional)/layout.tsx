import type { Metadata, Viewport } from "next";
import { Nunito_Sans, IBM_Plex_Mono } from "next/font/google";
import { SITE } from "@/content/site";
import "@/professional/professional.css";

// Nunito Sans's width axis carries the hierarchy (see DESIGN.md), so it is
// loaded alongside weight. Plex Mono is only for data: dates, stacks, figure numbers.
const sans = Nunito_Sans({ subsets: ["latin"], axes: ["wdth"], variable: "--font-sans-family" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono-family" });

export const metadata: Metadata = {
  title: `${SITE.name} | ${SITE.role}`,
  description: SITE.summary,
  openGraph: { title: SITE.name, description: SITE.summary, type: "profile" },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef1f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0f13" },
  ],
};

// The professional site and fun mode are separate root layouts (see also
// play/layout.tsx), so each loads only its own fonts and global CSS and the two
// stylesheets never mix. The cost is a full page load when switching modes.
export default function ProfessionalLayout({ children }: { children: React.ReactNode }) {
  return (
    // the hero's inline script marks <html> before hydration (see Hero.tsx)
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
