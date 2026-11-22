import { SITE, LINK_LABELS, domain, profileLinks } from "@/content/site";
import { external } from "@/shared/links";
import OwnerText from "../owner/OwnerText";

export default function Contact() {
  return (
    <section className="section" id="contact" aria-labelledby="contact-h">
      <h2 id="contact-h">Contact</h2>
      <OwnerText className="prose" value={SITE.contactNote} />
      <dl className="leaders contact-box">
        <dt>Email</dt>
        <dd>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        </dd>
        {profileLinks().map(([k, url]) => [
          <dt key={k + "-t"}>{LINK_LABELS[k] || k}</dt>,
          <dd key={k + "-d"}>
            <a href={url} {...external(url)}>
              {domain(url)}
            </a>
          </dd>,
        ])}
      </dl>
    </section>
  );
}
