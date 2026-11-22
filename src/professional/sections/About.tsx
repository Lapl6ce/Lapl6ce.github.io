import { SITE } from "@/content/site";
import { DEMO_ACTIVE } from "@/content/demo";
import { findImage } from "../assets";
import ImageNeeded from "../components/ImageNeeded";
import OwnerText from "../owner/OwnerText";

export default function About() {
  const wanted = SITE.photo ?? "/assets/photo.jpg";
  const found = SITE.photo ? findImage(wanted) : null;
  return (
    <section className="section" id="about" aria-labelledby="about-h">
      <h2 id="about-h">About</h2>
      <div className="prose">
        {/* first in the flow so it floats beside the opening paragraph */}
        {(found || !DEMO_ACTIVE) && (
          <figure className="about-photo">
            {found ? (
              <img src={found} alt={`Photo of ${SITE.name}`} width={800} height={800} />
            ) : (
              <ImageNeeded path={wanted} spec="800×800 JPG, square" square />
            )}
          </figure>
        )}
        {SITE.about.map((p, i) => (
          <OwnerText key={i} value={p} />
        ))}
      </div>
    </section>
  );
}
