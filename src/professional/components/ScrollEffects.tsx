"use client";

/* Highlights the nav link of the section being read, and gives the header its
   bottom rule once the page has scrolled. */

import { useEffect } from "react";

export default function ScrollEffects() {
  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>("main .section")];
    const links = [...document.querySelectorAll<HTMLAnchorElement>(".nav-links a")];
    const header = document.querySelector<HTMLElement>(".site-header");

    // The section being read is the last one whose top has passed the upper third
    // of the viewport. (An IntersectionObserver band misses short sections and
    // the gaps between them, leaving the previous link highlighted.)
    let frame = 0;
    const markCurrent = () => {
      frame = 0;
      const current = sections.filter((s) => s.getBoundingClientRect().top <= innerHeight / 3).pop();
      for (const a of links) a.classList.toggle("is-current", !!current && a.hash === "#" + current.id);
      header?.classList.toggle("is-scrolled", scrollY > 0);
    };
    const onScroll = () => { frame ||= requestAnimationFrame(markCurrent); }; // at most once per frame
    markCurrent();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);

    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
