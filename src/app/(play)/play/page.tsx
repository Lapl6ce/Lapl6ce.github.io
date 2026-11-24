import Xmb from "@/play/Xmb";
import { ROUTES } from "@/shared/links";

// Marks <html> while the page parses, so a second visit in the same session
// never paints the start screen at all (Xmb.tsx reads the same key).
const BOOT_ONCE = `try{if(sessionStorage.getItem("play-boot"))document.documentElement.dataset.bootSeen="1"}catch(e){}`;

export default function PlayPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: BOOT_ONCE }} />
      <noscript>
        <p className="noscript">
          This version needs JavaScript. <a href={ROUTES.professional}>Go to the professional site</a>.
        </p>
      </noscript>
      <Xmb />
    </>
  );
}
