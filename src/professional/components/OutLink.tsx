import type { ReactNode } from "react";
import { external } from "@/shared/links";
import ExternalIcon from "./ExternalIcon";

/** A link that opens http(s) URLs in a new tab and marks them with the drawn arrow. */
export default function OutLink({ url, children, className }: { url: string; children: ReactNode; className?: string }) {
  const ext = external(url);
  return (
    <a className={className} href={url} {...ext}>
      {children}
      {ext.target && <ExternalIcon />}
    </a>
  );
}
