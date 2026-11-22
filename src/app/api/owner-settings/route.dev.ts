// Dev-only, like ../owner-save: writes the /settings switches to settings.json.

import { rejectRequest, saveSettings } from "@/professional/owner/save";

export async function POST(req: Request) {
  const rejected = rejectRequest(req);
  if (rejected) return rejected;
  const error = await saveSettings(await req.json().catch(() => null));
  return error ? new Response(error, { status: 400 }) : new Response(null, { status: 204 });
}
