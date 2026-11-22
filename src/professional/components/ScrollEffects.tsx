"use client";

/* Fades sections in as they scroll into view and marks the nav link of the
   section being read. Sections are only hidden once the `reveal` class is on
   <html>, which happens here, so without JavaScript everything stays visible. */

import { useEffect } from "react";

export default function ScrollEffects() {
  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>("main .section")];
    const root = document.documentElement;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let reveal: IntersectionObserver | undefined;
    if (!reduceMotion) {
      // Sections already on screen stay put; hiding them first would make the
      // server-rendered page blink out and fade back in.
      for (const s of sections) if (s.getBoundingClientRect().top < innerHeight) s.classList.add("is-visible");
      root.classList.add("reveal");
      reveal = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            e.target.classList.add("is-visible");
            reveal!.unobserve(e.target); // reveal once; don't fade out again on scroll up
          }
        },
        { rootMargin: "0px 0px -8% 0px" },
      );
      sections.forEach((s) => reveal!.observe(s));
    }

    // The section being read is the last one whose top has passed the upper third
    // of the viewport. (An IntersectionObserver band misses short sections and
    // the gaps between them, leaving the previous link highlighted.)
    const links = [...document.querySelectorAll<HTMLAnchorElement>(".nav-links a")];
    let frame = 0;
    const markCurrent = () => {
      frame = 0;
      const line = innerHeight / 3;
      const current = sections.filter((s) => s.getBoundingClientRect().top <= line).pop();
      for (const a of links) a.classList.toggle("is-current", !!current && a.hash === "#" + current.id);
    };
    const onScroll = () => { frame ||= requestAnimationFrame(markCurrent); }; // at most once per frame
    markCurrent();
    addEventListener("scroll", onScroll, { passive: true });

    return () => {
      reveal?.disconnect();
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      root.classList.remove("reveal");
    };
  }, []);

  return null;
}
