import { SITE } from "@/content/site";
import Timeline from "../components/Timeline";

export default function Education() {
  return (
    <section className="section" id="education" aria-labelledby="edu-h">
      <h2 id="edu-h">Education</h2>
      <Timeline
        rows={SITE.education.map((e) => ({
          key: e.school,
          title: e.school,
          date: e.date,
          sub: (
            <p className="edu-degree">
              {e.degree}
              {e.location && <span className="meta"> · {e.location}</span>}
            </p>
          ),
          points: e.points,
        }))}
      />
    </section>
  );
}
