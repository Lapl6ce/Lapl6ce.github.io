/* The preview at the top of each project card. Order of preference:
   live site → screenshot → how-it-works diagram → generated cover. */

import { hueOf, liveSites, type Project } from "@/content/site";
import Preview from "./Preview";

function Cover({ p }: { p: Project }) {
  const style = { "--cover-h": hueOf(p.name) } as React.CSSProperties;
  return (
    <div className="cover" style={style} aria-hidden="true">
      {p.flow?.length ? (
        <ol className="flow">
          {p.flow.map((step, i) => (
            <li key={step} className="flow-step">
              <span className="flow-node">
                <span className="flow-num">{String(i + 1).padStart(2, "0")}</span>
                {step}
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <div className="cover-title">
          <span className="cover-name">{p.name}</span>
          {p.tags.length > 0 && <span className="cover-tags">{p.tags.join("  ·  ")}</span>}
        </div>
      )}
    </div>
  );
}

export default function ProjectMedia({ p }: { p: Project }) {
  const sites = liveSites(p);
  if (sites.length) return <Preview site={sites[0]} compact />;

  if (p.preview) {
    const href = p.links.demo || p.links.code;
    const inner = (
      <>
        <div className="preview-bar" aria-hidden="true">
          <span className="preview-dots"><i /><i /><i /></span>
          <span className="preview-url">{p.name}</span>
          {href && <span className="preview-open">↗</span>}
        </div>
        <div className="preview-shot">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.preview} alt={`Screenshot of ${p.name}`} loading="lazy" />
        </div>
      </>
    );
    return href ? (
      <a className="preview" href={href} target="_blank" rel="noopener" aria-label={`${p.name} (opens in a new tab)`}>
        {inner}
      </a>
    ) : (
      <div className="preview is-static">{inner}</div>
    );
  }

  return <Cover p={p} />;
}
