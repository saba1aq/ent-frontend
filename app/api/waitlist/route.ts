import { parseWaitlistRequest, saveToNotion } from "@/views/landing/server";

export async function POST(request: Request) {
  const payload = parseWaitlistRequest(await request.json().catch(() => null));
  if (!payload) {
    return Response.json({ code: "invalid_request" }, { status: 400 });
  }

  try {
    await saveToNotion(payload);
  } catch (error) {
    console.error("waitlist: не удалось сохранить заявку", error);
    return Response.json({ code: "storage_unavailable" }, { status: 502 });
  }
  return Response.json({ ok: true }, { status: 201 });
}
