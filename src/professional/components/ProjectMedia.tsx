/* The picture for a featured project. Order of preference:
   live site → screenshot → how-it-works diagram → generated cover. */

import { domain, hueOf, liveSites, type Project } from "@/content/site";
import BrowserFrame from "./BrowserFrame";

const RAMP = " .:-=+*#"; // light to dense

/** Deterministic ASCII texture for a cover: overlapping sine waves sampled on a
 *  character grid, seeded by the project name so every cover differs but the
 *  server and client render the same text. */
function asciiField(seed: number, cols = 100, rows = 34) {
  const a = 0.08 + (seed % 7) * 0.015;
  const b = 0.18 + (seed % 5) * 0.03;
  const phase = seed / 57;
  let out = "";
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // three waves in different directions, summed to roughly -3..3
      const v = Math.sin(x * a + phase) + Math.sin(y * b - phase) + Math.sin((x + y * 2) * a * 0.7 + phase * 2);
      out += RAMP[Math.min(RAMP.length - 1, Math.max(0, Math.floor(((v + 3) / 6) * RAMP.length)))];
    }
    out += "\n";
  }
  return out;
}

function Cover({ p }: { p: Project }) {
  return (
    <div className="cover" aria-hidden="true">
      <pre className="cover-field">{asciiField(hueOf(p.name))}</pre>
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
          {p.tags.length > 0 && <span className="cover-tags">{p.tags.join(" / ")}</span>}
        </div>
      )}
    </div>
  );
}

export default function ProjectMedia({ p }: { p: Project }) {
  const [site] = liveSites(p);
  if (site) return <BrowserFrame name={site.name} label={domain(site.url)} image={site.image} href={site.url} />;
  if (p.preview) return <BrowserFrame name={p.name} label={p.name} image={p.preview} href={p.links.demo || p.links.code} />;
  return <Cover p={p} />;
}
