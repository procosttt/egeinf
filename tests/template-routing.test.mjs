import test from "node:test";
import assert from "node:assert/strict";
import { initialTemplates } from "../data/initial-templates.mjs";

test("every published template has a stable route inside its task", () => {
  const routes = initialTemplates
    .filter((item) => item.status === "published")
    .map((item) => `/tasks/${item.taskNumber}/${item.slug}`);

  assert.equal(new Set(routes).size, routes.length);
  assert.ok(routes.every((route) => /^\/tasks\/([1-9]|1\d|2[0-7])\/[a-z0-9-]+$/.test(route)));
});
