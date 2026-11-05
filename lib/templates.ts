import { initialTemplates } from "@/data/initial-templates.mjs";

export type TemplateRecord = {
  slug: string;
  taskNumber: number;
  title: string;
  recognition: string;
  problem: string;
  explanation: string;
  codeExplanation?: string;
  code?: string;
  manualGuide?: {
    introTitle: string;
    cards: Array<{
      title: string;
      formula?: string;
      body: string[];
      example?: string;
    }>;
    steps: Array<{ title: string; text: string }>;
    warning: { title: string; text: string };
  };
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
    .sort((a, b) => a.sortOrder - b.sortOrder || a.slug.localeCompare(b.slug));
}

export function listPublishedTemplateParams() {
  return templates
    .filter((item) => item.status === "published")
    .map((item) => ({ number: String(item.taskNumber), slug: item.slug }));
}

export async function getPublishedTemplate(taskNumber: number, slug: string) {
  return templates.find((item) => item.taskNumber === taskNumber && item.slug === slug && item.status === "published");
}
