"use client";

import { openTerminal } from "@/shared/Terminal";
import { ASCII_NAME } from "./asciiName";

/** The hero heading, drawn as an ASCII banner. Clicking it opens the terminal. */
export default function HeroName({ name }: { name: string }) {
  return (
    <h1 className="ascii-name" title="psst, click me" onClick={openTerminal}>
      <span className="sr-only">{name}</span>
      <pre aria-hidden="true">
        {ASCII_NAME.map((line, i) => (
          // per-line delay so the banner prints top to bottom
          <span key={i} className="ascii-line" style={{ "--i": i } as React.CSSProperties}>
            {line}
          </span>
        ))}
      </pre>
    </h1>
  );
}
