import { SITE, LINK_LABELS, domain, liveSites, featuredFirst, type TimelineEntry } from "@/content/site";
import ProjectMedia from "@/components/classic/ProjectMedia";
import Starfield from "@/components/classic/Starfield";
import Terminal from "@/components/Terminal";
import HeroName from "@/components/classic/HeroName";
import SoundToggle from "@/components/classic/SoundToggle";
import FunModeLink from "@/components/classic/FunModeLink";

const ext = (url: string) => (/^https?:/.test(url) ? { target: "_blank", rel: "noopener" } : {});
const links = Object.entries(SITE.links).filter((e): e is [string, string] => !!e[1]);

function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="timeline">
      {entries.map((job) => (
          <li className="timeline-item" key={job.title + job.date}>
            <div className="timeline-head">
              <h3>
                {job.title}
                {job.org && <span className="at"> · {job.org}</span>}
              </h3>
              <span className="meta">{job.date}</span>
            </div>
            {job.location && <p className="meta">{job.location}</p>}
            <ul className="bullets">
              {job.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
          </li>
      ))}
    </ol>
  );
}

export default function ClassicPage() {
  return (
    <>
      <Starfield />
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <nav className="nav" aria-label="Primary">
          <a className="nav-home" href="#top">
            {SITE.handle}
          </a>
          <ul className="nav-links">
            <li><a href="#experience">Experience</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#education">Education</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <SoundToggle />
          <FunModeLink />
        </nav>
      </header>

      <main id="main">
        <section className="hero" id="top">
          {SITE.status && <p className="eyebrow">{SITE.status}</p>}
          <HeroName name={SITE.name} />
          <p className="hero-role">
            {SITE.role} · {SITE.school}
          </p>
          <p className="hero-summary">{SITE.summary}</p>
          <div className="hero-actions">
            {SITE.resume && (
              <a className="btn btn-primary" href={SITE.resume} target="_blank" rel="noopener">
                Résumé (PDF)
              </a>
            )}
            <a className="btn" href={`mailto:${SITE.email}`}>Email</a>
            {links.map(([k, url]) => (
              <a key={k} className="btn" href={url} {...ext(url)}>
                {LINK_LABELS[k] || k}
              </a>
            ))}
          </div>
        </section>

        <section className="section" id="about" aria-labelledby="about-h">
          <h2 id="about-h">About</h2>
          <div className="prose">
            {SITE.about.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>

        {SITE.experience.length > 0 && (
          <section className="section" id="experience" aria-labelledby="exp-h">
            <h2 id="exp-h">Experience</h2>
            <Timeline entries={SITE.experience} />
          </section>
        )}

        <section className="section section-wide" id="projects" aria-labelledby="proj-h">
          <h2 id="proj-h">Projects</h2>
          <ul className="project-grid">
            {featuredFirst(SITE.projects).map((p) => {
              const sites = liveSites(p);
              const codeLinks = Object.entries(p.links).filter((e): e is [string, string] => !!e[1]);
              return (
                <li className="project has-preview" key={p.name}>
                  <ProjectMedia p={p} />
                  <div className="project-head">
                    <h3>{p.name}</h3>
                    {p.year && <span className="meta">{p.year}</span>}
                  </div>
                  <p>{p.blurb}</p>
                  {p.tags.length > 0 && (
                    <ul className="tags" aria-label="Technologies">
                      {p.tags.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  )}
                  {(codeLinks.length > 0 || sites.length > 1) && (
                    <div className="project-links">
                      {codeLinks.map(([label, url]) => (
                        <a key={label} href={url} {...ext(url)}>
                          {label}
                          <span aria-hidden="true"> ↗</span>
                        </a>
                      ))}
                      {sites.slice(1).map((s) => (
                        <a key={s.url} href={s.url} {...ext(s.url)}>
                          {s.name}
                          <span aria-hidden="true"> ↗</span>
                        </a>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="section" id="skills" aria-labelledby="skills-h">
          <h2 id="skills-h">Skills</h2>
          <dl className="skills">
            {SITE.skills.map((g) => [
              <dt key={g.group + "-t"}>{g.group}</dt>,
              <dd key={g.group + "-d"}>{g.items.join(" · ")}</dd>,
            ])}
          </dl>
        </section>

        <section className="section" id="education" aria-labelledby="edu-h">
          <h2 id="edu-h">Education</h2>
          <ol className="timeline">
            {SITE.education.map((e) => (
              <li className="timeline-item" key={e.school}>
                <div className="timeline-head">
                  <h3>{e.school}</h3>
                  <span className="meta">{e.date}</span>
                </div>
                <p className="edu-degree">
                  {e.degree}
                  {e.location && <span className="meta"> · {e.location}</span>}
                </p>
                {e.points && (
                  <ul className="bullets">
                    {e.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </section>

        {SITE.leadership.length > 0 && (
          <section className="section" id="leadership" aria-labelledby="lead-h">
            <h2 id="lead-h">Leadership &amp; Activities</h2>
            <Timeline entries={SITE.leadership} />
            {SITE.also && (
              <p className="also">
                <strong>Also: </strong>
                {SITE.also}
              </p>
            )}
          </section>
        )}

        <section className="section" id="contact" aria-labelledby="contact-h">
          <h2 id="contact-h">Contact</h2>
          <p className="prose">Open to software development internships and freelance work. Email is the fastest way to reach me.</p>
          <ul className="contact-list">
            <li>
              <span className="meta">Email</span>
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </li>
            {links.map(([k, url]) => (
              <li key={k}>
                <span className="meta">{LINK_LABELS[k] || k}</span>
                <a href={url} {...ext(url)}>
                  {domain(url)}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="site-footer">
        <p>
          © {new Date().getFullYear()} {SITE.name} · <a href="/play/">try fun mode</a>, a console-style version of this site · press <kbd>`</kbd> for a terminal
        </p>
      </footer>

      <Terminal mode="classic" />
    </>
  );
}
