"use client";

/* Nav link to fun mode with a caption explaining it. The caption appears once on
   a first visit so the link isn't a mystery, then only on hover or focus. On
   narrow screens it never appears unasked: there it would sit over the nav. */

import { useEffect, useState } from "react";
import { ROUTES } from "@/shared/links";

const SEEN_KEY = "funmode.tip-seen";

export default function FunModeLink() {
  const [intro, setIntro] = useState(false);

  useEffect(() => {
    if (matchMedia("(max-width: 720px)").matches) return;
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
      <a className="mode-switch" href={ROUTES.play} aria-describedby="fun-mode-tip">
        Fun mode
      </a>
      <span className="fun-tip" id="fun-mode-tip" role="tooltip">
        A playful, console-style version of this site
      </span>
    </span>
  );
}
