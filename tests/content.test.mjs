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

test("task 23 includes every graph type from the update", () => {
  const task23Slugs = new Set(
    initialTemplates
      .filter((item) => item.taskNumber === 23 && item.status === "published")
      .map((item) => item.slug),
  );

  for (const slug of [
    "23-shortest-path-exactly-14-edges",
    "23-shortest-path-at-least-15-edges",
    "23-minimum-edge-count",
    "23-maximum-edge-count",
    "23-path-count-up-to-10-edges",
  ]) assert.equal(task23Slugs.has(slug), true, `нет шаблона ${slug}`);
});

test("task 9 publishes both spreadsheet types with code explanations", () => {
  const task9 = initialTemplates.filter((item) => item.taskNumber === 9 && item.status === "published");
  assert.deepEqual(task9.map((item) => item.slug), [
    "9-largest-row-two-triples",
    "9-count-rows-one-triple",
  ]);
  assert.ok(task9.every((item) => item.codeExplanation?.length > 100));
});

test("task 2 type names match the solving method", () => {
  const task2 = initialTemplates.filter((item) => item.taskNumber === 2 && item.status === "published");
  assert.deepEqual(task2.map((item) => item.title), ["Решение руками", "Автокод"]);
});

test("uncertain page 14 material remains a draft", () => {
  const uncertain = initialTemplates.filter((item) => item.note.includes("страница 14"));
  assert.ok(uncertain.length > 0);
  assert.ok(uncertain.every((item) => item.status === "draft"));
});
