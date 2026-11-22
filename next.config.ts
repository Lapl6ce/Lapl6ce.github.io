import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `next build` writes a fully static site to out/ (GitHub Pages, Netlify, any host)
  output: "export",
  // /play → /play/index.html so static hosts resolve it
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
