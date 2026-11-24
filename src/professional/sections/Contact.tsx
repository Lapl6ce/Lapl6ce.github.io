import { SITE, contactRows } from "@/content/site";
import OutLink from "../components/OutLink";
import Section from "../components/Section";
import OwnerText from "../owner/OwnerText";

export default function Contact() {
  return (
    <Section id="contact" title="Contact">
      <OwnerText className="contact-note" value={SITE.contactNote} />
      <dl className="entries rows contact-list">
        {contactRows().map(({ key, label, url, text }) => (
          <div className="entry" key={key}>
            <dt className="margin data">{label}</dt>
            <dd className="entry-body">
              <OutLink url={url}>{text}</OutLink>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
