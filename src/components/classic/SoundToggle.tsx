"use client";

/* Speaker button in the classic nav + quiet click sounds on links and buttons. */

import { useEffect, useState } from "react";
import { isSoundOn, onSoundChange, play, setSoundOn } from "@/lib/sfx";

export default function SoundToggle() {
  const [on, setOn] = useState(true);

  useEffect(() => {
    setOn(isSoundOn());
    const unsubscribe = onSoundChange(setOn);

    // one listener for every link/button on the page
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("a, button");
      if (el && !el.hasAttribute("data-sound-toggle")) play("click");
    };
    document.addEventListener("click", onClick);
    return () => {
      unsubscribe();
      document.removeEventListener("click", onClick);
    };
  }, []);

  function toggle() {
    const next = !on;
    setSoundOn(next);
    if (next) play("click");
  }

  return (
    <button
      type="button"
      className="sound-toggle"
      data-sound-toggle
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Mute sound effects" : "Turn on sound effects"}
      title={on ? "Sound effects on" : "Sound effects off"}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" />
        {on ? <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" /> : <path d="M16 9.5l5 5M21 9.5l-5 5" />}
      </svg>
    </button>
  );
}
