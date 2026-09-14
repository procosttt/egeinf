export const TASK_NUMBERS = Array.from({ length: 27 }, (_, index) => index + 1);

export const isTaskNumber = (value) =>
  Number.isInteger(value) && value >= 1 && value <= 27;

export const summarizeCatalog = (summaries) => ({
  readyTasks: summaries.filter(({ count }) => count > 0).length,
  templates: summaries.reduce((total, { count }) => total + count, 0),
});

export const TASK_TOPICS = {
  2: "Таблицы истинности",
  5: "Алгоритмы и исполнители",
  6: "Исполнитель Черепаха",
  8: "Комбинаторика слов",
  9: "Обработка таблиц",
  13: "IP-адреса и маски",
  14: "Системы счисления",
  15: "Логические выражения",
  16: "Рекурсивные функции",
  17: "Последовательности",
  19: "Теория игр",
  20: "Теория игр",
  21: "Теория игр",
  23: "Графы и пути",
  25: "Обработка целых чисел",
};
