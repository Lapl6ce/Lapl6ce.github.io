import { SITE, liveSites, featuredFirst, type Project } from "@/content/site";
import { external } from "@/shared/links";
import ProjectMedia from "../components/ProjectMedia";

/** Code/demo links plus any live sites after the first (the first is already the picture). */
function projectLinks(p: Project): [string, string][] {
  const code = Object.entries(p.links).filter((e): e is [string, string] => !!e[1]);
  return [...code, ...liveSites(p).slice(1).map((s) => [s.name, s.url] as [string, string])];
}

function Links({ p }: { p: Project }) {
  const links = projectLinks(p);
  if (!links.length) return null;
  return (
    <div className="project-links">
      {links.map(([label, url]) => (
        <a key={url} href={url} {...external(url)}>
          {label}
          <span aria-hidden="true"> ↗</span>
        </a>
      ))}
    </div>
  );
}

function Tags({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <ul className="tags" aria-label="Technologies">
      {tags.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

/** Featured projects: picture and write-up side by side, alternating sides. */
function Feature({ p }: { p: Project }) {
  return (
    <li className="feature">
      <div className="feature-media">
        <ProjectMedia p={p} />
      </div>
      <div className="feature-text">
        <div className="project-head">
          <h3>{p.name}</h3>
          {p.year && <span className="meta">{p.year}</span>}
        </div>
        <p>{p.description || p.blurb}</p>
        <Tags tags={p.tags} />
        <Links p={p} />
      </div>
    </li>
  );
}

/** Everything else: one line each in a plain index, like a directory listing. */
function IndexRow({ p }: { p: Project }) {
  return (
    <li className="index-row">
      <div className="project-head">
        <h3>{p.name}</h3>
        {p.year && <span className="meta">{p.year}</span>}
      </div>
      <p>{p.blurb}</p>
      <Tags tags={p.tags} />
      <Links p={p} />
    </li>
  );
}

export default function Projects() {
  const projects = featuredFirst(SITE.projects);
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  return (
    <section className="section section-wide" id="projects" aria-labelledby="proj-h">
      <h2 id="proj-h">Projects</h2>
      <ul className="features">
        {featured.map((p) => (
          <Feature key={p.name} p={p} />
        ))}
      </ul>
      {rest.length > 0 && (
        <>
          <h3 className="sub-h">More projects</h3>
          <ul className="project-index">
            {rest.map((p) => (
              <IndexRow key={p.name} p={p} />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
