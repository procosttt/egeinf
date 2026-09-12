const WEEK = 7 * 86_400_000;
const encoder = new TextEncoder();

const encode = (bytes) =>
  btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
const decode = (value) => {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
};

async function sign(payload, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(payload)));
}

export async function createSession(secret, now = Date.now()) {
  if (typeof secret !== "string" || secret.length < 16) throw new Error("SESSION_SECRET is too short");
  const payload = encode(encoder.encode(String(now + WEEK)));
  return `${payload}.${encode(await sign(payload, secret))}`;
}

export async function verifySession(token, secret, now = Date.now()) {
  try {
    if (typeof token !== "string" || typeof secret !== "string") return false;
    const [payload, signature, extra] = token.split(".");
    if (!payload || !signature || extra) return false;
    const expected = await sign(payload, secret);
    const actual = decode(signature);
    if (actual.length !== expected.length) return false;
    let difference = 0;
    for (let index = 0; index < actual.length; index += 1) difference |= actual[index] ^ expected[index];
    if (difference !== 0) return false;
    const expiresAt = Number(new TextDecoder().decode(decode(payload)));
    return Number.isFinite(expiresAt) && now <= expiresAt;
  } catch {
    return false;
  }
}

export async function requireAdmin(request, secrets) {
  const token = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim().split("="))
    .find(([name]) => name === "ege_admin")?.[1];
  if (!token || !secrets?.SESSION_SECRET || !(await verifySession(token, secrets.SESSION_SECRET))) {
    return Response.json({ error: "Требуется вход" }, { status: 401 });
  }
  return null;
}
