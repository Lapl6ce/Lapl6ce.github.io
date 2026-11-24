import { SITE } from "@/content/site";
import Section from "../components/Section";

export default function Skills() {
  return (
    <Section id="skills" title="Skills">
      <dl className="entries rows">
        {SITE.skills.map((g) => (
          <div className="entry" key={g.group}>
            <dt className="margin data">{g.group}</dt>
            <dd className="entry-body">{g.items.join(" / ")}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
