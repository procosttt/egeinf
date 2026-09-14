import test from "node:test";
import assert from "node:assert/strict";
import { TASK_NUMBERS, isTaskNumber, summarizeCatalog } from "../lib/catalog.mjs";

test("catalog contains every EGE task exactly once", () => {
  assert.deepEqual(TASK_NUMBERS, Array.from({ length: 27 }, (_, index) => index + 1));
  assert.equal(new Set(TASK_NUMBERS).size, 27);
});

test("task number validation accepts only integers from 1 to 27", () => {
  assert.equal(isTaskNumber(1), true);
  assert.equal(isTaskNumber(27), true);
  for (const value of [0, 28, 1.5, "15", null]) {
    assert.equal(isTaskNumber(value), false);
  }
});

test("catalog summary counts ready tasks and published templates", () => {
  assert.deepEqual(
    summarizeCatalog([
      { taskNumber: 2, count: 2 },
      { taskNumber: 8, count: 3 },
      { taskNumber: 25, count: 10 },
    ]),
    { readyTasks: 3, templates: 15 },
  );
});
