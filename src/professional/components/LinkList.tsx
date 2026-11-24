import { Fragment } from "react";
import OutLink from "./OutLink";

/** Links on one line, separated by slashes: "Email / GitHub ↗". */
export default function LinkList({ links, className }: { links: [string, string][]; className?: string }) {
  if (!links.length) return null;
  return (
    <p className={className}>
      {links.map(([label, url], i) => (
        <Fragment key={url}>
          {i > 0 && <span className="sep" aria-hidden="true"> / </span>}
          <OutLink url={url}>{label}</OutLink>
        </Fragment>
      ))}
    </p>
  );
}
