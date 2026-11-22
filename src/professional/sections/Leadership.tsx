import { SITE } from "@/content/site";
import Timeline from "../components/Timeline";
import { entryRows } from "./Experience";

export default function Leadership() {
  if (!SITE.leadership.length) return null;
  return (
    <section className="section" id="leadership" aria-labelledby="lead-h">
      <h2 id="lead-h">Leadership &amp; Activities</h2>
      <Timeline rows={entryRows(SITE.leadership)} />
      {SITE.also && (
        <p className="also">
          <strong>NOTE: </strong>
          {SITE.also}
        </p>
      )}
    </section>
  );
}
