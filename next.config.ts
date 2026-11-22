import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML in out/, so any static host (GitHub Pages) can serve it.
  output: "export",
  // Emit play/index.html rather than play.html: GitHub Pages resolves /play/ to a
  // directory index but won't map an extensionless /play to play.html.
  trailingSlash: true,
  // The image optimizer needs a running server, which a static export doesn't have.
  images: { unoptimized: true },
};

export default nextConfig;
