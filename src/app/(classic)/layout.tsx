import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SITE } from "@/content/site";
import "./classic.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono-family" });

export const metadata: Metadata = {
  title: `${SITE.name} | ${SITE.role}`,
  description: SITE.summary,
  openGraph: { title: SITE.name, description: SITE.summary, type: "profile" },
};

export const viewport: Viewport = { colorScheme: "dark", themeColor: "#0f1216" };

// The classic site and the XMB site are separate root layouts, so switching
// between them is a full page load and their global styles never mix.
export default function ClassicLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
