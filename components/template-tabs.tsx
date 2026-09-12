"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/code-block";
import type { TemplateRecord } from "@/lib/templates";

export function TemplateTabs({ templates }: { templates: TemplateRecord[] }) {
  return (
    <Tabs defaultValue={String(templates[0].id)}>
      <TabsList className="template-tab-list" aria-label="Типы задания">
        {templates.map((item) => <TabsTrigger className="template-tab" key={item.id} value={String(item.id)}>{item.title}</TabsTrigger>)}
      </TabsList>
      {templates.map((item) => (
        <TabsContent className="template-panel" key={item.id} value={String(item.id)}>
          {item.recognition && <section><h2>Как распознать</h2><p>{item.recognition}</p></section>}
          <section><h2>Условие</h2><p>{item.problem}</p></section>
          <section><h2>Разбор</h2><p>{item.explanation}</p></section>
          <section><h2>Шаблон</h2><CodeBlock code={item.code} /></section>
          {item.note && <aside className="note"><strong>Примечание</strong><p>{item.note}</p></aside>}
        </TabsContent>
      ))}
    </Tabs>
  );
}
