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

const templates = initialTemplates as TemplateRecord[];

export async function listPublishedSummaries() {
  const counts = new Map<number, number>();
  for (const item of templates) {
    if (item.status === "published") counts.set(item.taskNumber, (counts.get(item.taskNumber) ?? 0) + 1);
  }
  return [...counts].map(([taskNumber, count]) => ({ taskNumber, count }));
}

export async function listPublishedTemplates(taskNumber: number) {
  return templates
    .filter((item) => item.taskNumber === taskNumber && item.status === "published")
    .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
}
