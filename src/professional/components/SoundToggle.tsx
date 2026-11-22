"use client";

/* Mute button for the nav. It also owns the quiet click sound on every link and
   button, so the sound stops when this component isn't on the page. */

import { useEffect, useState } from "react";
import { isSoundOn, onSoundChange, play, setSoundOn } from "@/shared/sfx";

export default function SoundToggle() {
  const [on, setOn] = useState(true);

  useEffect(() => {
    setOn(isSoundOn());
    const unsubscribe = onSoundChange(setOn);

    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("a, button");
      // the toggle plays its own sound, and only when turning sound on
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
      snd:<span className="sound-state">{on ? "on" : "off"}</span>
    </button>
  );
}
