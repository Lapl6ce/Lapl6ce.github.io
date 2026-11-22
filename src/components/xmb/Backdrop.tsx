"use client";

/* Full-screen "game background" for the highlighted project, like a
   handheld console showing a game's artwork when you rest on it.
   Uses the project's screenshot if it has one, otherwise generated
   art in the project's colour. Layers crossfade when the project changes. */

import { useEffect, useState } from "react";
import { hueOf, liveSites, type Project } from "@/content/site";

type Layer = { id: number; p: Project; out?: boolean };

const backdropImage = (p: Project) => p.preview || liveSites(p).find((s) => s.image)?.image || p.thumb;

let nextId = 1;

export default function Backdrop({ p }: { p: Project | null }) {
  const [layers, setLayers] = useState<Layer[]>([]);

  useEffect(() => {
    setLayers((ls) => {
      const leaving = ls.filter((l) => !l.out).map((l) => ({ ...l, out: true }));
      return p ? [...leaving, { id: nextId++, p }] : leaving;
    });
    const t = setTimeout(() => setLayers((ls) => ls.filter((l) => !l.out)), 900);
    return () => clearTimeout(t);
  }, [p]);

  return (
    <div className="backdrop" aria-hidden="true">
      {layers.map(({ id, p: proj, out }) => {
        const img = backdropImage(proj);
        return (
          <div
            key={id}
            className={"backdrop-layer" + (out ? " is-out" : "") + (img ? "" : " is-generated")}
            style={{ "--bh": hueOf(proj.name) } as React.CSSProperties}
          >
            {img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img} alt="" />
            ) : (
              <span className="backdrop-title">{proj.name}</span>
            )}
          </div>
        );
      })}
      <div className={"backdrop-scrim" + (p ? " is-on" : "")} />
    </div>
  );
}
