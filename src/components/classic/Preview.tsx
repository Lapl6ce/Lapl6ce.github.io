"use client";

/* Clickable website preview: a mini browser window with a screenshot.
   Falls back to a styled placeholder if there's no image (or it fails to load). */

import { useState } from "react";
import { domain, type SitePreview } from "@/content/site";

export default function Preview({ site, compact = false }: { site: SitePreview; compact?: boolean }) {
  const [broken, setBroken] = useState(false);
  const showImage = site.image && !broken;

  return (
    <a className="preview" href={site.url} target="_blank" rel="noopener" aria-label={`${site.name} (opens in a new tab)`}>
      <div className="preview-bar" aria-hidden="true">
        <span className="preview-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="preview-url">{domain(site.url)}</span>
        <span className="preview-open">↗</span>
      </div>
      <div className="preview-shot">
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={site.image} alt={`Screenshot of ${site.name}`} loading="lazy" onError={() => setBroken(true)} />
        ) : (
          <div className="preview-fallback">
            <span className="preview-fallback-domain">{domain(site.url)}</span>
            <span className="preview-fallback-cta">Visit site ↗</span>
          </div>
        )}
      </div>
      {!compact && <div className="preview-name">{site.name}</div>}
    </a>
  );
}
