import { SITE, contactRows } from "@/content/site";
import LinkList from "../components/LinkList";
import OwnerText from "../owner/OwnerText";

// Runs while the page parses, before the name is drawn, so a return visit in
// the same session never sees the opening animation start and then stop.
const INTRO_ONCE = `try{var k="name-intro";if(sessionStorage.getItem(k))document.documentElement.dataset.introSeen="1";else sessionStorage.setItem(k,"1")}catch(e){}`;

// Upwork is for freelance clients, so it lives in Contact; the hero is for the reader deciding whether to reach out.
const HERO_LINKS = ["email", "github", "linkedin"];

export default function Hero() {
  const [first, ...rest] = SITE.name.split(" ");
  const links = contactRows()
    .filter((r) => HERO_LINKS.includes(r.key))
    .map((r): [string, string] => [r.label, r.url]);
  return (
    <section className="hero" id="top">
      <script dangerouslySetInnerHTML={{ __html: INTRO_ONCE }} />
      {/* one span per line keeps the line count fixed while the width axis animates */}
      <h1 className="hero-name">
        <span>{first}</span> <span>{rest.join(" ")}</span>
      </h1>
      <p className="hero-role">{SITE.headline ?? `${SITE.role}, ${SITE.school}`}</p>
      <OwnerText className="hero-lead" value={SITE.summary} />
      {SITE.now && (
        <p className="hero-now">
          <span className="hero-now-label">Now</span> <OwnerText as="span" value={SITE.now} />
        </p>
      )}
      <div className="hero-actions">
        {SITE.resume && (
          <a className="btn-primary" href={SITE.resume} target="_blank" rel="noopener">
            Résumé (PDF)
          </a>
        )}
        <LinkList className="hero-links" links={links} />
      </div>
    </section>
  );
}
