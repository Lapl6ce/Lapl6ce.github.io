"use client";

import { ASCII_NAME } from "./asciiName";

/** The hero heading, drawn as an ASCII banner. */
export default function HeroName({ name }: { name: string }) {
  return (
    <h1 className="ascii-name">
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
