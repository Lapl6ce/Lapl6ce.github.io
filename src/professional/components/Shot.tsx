"use client";

/* A screenshot shown as it is: full colour, its own aspect ratio, a 1px border.
   With no image, or one that fails to load, it shows `label` in its place. */

import { useState } from "react";

export default function Shot({ image, alt, label }: { image?: string; alt: string; label: string }) {
  const [broken, setBroken] = useState(false);
  if (!image || broken) {
    return (
      <div className="shot is-empty">
        <span>{label}</span>
      </div>
    );
  }
  return (
    <div className="shot">
      <img src={image} alt={alt} loading="lazy" onError={() => setBroken(true)} />
    </div>
  );
}
