import { SITE } from "@/content/site";

export default function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-h">
      <h2 id="about-h">About</h2>
      <div className="prose">
        {SITE.about.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </section>
  );
}
