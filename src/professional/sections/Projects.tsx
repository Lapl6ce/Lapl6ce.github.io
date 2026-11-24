import { SITE, liveSites, featuredFirst, type Project } from "@/content/site";
import { DEMO_ACTIVE } from "@/content/demo";
import { findImage } from "../assets";
import LinkList from "../components/LinkList";
import OutLink from "../components/OutLink";
import ImageNeeded from "../components/ImageNeeded";
import ProjectMedia from "../components/ProjectMedia";
import Section from "../components/Section";
import Shot from "../components/Shot";
import OwnerText from "../owner/OwnerText";

const CASE_PARTS = [
  ["problem", "The problem"],
  ["approach", "Approach"],
  ["whatBroke", "What broke"],
  ["result", "Result"],
] as const;

const LABELS: Record<string, string> = { code: "Code", demo: "Demo" };

/** Code/demo links plus live sites. A featured project's figure caption
 *  already links its first live site and its code, so `withFigure` leaves those
 *  out; a "More projects" row has no figure and keeps everything. */
function projectLinks(p: Project, withFigure: boolean): [string, string][] {
  const code = Object.entries(p.links)
    .filter((e): e is [string, string] => !!e[1] && !(withFigure && e[0] === "code"))
    .map(([k, url]): [string, string] => [LABELS[k] ?? k, url]);
  const sites = liveSites(p).slice(withFigure ? 1 : 0);
  return [...code, ...sites.map((s): [string, string] => [s.name, s.url])];
}

/** For team projects in a teammate's repo: the owner's own share of the work. */
function MyPart({ p }: { p: Project }) {
  if (!p.myPart) return null;
  return (
    <p className="my-part">
      <span className="my-part-label">My part:</span> {p.myPart}
    </p>
  );
}

/** Margin annotation for a project: the year (when known) over the stack, as
 *  data rather than a row of chips. Every project has a stack, so every row
 *  carries a note even when the year is missing. */
function Notes({ p }: { p: Project }) {
  return (
    <div className="margin data project-notes">
      {p.year && <p>{p.year}</p>}
      {p.tags.length > 0 && (
        <p className="stack">
          <span className="sr-only">Built with </span>
          {p.tags.join(" / ")}
        </p>
      )}
    </div>
  );
}

/** Collapsed write-up under a featured project; closed by default so the list stays skimmable. */
function CaseStudy({ p }: { p: Project }) {
  const cs = p.caseStudy;
  if (!cs) return null;
  const images = cs.images.map((src) => ({ src, found: findImage(src) })).filter((img) => img.found || !DEMO_ACTIVE);
  return (
    <details className="case-study">
      <summary>
        Read the case study
        <svg className="chev" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" focusable="false">
          <path d="M3.5 1.5 7 5l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </summary>
      {CASE_PARTS.map(([key, label]) => (
        <div key={key} className="case-part">
          <h4>{label}</h4>
          <OwnerText value={cs[key]} />
        </div>
      ))}
      {images.length > 0 && (
        <div className="case-images">
          {images.map(({ src, found }) =>
            found ? <Shot key={src} image={found} alt={`${p.name}: ${found.split("/").pop()}`} label={p.name} /> : <ImageNeeded key={src} path={src} />,
          )}
        </div>
      )}
    </details>
  );
}

/** Two-digit project number before a title: the list runs past nine, and equal
 *  widths keep the titles lined up. */
function Num({ n }: { n: number }) {
  return (
    <span className="proj-n" aria-hidden="true">
      {String(n).padStart(2, "0")}
    </span>
  );
}

/** A featured project: number and title first, so the reader knows what the
 *  picture shows before reaching it. The caption carries the year and the
 *  stack sits under the title, so the margin stays empty here. */
function Feature({ p, n }: { p: Project; n: number }) {
  return (
    <li className="entry feature">
      <div className="entry-body">
        <h3>
          <Num n={n} />
          {p.name}
        </h3>
        {p.tags.length > 0 && (
          <p className="feature-stack">
            <span className="sr-only">Built with </span>
            {p.tags.join(" / ")}
          </p>
        )}
        <ProjectMedia p={p} />
        <p className="feature-desc">{p.description || p.blurb}</p>
        <MyPart p={p} />
        <LinkList className="project-links" links={projectLinks(p, true)} />
        <CaseStudy p={p} />
      </div>
    </li>
  );
}

/** Everything else: one ruled row each. The name is the link. */
function IndexRow({ p, n }: { p: Project; n: number }) {
  const [first, ...more] = projectLinks(p, false);
  return (
    <li className="entry index-row">
      <Notes p={p} />
      <div className="entry-body">
        <h3>
          <Num n={n} />
          {first ? <OutLink className="title-link" url={first[1]}>{p.name}</OutLink> : p.name}
        </h3>
        <p className="index-blurb">{p.blurb}</p>
        <MyPart p={p} />
        <LinkList className="project-links" links={more} />
      </div>
    </li>
  );
}

export default function Projects() {
  const projects = featuredFirst(SITE.projects);
  const featured = projects.filter((p) => p.featured);
  // entries with something to click lead the index; sort is stable, so site.ts order holds within each group
  const rest = projects
    .filter((p) => !p.featured)
    .sort((a, b) => Number(projectLinks(b, false).length > 0) - Number(projectLinks(a, false).length > 0));
  return (
    <Section id="projects" title="Projects">
      <ol className="entries features">
        {featured.map((p, i) => (
          <Feature key={p.name} p={p} n={i + 1} />
        ))}
      </ol>
      {rest.length > 0 && (
        <>
          <h3 className="sub-h">More projects</h3>
          <ul className="entries project-index">
            {/* numbering carries on from the featured list: one count for the whole section */}
            {rest.map((p, i) => (
              <IndexRow key={p.name} p={p} n={featured.length + i + 1} />
            ))}
          </ul>
        </>
      )}
    </Section>
  );
}
