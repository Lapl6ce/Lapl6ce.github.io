import type { Metadata, Viewport } from "next";
import { M_PLUS_1p, JetBrains_Mono } from "next/font/google";
import { SITE } from "@/content/site";
import "@/play/play.css";

const mplus = M_PLUS_1p({ subsets: ["latin"], weight: ["300", "400", "500", "700"], variable: "--font-mplus" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono-family" });

export const metadata: Metadata = {
  title: `${SITE.name} · Fun mode`,
  description: `${SITE.name}'s portfolio, experimental handheld-console menu edition.`,
};

export const viewport: Viewport = { colorScheme: "dark", viewportFit: "cover" };

// Separate root layout from the professional site; see (professional)/layout.tsx.
export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${mplus.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
