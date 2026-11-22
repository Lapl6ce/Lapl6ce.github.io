"use client";

/* Background canvas: faint drifting ASCII stars with cursor parallax and an
   occasional shooting star. With reduced motion it draws one static frame. */

import { useEffect, useRef } from "react";

const DENSITY = 9000; // px² per star (higher = fewer)
const MAX_STARS = 160;
const DRIFT = 0.012;
const PARALLAX = 14;
const TWINKLE_SPEED = 0.0012;
const METEOR_MIN_GAP = 9000;
const METEOR_MAX_GAP = 24000;

const GLYPHS = [".", ".", ".", "'", "+", "*"]; // weighted toward plain dots
const COLOR = "#e8e2d0"; // --text in professional.css
const TRAIL = "232, 163, 61"; // --accent as rgb, for the meteor gradient

type Star = { x: number; y: number; depth: number; base: number; phase: number; glyph: string };
type Meteor = { x: number; y: number; vx: number; vy: number; life: number };

export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let stars: Star[] = [];
    let meteor: Meteor | null = null;
    let nextMeteorAt = performance.now() + 4000 + Math.random() * 6000;
    let w = 0, h = 0, dpr = 1;
    let mx = 0, my = 0, targetMx = 0, targetMy = 0;
    let raf = 0;

    function drawStatic() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = COLOR;
      for (const s of stars) drawStar(s, s.x, s.y, s.base);
      ctx.globalAlpha = 1;
    }

    // Assigning ctx.font re-parses the font string, so it's only set when the
    // size changes. Resizing the canvas resets the context, hence the reset there.
    let font = "";
    function drawStar(s: Star, x: number, y: number, alpha: number) {
      const next = `${Math.round(8 + s.depth * 6)}px ui-monospace, monospace`; // nearer stars are bigger
      if (next !== font) ctx.font = font = next;
      ctx.globalAlpha = alpha;
      ctx.fillText(s.glyph, x, y);
    }

    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 2); // sharper on high-DPI, capped to bound canvas memory
      w = innerWidth;
      h = innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      font = "";
      const count = Math.min(Math.floor((w * h) / DENSITY), MAX_STARS);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        depth: 0.3 + Math.random() * 0.7,
        base: 0.08 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
      })).sort((a, b) => a.depth - b.depth); // grouped by size, so the font changes a few times per frame, not per star
      if (reduceMotion) drawStatic();
    }

    function tick(now: number) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      // ease toward the cursor offset; deeper stars (higher depth) move further
      mx += (targetMx - mx) * 0.04;
      my += (targetMy - my) * 0.04;

      ctx.fillStyle = COLOR;
      for (const s of stars) {
        s.x += DRIFT * s.depth;
        s.y += DRIFT * 0.6 * s.depth;
        if (s.x > w + 2) s.x = -2;
        if (s.y > h + 2) s.y = -2;
        drawStar(s, s.x + mx * s.depth, s.y + my * s.depth, s.base * (0.75 + 0.25 * Math.sin(now * TWINKLE_SPEED * s.depth + s.phase)));
      }

      if (!meteor && now > nextMeteorAt) {
        const dir = Math.random() < 0.5 ? -1 : 1;
        meteor = { x: Math.random() * w, y: Math.random() * h * 0.4, vx: dir * (3 + Math.random() * 2.5), vy: 2 + Math.random() * 1.5, life: 1 };
        nextMeteorAt = now + METEOR_MIN_GAP + Math.random() * (METEOR_MAX_GAP - METEOR_MIN_GAP);
      }
      if (meteor) {
        meteor.x += meteor.vx;
        meteor.y += meteor.vy;
        meteor.life -= 0.018;
        if (meteor.life <= 0 || meteor.x < -60 || meteor.x > w + 60 || meteor.y > h + 60) {
          meteor = null;
        } else {
          const tailX = meteor.x - meteor.vx * 9;
          const tailY = meteor.y - meteor.vy * 9;
          const grad = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
          grad.addColorStop(0, `rgba(${TRAIL}, ${0.6 * meteor.life})`);
          grad.addColorStop(1, `rgba(${TRAIL}, 0)`);
          ctx.globalAlpha = 1;
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(meteor.x, meteor.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    }

    const onMove = (e: MouseEvent) => {
      targetMx = (e.clientX / w - 0.5) * -PARALLAX;
      targetMy = (e.clientY / h - 0.5) * -PARALLAX;
    };
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    };

    resize();
    addEventListener("resize", onResize);
    if (!reduceMotion) {
      addEventListener("mousemove", onMove, { passive: true });
      raf = requestAnimationFrame(tick);
    }
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      removeEventListener("resize", onResize);
      removeEventListener("mousemove", onMove);
    };
  }, []);

  return <canvas id="sky" ref={ref} aria-hidden="true" />;
}
