"use client";

/* Full-screen artwork behind the menu for the highlighted project, the way a
   console shows a game's background: its screenshot, or generated art in the
   project's colour. Changing project crossfades between layers. */

import { useEffect, useState } from "react";
import { hueOf, liveSites, type Project } from "@/content/site";

type Layer = { id: number; p: Project; out?: boolean };

const backdropImage = (p: Project) => p.preview || liveSites(p).find((s) => s.image)?.image;

// A fresh id per layer gives React a new key, so re-showing the same project
// mounts a new element and its fade-in animation runs again.
let nextId = 1;

export default function Backdrop({ p }: { p: Project | null }) {
  const [layers, setLayers] = useState<Layer[]>([]);

  // Crossfade: every visible layer is marked `out` (CSS fades it), and the new
  // project is appended on top so both are on screen during the transition.
  // Faded layers are removed after 900 ms, which must stay longer than the
  // 0.8 s backdrop-out animation in play.css.
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
