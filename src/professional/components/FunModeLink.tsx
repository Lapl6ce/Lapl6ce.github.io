"use client";

/* Nav button to the console-style "fun mode" (/play), with a small caption
   explaining what it is. The caption shows briefly on a visitor's first
   visit, then only on hover / keyboard focus. */

import { useEffect, useState } from "react";

const SEEN_KEY = "funmode.tip-seen";

export default function FunModeLink() {
  const [intro, setIntro] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(SEEN_KEY) === "1";
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* storage blocked: just show it this time */
    }
    if (seen) return;
    const show = setTimeout(() => setIntro(true), 1200);
    const hide = setTimeout(() => setIntro(false), 7500);
    const dismiss = () => setIntro(false);
    addEventListener("scroll", dismiss, { once: true, passive: true });
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
      removeEventListener("scroll", dismiss);
    };
  }, []);

  return (
    <span className={"fun-mode" + (intro ? " show-tip" : "")}>
      {/* plain <a>: switching modes is a full page load */}
      <a className="mode-switch" href="/play/" aria-describedby="fun-mode-tip">
        <svg className="mode-switch-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7.5 7h9a4.5 4.5 0 0 1 4.4 5.4l-.9 4.4a2.3 2.3 0 0 1-4 1L14.6 16H9.4L8 17.8a2.3 2.3 0 0 1-4-1l-.9-4.4A4.5 4.5 0 0 1 7.5 7z" />
          <path d="M8 10.5v3M6.5 12h3" />
          <circle cx="15.5" cy="11" r=".6" />
          <circle cx="17" cy="12.8" r=".6" />
        </svg>
        Fun mode
      </a>
      <span className="fun-tip" id="fun-mode-tip" role="tooltip">
        A playful, console-style version of this site
      </span>
    </span>
  );
}
