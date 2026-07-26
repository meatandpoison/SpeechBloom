import { kv } from "@vercel/kv";

export const config = { runtime: "edge" };

export default async function handler(req) {
  const url = new URL(req.url);

  if (req.method === "GET") {
    const id = url.searchParams.get("id");
    if (!id) return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });
    const data = await kv.get(`progress:${id}`);
    return new Response(JSON.stringify(data ?? null), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (req.method === "POST") {
    let body;
    try { body = await req.json(); } catch { return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 }); }
    const { id, data } = body ?? {};
    if (!id) return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });
    await kv.set(`progress:${id}`, data);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
}
