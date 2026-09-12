export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: "Запрос отклонён" }, { status: 403 });
  }
  return new Response(null, {
    status: 204,
    headers: { "Set-Cookie": "ege_admin=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0" },
  });
}
