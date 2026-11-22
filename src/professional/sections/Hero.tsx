import { SITE, LINK_LABELS, profileLinks } from "@/content/site";
import { external } from "@/shared/links";
import HeroName from "../components/HeroName";
import OwnerText from "../owner/OwnerText";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <HeroName name={SITE.name} />
      <p className="hero-role">
        <span className="prompt" aria-hidden="true">&gt; </span>
        {SITE.role} @ {SITE.school}
      </p>
      <p className="hero-summary">
        <OwnerText as="span" value={SITE.summary} />
        <span className="cursor" aria-hidden="true" />
      </p>
      {SITE.now && (
        <p className="hero-now">
          <span className="hero-now-label">now:</span> <OwnerText as="span" value={SITE.now} />
        </p>
      )}
      <div className="hero-actions">
        {SITE.resume && (
          <a className="btn btn-primary" href={SITE.resume} target="_blank" rel="noopener">
            Résumé (PDF)
          </a>
        )}
        <a className="btn" href={`mailto:${SITE.email}`}>Email</a>
        {profileLinks().map(([k, url]) => (
          <a key={k} className="btn" href={url} {...external(url)}>
            {LINK_LABELS[k] || k}
          </a>
        ))}
      </div>
    </section>
  );
}
