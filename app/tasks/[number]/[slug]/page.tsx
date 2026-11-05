import { ViewTransition } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CodeBlock } from "@/components/code-block";
import { isTaskNumber, TASK_TOPICS } from "@/lib/catalog.mjs";
import {
  getPublishedTemplate,
  listPublishedTemplateParams,
  listPublishedTemplates,
} from "@/lib/templates";

export function generateStaticParams() {
  return listPublishedTemplateParams();
}

export const dynamicParams = false;

export default async function TemplatePage({
  params,
}: {
  params: Promise<{ number: string; slug: string }>;
}) {
  const { number: rawNumber, slug } = await params;
  const number = Number(rawNumber);
  if (!isTaskNumber(number)) notFound();

  const [templates, template] = await Promise.all([
    listPublishedTemplates(number),
    getPublishedTemplate(number, slug),
  ]);
  if (!template) notFound();

  const activeIndex = templates.findIndex((item) => item.slug === slug);
  const topic = TASK_TOPICS[number as keyof typeof TASK_TOPICS] ?? `Задание ${number}`;

  return (
    <main>
      <header className="site-header">
        <Link className="brand" href="/"><span className="brand-mark">27</span><span>Шаблоны ЕГЭ</span></Link>
        <Link className="text-link" href="/" transitionTypes={["nav-back"]}>Все задания</Link>
      </header>

      <article className="task-page">
        <div className="task-intro">
          <div><p className="eyebrow">Задание {number}</p><h1>{topic}</h1></div>
          <p className="task-count">Тип <strong>{activeIndex + 1}</strong> из {templates.length}</p>
        </div>

        <nav className="template-nav" aria-label="Типы задания">
          {templates.map((item, index) => (
            <Link
              aria-current={item.slug === slug ? "page" : undefined}
              className={`template-link ${item.slug === slug ? "is-active" : ""}`}
              href={`/tasks/${number}/${item.slug}`}
              key={item.slug}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.title}
            </Link>
          ))}
        </nav>

        <ViewTransition key={slug} name="template-content" share="auto" enter="auto" default="none">
          <div className="template-content">
            <section className="template-condition">
              <span className="section-index">Условие</span>
              <h2>{template.title}</h2>
              <p>{template.problem}</p>
            </section>
            <section className="template-code">
              <div className="template-code-heading"><span className="section-index">Решение</span><p>Готовый шаблон на Python</p></div>
              <CodeBlock code={template.code} />
              {template.codeExplanation ? (
                <aside className="code-explanation">
                  <h3>Как работает код</h3>
                  <p>{template.codeExplanation}</p>
                </aside>
              ) : null}
            </section>
          </div>
        </ViewTransition>
      </article>

      <footer className="site-footer"><p>Нашёл ошибку? Напиши Косте.</p><nav><a href="https://github.com/procosttt/egeinf" target="_blank" rel="noreferrer">Made by procost ↗</a></nav></footer>
    </main>
  );
}
