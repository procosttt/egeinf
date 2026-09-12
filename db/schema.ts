import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const templates = sqliteTable(
  "templates",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull().unique(),
    taskNumber: integer("task_number").notNull(),
    title: text("title").notNull(),
    recognition: text("recognition").notNull().default(""),
    problem: text("problem").notNull(),
    explanation: text("explanation").notNull(),
    code: text("code").notNull(),
    note: text("note").notNull().default(""),
    status: text("status", { enum: ["draft", "published"] }).notNull().default("draft"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("idx_templates_task_status_order").on(table.taskNumber, table.status, table.sortOrder)],
);

export const siteState = sqliteTable("site_state", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});
