import { SITE } from "@/content/site";
import SoundToggle from "../components/SoundToggle";
import FunModeLink from "../components/FunModeLink";

/** In-page anchors shown in the nav; each must match a section id. */
const NAV = [
  ["projects", "Projects"],
  ["experience", "Experience"],
  ["skills", "Skills"],
  ["about", "About"],
  ["background", "Background"],
  ["contact", "Contact"],
] as const;

export default function Header() {
  return (
    <header className="site-header">
      <nav className="nav" aria-label="Primary">
        <a className="nav-home" href="#top">
          {SITE.name}
        </a>
        <ul className="nav-links">
          {NAV.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`}>{label}</a>
            </li>
          ))}
        </ul>
        <div className="nav-tools">
          <SoundToggle />
          <FunModeLink />
        </div>
      </nav>
    </header>
  );
}
