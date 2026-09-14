"use client";

import { KeyboardEvent, useState } from "react";
import { CodeBlock } from "@/components/code-block";
import type { TemplateRecord } from "@/lib/templates";

function TemplatePanel({ item }: { item: TemplateRecord }) {
  return (
    <div
      className="template-panel"
      data-state="active"
      role="tabpanel"
      id={`panel-${item.slug}`}
      aria-labelledby={`tab-${item.slug}`}
    >
      {item.recognition && (
        <section className="template-section template-section-recognition">
          <span className="section-index">01</span>
          <h2>Как распознать</h2>
          <p>{item.recognition}</p>
        </section>
      )}
      <section className="template-section template-section-problem">
        <span className="section-index">02</span>
        <h2>Условие</h2>
        <p>{item.problem}</p>
      </section>
      <section className="template-section template-section-explanation">
        <span className="section-index">03</span>
        <h2>Разбор</h2>
        <p>{item.explanation}</p>
      </section>
      <section className="template-section template-section-code">
        <span className="section-index">04</span>
        <h2>Шаблон</h2>
        <CodeBlock code={item.code} />
      </section>
      {item.note && (
        <aside className="note">
          <strong>Примечание</strong>
          <p>{item.note}</p>
        </aside>
      )}
    </div>
  );
}

export function TemplateTabs({ templates }: { templates: TemplateRecord[] }) {
  const [activeSlug, setActiveSlug] = useState(templates[0].slug);
  const active = templates.find((item) => item.slug === activeSlug) ?? templates[0];

  function onTabListKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const index = templates.findIndex((item) => item.slug === active.slug);
    const offset = event.key === "ArrowRight" ? 1 : -1;
    const next = templates[(index + offset + templates.length) % templates.length];
    setActiveSlug(next.slug);
    event.currentTarget.querySelector<HTMLButtonElement>(`#tab-${next.slug}`)?.focus();
  }

  return (
    <div className="template-tabs">
      <div className="template-tab-list" role="tablist" aria-label="Типы задания" onKeyDown={onTabListKeyDown}>
        {templates.map((item) => {
          const selected = item.slug === active.slug;
          return (
            <button
              className="template-tab"
              key={item.slug}
              type="button"
              role="tab"
              id={`tab-${item.slug}`}
              aria-selected={selected}
              aria-controls={`panel-${item.slug}`}
              data-state={selected ? "active" : "inactive"}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveSlug(item.slug)}
            >
              {item.title}
            </button>
          );
        })}
      </div>
      <TemplatePanel item={active} />
    </div>
  );
}
