import test from "node:test";
import assert from "node:assert/strict";
import { TASK_NUMBERS, isTaskNumber } from "../lib/catalog.mjs";

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
