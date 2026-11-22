import Xmb from "@/play/Xmb";
import { ROUTES } from "@/shared/links";

export default function PlayPage() {
  return (
    <>
      <noscript>
        <p className="noscript">
          This version needs JavaScript. <a href={ROUTES.professional}>Go to the professional site</a>.
        </p>
      </noscript>
      <Xmb />
    </>
  );
}
