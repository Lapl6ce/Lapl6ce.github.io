/* Build-time check for files in public/. Lets a slot switch from its IMAGE
   NEEDED box to the real picture as soon as the file is dropped in, with no
   change to site.ts. Server components only: it reads the disk. */

import { existsSync } from "node:fs";
import { join } from "node:path";

/** True when `src` (a site path like "/assets/x.jpg") exists under public/. */
export const hasAsset = (src: string) => existsSync(join(process.cwd(), "public", src));

/** The path that exists under public/ for `src` or the same name with another
 *  image extension (photo.jpg, photo.jpeg, photo.png...), or null if none does.
 *  Re-exporting an image often changes the extension; this keeps that from
 *  silently dropping it from the page. */
export function findImage(src: string): string | null {
  const base = src.replace(/\.(jpe?g|png|webp|avif)$/i, "");
  const tries = [src, ...["jpg", "jpeg", "png", "webp", "avif"].map((ext) => `${base}.${ext}`)];
  return tries.find(hasAsset) ?? null;
}
