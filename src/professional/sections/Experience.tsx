import { SITE, type TimelineEntry } from "@/content/site";
import Section from "../components/Section";
import Timeline, { type TimelineRow } from "../components/Timeline";

/** Experience and leadership entries share a shape: role, then organisation · place, then bullets. */
export const entryRows = (entries: TimelineEntry[]): TimelineRow[] =>
  entries.map((e) => ({
    key: e.title + e.date,
    title: e.title,
    date: e.date,
    sub: [e.org, e.location].filter(Boolean).join(" · ") || undefined,
    points: e.points,
  }));

export default function Experience() {
  if (!SITE.experience.length) return null;
  return (
    <Section id="experience" title="Experience">
      <Timeline rows={entryRows(SITE.experience)} />
    </Section>
  );
}
