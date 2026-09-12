import { env } from "cloudflare:workers";
import { initialTemplates } from "@/data/initial-templates.mjs";

export type TemplateRecord = {
  id: number;
  slug: string;
  taskNumber: number;
  title: string;
  recognition: string;
  problem: string;
  explanation: string;
  code: string;
  note: string;
  status: "draft" | "published";
  sortOrder: number;
};

const selectColumns = `id, slug, task_number AS taskNumber, title, recognition,
  problem, explanation, code, note, status, sort_order AS sortOrder`;

function binding() {
  if (!env.DB) throw new Error("База материалов временно недоступна");
  return env.DB;
}

export async function seedInitialTemplates() {
  const db = binding();
  const seeded = await db.prepare("SELECT value FROM site_state WHERE key = ?").bind("initial_seed").first();
  if (seeded) return;
  const inserts = initialTemplates.map((item) => db.prepare(`INSERT OR IGNORE INTO templates
    (slug, task_number, title, recognition, problem, explanation, code, note, status, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(
      item.slug, item.taskNumber, item.title, item.recognition, item.problem,
      item.explanation, item.code, item.note, item.status, item.sortOrder,
    ));
  await db.batch([
    ...inserts,
    db.prepare("INSERT OR REPLACE INTO site_state (key, value) VALUES (?, ?)").bind("initial_seed", "1"),
  ]);
}

export async function listPublishedSummaries() {
  await seedInitialTemplates();
  const result = await binding().prepare(`SELECT task_number AS taskNumber, COUNT(*) AS count
    FROM templates WHERE status = 'published' GROUP BY task_number`).all<{ taskNumber: number; count: number }>();
  return result.results;
}

export async function listPublishedTemplates(taskNumber: number) {
  await seedInitialTemplates();
  const result = await binding().prepare(`SELECT ${selectColumns} FROM templates
    WHERE task_number = ? AND status = 'published' ORDER BY sort_order, id`).bind(taskNumber).all<TemplateRecord>();
  return result.results;
}

export async function listAllTemplates() {
  await seedInitialTemplates();
  const result = await binding().prepare(`SELECT ${selectColumns} FROM templates
    ORDER BY task_number, sort_order, id`).all<TemplateRecord>();
  return result.results;
}

export async function createTemplate(input: Omit<TemplateRecord, "id" | "slug">) {
  const slug = `task-${input.taskNumber}-${Date.now().toString(36)}`;
  const result = await binding().prepare(`INSERT INTO templates
    (slug, task_number, title, recognition, problem, explanation, code, note, status, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING ${selectColumns}`).bind(
      slug, input.taskNumber, input.title.trim(), input.recognition.trim(), input.problem.trim(),
      input.explanation.trim(), input.code, input.note.trim(), input.status, input.sortOrder,
    ).first<TemplateRecord>();
  return result;
}

export async function updateTemplate(id: number, input: Omit<TemplateRecord, "id" | "slug">) {
  return binding().prepare(`UPDATE templates SET task_number = ?, title = ?, recognition = ?, problem = ?,
    explanation = ?, code = ?, note = ?, status = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? RETURNING ${selectColumns}`).bind(
      input.taskNumber, input.title.trim(), input.recognition.trim(), input.problem.trim(),
      input.explanation.trim(), input.code, input.note.trim(), input.status, input.sortOrder, id,
    ).first<TemplateRecord>();
}

export async function deleteTemplate(id: number) {
  await binding().prepare("DELETE FROM templates WHERE id = ?").bind(id).run();
}
