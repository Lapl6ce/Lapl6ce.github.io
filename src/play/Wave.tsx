"use client";

/* Animated XMB background: a vertical color gradient with soft,
   glowing ribbons drifting across the screen. */

import { useEffect, useRef } from "react";

const RIBBONS = [
  { base: 0.62, amp: 0.05, len: 1.1, speed: 0.00016, phase: 0.0, thick: 0.07, alpha: 0.1 },
  { base: 0.66, amp: 0.07, len: 0.8, speed: 0.00011, phase: 2.1, thick: 0.05, alpha: 0.08 },
  { base: 0.58, amp: 0.04, len: 1.5, speed: 0.00021, phase: 4.2, thick: 0.03, alpha: 0.07 },
];

type Props = { hue: number; sat: number; enabled: boolean };

export default function Wave({ hue, sat, enabled }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const props = useRef({ hue, sat });
  const api = useRef<{ redraw: () => void; setRunning: (on: boolean) => void } | null>(null);

  // one-time setup: canvas sizing + draw loop
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, dpr = 1;
    let running = false;
    let raf = 0;
    let t = 12000; // time of the last drawn frame (used for static frames)

    function draw(time: number) {
      const { hue: H, sat: S } = props.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, `hsl(${H}, ${S * 0.7}%, 42%)`);
      g.addColorStop(0.5, `hsl(${H}, ${S * 0.75}%, 22%)`);
      g.addColorStop(1, `hsl(${H}, ${S * 0.8}%, 8%)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      const r = ctx.createRadialGradient(w * 0.25, h * 0.1, 0, w * 0.25, h * 0.1, Math.max(w, h) * 0.8);
      r.addColorStop(0, "rgba(255,255,255,0.10)");
      r.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = r;
      ctx.fillRect(0, 0, w, h);

      const step = Math.max(6, Math.round(w / 160));
      for (const rb of RIBBONS) {
        const top: [number, number][] = [];
        const bottom: [number, number][] = [];
        for (let x = -step; x <= w + step; x += step) {
          const u = x / w;
          const y =
            h *
            (rb.base +
              rb.amp * Math.sin(u * rb.len * Math.PI * 2 + time * rb.speed + rb.phase) +
              rb.amp * 0.5 * Math.sin(u * rb.len * Math.PI * 1.3 - time * rb.speed * 1.7 + rb.phase * 0.5));
          const thick = h * rb.thick * (0.55 + 0.45 * Math.sin(u * Math.PI * 2.2 + time * rb.speed * 0.8 + rb.phase * 2));
          top.push([x, y]);
          bottom.push([x, y + thick]);
        }

        ctx.beginPath();
        top.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        for (let i = bottom.length - 1; i >= 0; i--) ctx.lineTo(bottom[i][0], bottom[i][1]);
        ctx.closePath();
        const fill = ctx.createLinearGradient(0, h * (rb.base - rb.amp * 1.5), 0, h * (rb.base + rb.amp * 1.5 + rb.thick));
        fill.addColorStop(0, `rgba(255,255,255,${rb.alpha * 1.6})`);
        fill.addColorStop(1, `rgba(255,255,255,${rb.alpha * 0.2})`);
        ctx.fillStyle = fill;
        ctx.fill();

        ctx.lineWidth = 1.2;
        ctx.strokeStyle = `rgba(255,255,255,${rb.alpha * 3.2})`;
        ctx.beginPath();
        top.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        ctx.stroke();

        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(255,255,255,${rb.alpha * 1.2})`;
        ctx.beginPath();
        bottom.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        ctx.stroke();
      }
    }

    function loop(time: number) {
      if (!running) return;
      t = time;
      draw(time);
      raf = requestAnimationFrame(loop);
    }

    function resize() {
      dpr = Math.min(devicePixelRatio || 1, 1.5);
      w = innerWidth;
      h = innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      if (!running) draw(t);
    }

    api.current = {
      redraw: () => !running && draw(t),
      setRunning(on) {
        if (on && !reduceMotion && !running) {
          running = true;
          raf = requestAnimationFrame(loop);
        } else if (!on) {
          running = false;
          cancelAnimationFrame(raf);
          draw(t);
        }
      },
    };

    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(resize, 100);
    };
    resize();
    addEventListener("resize", onResize);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      removeEventListener("resize", onResize);
      api.current = null;
    };
  }, []);

  // react to prop changes
  useEffect(() => {
    props.current = { hue, sat };
    api.current?.redraw();
  }, [hue, sat]);

  useEffect(() => {
    api.current?.setRunning(enabled);
  }, [enabled]);

  return <canvas id="wave" ref={canvasRef} aria-hidden="true" />;
}
