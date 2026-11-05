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
    for (const key of ["title", "problem", "code"]) {
      assert.equal(typeof item[key] === "string" && item[key].trim().length > 0, true);
    }
    if (item.status === "published") assert.ok(item.problem.trim().length >= 100, `${item.slug}: условие слишком короткое`);
    assert.match(item.status, /^(draft|published)$/);
  }
});

test("community repository adds the distinct verified task types", () => {
  const slugs = new Set(initialTemplates.map((item) => item.slug));
  for (const slug of [
    "8-community-word-indexes",
    "10-community-broadcast-address",
    "13-community-swap-last-digits",
    "14-community-max-zeroes-base4",
    "15-community-divisibility-with-interval",
    "16-community-functions-f-and-g",
    "19-community-one-heap-decrease",
    "21-community-two-heaps",
  ]) assert.equal(slugs.has(slug), true, `нет шаблона ${slug}`);
});

test("uncertain page 14 material remains a draft", () => {
  const uncertain = initialTemplates.filter((item) => item.note.includes("страница 14"));
  assert.ok(uncertain.length > 0);
  assert.ok(uncertain.every((item) => item.status === "draft"));
});
