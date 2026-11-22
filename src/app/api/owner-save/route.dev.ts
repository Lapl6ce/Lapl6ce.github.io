// Dev-only: next.config.ts adds the `dev.ts` page extension only for `next dev`,
// so this route doesn't exist in the static export.

import { rejectRequest, saveOwnerText } from "@/professional/owner/save";

export async function POST(req: Request) {
  const rejected = rejectRequest(req);
  if (rejected) return rejected;

  const body: unknown = await req.json().catch(() => null);
  const { from, to } = (body ?? {}) as { from?: unknown; to?: unknown };
  if (typeof from !== "string" || typeof to !== "string") return new Response("Expected { from, to } strings.", { status: 400 });

  const error = await saveOwnerText(from, to);
  return error ? new Response(error, { status: 409 }) : new Response(null, { status: 204 });
}
