import { SITE } from "@/content/site";
import { DEMO_ACTIVE } from "@/content/demo";
import { findImage } from "../assets";
import ImageNeeded from "../components/ImageNeeded";
import Section from "../components/Section";
import OwnerText from "../owner/OwnerText";

export default function About() {
  const wanted = SITE.photo ?? "/assets/photo.jpg";
  const found = SITE.photo ? findImage(wanted) : null;
  return (
    <Section id="about" title="About">
      {/* in the margin beside the text on wide screens, above it on phones */}
      {(found || !DEMO_ACTIVE) && (
        <figure className="margin about-photo">
          {found ? (
            <img src={found} alt={`Photo of ${SITE.name}`} width={800} height={800} />
          ) : (
            <ImageNeeded path={wanted} spec="800×800 JPG, square" square />
          )}
        </figure>
      )}
      <div className="prose">
        {SITE.about.map((p, i) => (
          <OwnerText key={i} value={p} />
        ))}
      </div>
    </Section>
  );
}
