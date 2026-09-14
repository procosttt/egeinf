import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("project uses the standard Next.js runtime without Cloudflare bindings", async () => {
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url)));
  const templatesSource = await readFile(new URL("../lib/templates.ts", import.meta.url), "utf8");

  assert.equal(packageJson.scripts.dev, "next dev");
  assert.equal(packageJson.scripts.build, "next build");
  assert.equal(packageJson.scripts.start, "next start");
  assert.doesNotMatch(templatesSource, /cloudflare:workers|env\.DB/);
});
