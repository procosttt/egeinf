import test from "node:test";
import assert from "node:assert/strict";
import { createSession, verifySession } from "../lib/session.mjs";

test("signed owner session validates, rejects changes and expires", async () => {
  const secret = "test-secret-with-enough-length";
  const token = await createSession(secret, 1_000);
  assert.equal(await verifySession(token, secret, 1_000), true);
  assert.equal(await verifySession(token + "x", secret, 1_000), false);
  assert.equal(await verifySession(token, secret, 1_000 + 7 * 86_400_000 + 1), false);
});
