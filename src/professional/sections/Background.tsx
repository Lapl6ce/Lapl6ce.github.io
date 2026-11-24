import Section from "../components/Section";
import Education from "./Education";
import Leadership from "./Leadership";

/** Education and leadership under one heading, so the page has a few big
 *  sections instead of a long run of identical ones. */
export default function Background() {
  return (
    <Section id="background" title="Background">
      <Education />
      <Leadership />
    </Section>
  );
}
