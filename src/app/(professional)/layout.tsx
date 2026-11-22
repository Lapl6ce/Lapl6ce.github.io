import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { SITE } from "@/content/site";
import "@/professional/professional.css";

// One monospace family for the whole page. The variable is named for the
// terminal, which reads --font-mono-family in both modes.
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-mono-family" });

export const metadata: Metadata = {
  title: `${SITE.name} | ${SITE.role}`,
  description: SITE.summary,
  openGraph: { title: SITE.name, description: SITE.summary, type: "profile" },
};

export const viewport: Viewport = { colorScheme: "dark", themeColor: "#12110e" };

// The professional site and fun mode are separate root layouts (see also
// play/layout.tsx), so each loads only its own fonts and global CSS and the two
// stylesheets never mix. The cost is a full page load when switching modes.
export default function ProfessionalLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mono.variable}>
      <body>{children}</body>
    </html>
  );
}
