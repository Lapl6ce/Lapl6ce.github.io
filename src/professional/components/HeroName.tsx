"use client";

import { openTerminal } from "@/components/Terminal";

/** Your name in the hero. Clicking it opens the hidden terminal. */
export default function HeroName({ name }: { name: string }) {
  return (
    <h1 title="psst, click me" style={{ cursor: "pointer" }} onClick={openTerminal}>
      {name}
    </h1>
  );
}
