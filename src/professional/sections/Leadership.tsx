import { SITE } from "@/content/site";
import Timeline from "../components/Timeline";
import { entryRows } from "./Experience";

/** Part of the Background section. */
export default function Leadership() {
  if (!SITE.leadership.length) return null;
  return (
    <>
      <h3 className="sub-h">Leadership &amp; activities</h3>
      <Timeline rows={entryRows(SITE.leadership)} />
    </>
  );
}
