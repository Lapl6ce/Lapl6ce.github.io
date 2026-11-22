import { SITE, type TimelineEntry } from "@/content/site";
import Timeline, { type TimelineRow } from "../components/Timeline";

/** Experience and leadership entries share a shape: title · org, location, bullets. */
export const entryRows = (entries: TimelineEntry[]): TimelineRow[] =>
  entries.map((e) => ({
    key: e.title + e.date,
    title: (
      <>
        {e.title}
        {e.org && <span className="at"> · {e.org}</span>}
      </>
    ),
    date: e.date,
    sub: e.location && <p className="meta">{e.location}</p>,
    points: e.points,
  }));

export default function Experience() {
  if (!SITE.experience.length) return null;
  return (
    <section className="section" id="experience" aria-labelledby="exp-h">
      <h2 id="exp-h">Experience</h2>
      <Timeline rows={entryRows(SITE.experience)} />
    </section>
  );
}
