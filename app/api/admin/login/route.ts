import { env } from "cloudflare:workers";
import { createSession } from "@/lib/session.mjs";

const sameOrigin = (request: Request) => {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
};

async function digest(value: string) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}

async function equalPassword(left: string, right: string) {
  const [a, b] = await Promise.all([digest(left), digest(right)]);
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) difference |= a[index] ^ b[index];
  return difference === 0;
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: "Запрос отклонён" }, { status: 403 });
  const { password } = await request.json().catch(() => ({ password: "" }));
  if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET || !(await equalPassword(String(password), env.ADMIN_PASSWORD))) {
    return Response.json({ error: "Неверный пароль" }, { status: 401 });
  }
  const token = await createSession(env.SESSION_SECRET);
  return new Response(null, {
    status: 204,
    headers: { "Set-Cookie": `ege_admin=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800` },
  });
}
