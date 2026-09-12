import test from "node:test";
import assert from "node:assert/strict";
import { initialTemplates } from "../data/initial-templates.mjs";
import { isTaskNumber } from "../lib/catalog.mjs";

test("seed templates have unique slugs and required content", () => {
  const slugs = new Set();
  for (const item of initialTemplates) {
    assert.equal(isTaskNumber(item.taskNumber), true);
    assert.match(item.slug, /^[a-z0-9-]+$/);
    assert.equal(slugs.has(item.slug), false);
    slugs.add(item.slug);
    for (const key of ["title", "problem", "explanation", "code"]) {
      assert.equal(typeof item[key] === "string" && item[key].trim().length > 0, true);
    }
    assert.match(item.status, /^(draft|published)$/);
  }
});

test("uncertain page 14 material remains a draft", () => {
  const uncertain = initialTemplates.filter((item) => item.note.includes("страница 14"));
  assert.ok(uncertain.length > 0);
  assert.ok(uncertain.every((item) => item.status === "draft"));
});
