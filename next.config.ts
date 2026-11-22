import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const nextConfig: NextConfig = {
  // Static HTML in out/, so any static host (GitHub Pages) can serve it.
  output: "export",
  // Emit play/index.html rather than play.html: GitHub Pages resolves /play/ to a
  // directory index but won't map an extensionless /play to play.html.
  trailingSlash: true,
  // The image optimizer needs a running server, which a static export doesn't have.
  images: { unoptimized: true },
};

export default function config(phase: string): NextConfig {
  if (phase !== PHASE_DEVELOPMENT_SERVER) return nextConfig;
  // `*.dev.ts(x)` routes (the in-page editor's save endpoints and /settings) exist
  // only under `next dev`. A static export can't serve POST routes, so the build must not see them.
  return { ...nextConfig, pageExtensions: ["tsx", "ts", "jsx", "js", "dev.tsx", "dev.ts"] };
}
