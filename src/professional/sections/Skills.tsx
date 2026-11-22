import { SITE } from "@/content/site";

export default function Skills() {
  return (
    <section className="section" id="skills" aria-labelledby="skills-h">
      <h2 id="skills-h">Skills</h2>
      <dl className="leaders skills">
        {SITE.skills.map((g) => [
          <dt key={g.group + "-t"}>{g.group}</dt>,
          <dd key={g.group + "-d"}>{g.items.join(" · ")}</dd>,
        ])}
      </dl>
    </section>
  );
}
