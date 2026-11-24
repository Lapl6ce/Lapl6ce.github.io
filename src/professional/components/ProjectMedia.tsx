/* The figure for a featured project, captioned like a lab report. Picture, in
   order of preference: live site → screenshot → the `imageNeeded` file (or a
   box asking for it) → how-it-works diagram → the name on a plain ground.
   Demo mode skips the box. The caption carries the links and the year, not the picture. */

import { Fragment, type ReactNode } from "react";
import { domain, liveSites, type Project } from "@/content/site";
import { DEMO_ACTIVE } from "@/content/demo";
import { findImage } from "../assets";
import OutLink from "./OutLink";
import ImageNeeded from "./ImageNeeded";
import Shot from "./Shot";

function Flow({ steps }: { steps: string[] }) {
  return (
    <ol className="flow" aria-label="How it works">
      {steps.map((step) => (
        <li key={step} className="flow-step">
          {step}
        </li>
      ))}
    </ol>
  );
}

/** The picture and the first thing its caption names. */
function picture(p: Project): { media: ReactNode; label: ReactNode } {
  const [site] = liveSites(p);
  if (site) {
    return {
      media: <Shot image={site.image} alt={`Screenshot of ${site.name}`} label={domain(site.url)} />,
      label: <OutLink url={site.url}>{domain(site.url)}</OutLink>,
    };
  }
  const shot = p.preview || (p.imageNeeded && findImage(p.imageNeeded));
  if (shot) return { media: <Shot image={shot} alt={`Screenshot of ${p.name}`} label={p.name} />, label: p.name };
  if (p.imageNeeded && !DEMO_ACTIVE) return { media: <ImageNeeded path={p.imageNeeded} />, label: p.name };
  if (p.flow?.length) return { media: <Flow steps={p.flow} />, label: "How it works" };
  return { media: <div className="shot is-empty"><span>{p.name}</span></div>, label: p.name };
}

export default function ProjectMedia({ p, n }: { p: Project; n: number }) {
  const { media, label } = picture(p);
  const parts: ReactNode[] = [label];
  if (p.links.code) parts.push(<OutLink url={p.links.code}>Code</OutLink>);
  if (p.year) parts.push(<span className="fig-year">{p.year}</span>);
  return (
    <figure className="fig">
      {media}
      <figcaption>
        <span className="fig-n">Fig. {n}</span>{" "}
        {parts.map((part, i) => (
          <Fragment key={i}>
            {i > 0 && <span className="sep" aria-hidden="true"> · </span>}
            {part}
          </Fragment>
        ))}
      </figcaption>
    </figure>
  );
}
