import test from "node:test";
import assert from "node:assert/strict";
import { publicOnly, validateTemplateInput } from "../lib/template-rules.mjs";

const valid = {
  taskNumber: 15,
  title: "Отрезки",
  recognition: "Даны два отрезка",
  problem: "Найдите длину A",
  explanation: "Переберите границы",
  code: "print(1)",
  note: "",
  status: "published",
  sortOrder: 0,
};

test("publicOnly removes drafts", () => {
  assert.deepEqual(publicOnly([{ status: "draft" }, { status: "published" }]), [
    { status: "published" },
  ]);
});

test("validation rejects invalid task numbers and empty code", () => {
  assert.throws(() => validateTemplateInput({ ...valid, taskNumber: 28 }));
  assert.throws(() => validateTemplateInput({ ...valid, code: " " }));
  assert.deepEqual(validateTemplateInput(valid), valid);
});
