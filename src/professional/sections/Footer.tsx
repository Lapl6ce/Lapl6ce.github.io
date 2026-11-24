import { SITE } from "@/content/site";
import { ROUTES } from "@/shared/links";

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>
        © {new Date().getFullYear()} {SITE.name} · <a href={ROUTES.play}>try fun mode</a>, a console-style version of this
        site
      </p>
    </footer>
  );
}
