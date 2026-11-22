"use client";

/* A screenshot in an old-style window: striped title bar with a close box.
   Links out (new tab) when given an href. With no image, or one that fails to
   load, it shows the title-bar label as a placeholder. */

import { useState } from "react";

type Props = {
  /** what the frame shows: used for the aria-label and image alt text */
  name: string;
  /** title-bar text, e.g. a domain */
  label: string;
  image?: string;
  href?: string;
};

export default function BrowserFrame({ name, label, image, href }: Props) {
  const [broken, setBroken] = useState(false);

  const inner = (
    <>
      <div className="preview-bar" aria-hidden="true">
        <span className="preview-close" />
        <span className="preview-url">{label}</span>
        {href && <span className="preview-open">↗</span>}
      </div>
      <div className="preview-shot">
        {image && !broken ? (
          <img src={image} alt={`Screenshot of ${name}`} loading="lazy" onError={() => setBroken(true)} />
        ) : (
          <div className="preview-fallback">
            <span className="preview-fallback-domain">{label}</span>
            {href && <span className="preview-fallback-cta">[ visit site ]</span>}
          </div>
        )}
      </div>
    </>
  );

  return href ? (
    <a className="preview" href={href} target="_blank" rel="noopener" aria-label={`${name} (opens in a new tab)`}>
      {inner}
    </a>
  ) : (
    <div className="preview is-static">{inner}</div>
  );
}
