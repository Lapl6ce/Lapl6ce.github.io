import { SITE } from "@/content/site";
import SoundToggle from "../components/SoundToggle";
import FunModeLink from "../components/FunModeLink";

/** In-page anchors shown in the nav; each must match a section id. */
const NAV = [
  ["experience", "Experience"],
  ["projects", "Projects"],
  ["skills", "Skills"],
  ["education", "Education"],
  ["contact", "Contact"],
] as const;

export default function Header() {
  return (
    <header className="site-header">
      <nav className="nav" aria-label="Primary">
        <a className="nav-home" href="#top">
          {SITE.handle}
        </a>
        <ul className="nav-links">
          {NAV.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`}>
                {/* old menu-bar convention: first letter highlighted, as if it were a hotkey */}
                <span className="hot">{label[0]}</span>
                {label.slice(1)}
              </a>
            </li>
          ))}
        </ul>
        <SoundToggle />
        <FunModeLink />
      </nav>
    </header>
  );
}
