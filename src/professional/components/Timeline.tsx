import type { ReactNode } from "react";

export type TimelineRow = {
  key: string;
  title: ReactNode;
  date: string;
  /** line under the title, e.g. location or degree */
  sub?: ReactNode;
  points?: string[];
};

export default function Timeline({ rows }: { rows: TimelineRow[] }) {
  return (
    <ol className="timeline">
      {rows.map((row) => (
        <li className="timeline-item" key={row.key}>
          <div className="timeline-head">
            <h3>{row.title}</h3>
            <span className="meta">{row.date}</span>
          </div>
          {row.sub}
          {row.points && row.points.length > 0 && (
            <ul className="bullets">
              {row.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ol>
  );
}
