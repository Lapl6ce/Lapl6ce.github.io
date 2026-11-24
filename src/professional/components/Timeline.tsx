import type { ReactNode } from "react";

export type TimelineRow = {
  key: string;
  title: ReactNode;
  date: string;
  /** line under the title, e.g. organisation and place, or degree */
  sub?: ReactNode;
  points?: string[];
};

/** Dated entries: the date sits in the margin, the entry in the main column. */
export default function Timeline({ rows }: { rows: TimelineRow[] }) {
  return (
    <ol className="entries">
      {rows.map((row) => (
        <li className="entry" key={row.key}>
          <p className="margin data">{row.date}</p>
          <div className="entry-body">
            <h3>{row.title}</h3>
            {row.sub && <p className="entry-sub">{row.sub}</p>}
            {row.points && row.points.length > 0 && (
              <ul className="bullets">
                {row.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
