import { isTaskNumber } from "./catalog.mjs";

const requiredText = ["title", "problem", "explanation", "code"];

export const publicOnly = (items) =>
  items.filter((item) => item.status === "published");

export function validateTemplateInput(input) {
  if (!input || typeof input !== "object" || !isTaskNumber(input.taskNumber)) {
    throw new Error("Выберите номер задания от 1 до 27");
  }
  for (const key of requiredText) {
    if (typeof input[key] !== "string" || !input[key].trim()) {
      throw new Error(`Поле ${key} не заполнено`);
    }
  }
  if (typeof input.recognition !== "string" || typeof input.note !== "string") {
    throw new Error("Текстовые поля заполнены неверно");
  }
  if (!Number.isInteger(input.sortOrder)) throw new Error("Порядок должен быть целым числом");
  if (input.status !== "draft" && input.status !== "published") {
    throw new Error("Статус должен быть draft или published");
  }
  return input;
}
