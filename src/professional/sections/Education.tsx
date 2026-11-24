import { SITE } from "@/content/site";
import Timeline from "../components/Timeline";

/** Part of the Background section. */
export default function Education() {
  return (
    <>
      <h3 className="sub-h">Education</h3>
      <Timeline
        rows={SITE.education.map((e) => ({
          key: e.school,
          title: e.school,
          date: e.date,
          sub: [e.degree, e.location].filter(Boolean).join(" · "),
          points: e.points,
        }))}
      />
    </>
  );
}
