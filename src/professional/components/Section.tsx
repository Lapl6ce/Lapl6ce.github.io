import type { ReactNode } from "react";

/** A page section on the margin + main grid. Children sit in the main column
 *  unless they carry the `margin` class (dates, labels, notes, the photo). */
export default function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="section" id={id} aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`} className="section-h">
        {title}
      </h2>
      {children}
    </section>
  );
}
