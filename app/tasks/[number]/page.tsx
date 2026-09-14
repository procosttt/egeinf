import { notFound } from "next/navigation";
import { TemplateTabs } from "@/components/template-tabs";
import { isTaskNumber, TASK_TOPICS } from "@/lib/catalog.mjs";
import { listPublishedTemplates } from "@/lib/templates";

export const dynamic = "force-dynamic";

export default async function TaskPage({ params }: { params: Promise<{ number: string }> }) {
  const number = Number((await params).number);
  if (!isTaskNumber(number)) notFound();
  const templates = await listPublishedTemplates(number);
  const topic = TASK_TOPICS[number as keyof typeof TASK_TOPICS];

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="/"><span className="brand-mark">27</span><span>Шаблоны ЕГЭ</span></a>
        <a className="text-link" href="/">Все задания</a>
      </header>
      <article className="task-page">
        <div className="task-intro">
          <div><p className="eyebrow">Задание {number}</p><h1>{topic ?? `Задание ${number}`}</h1></div>
          {templates.length > 0 && <p className="task-count">Типов: <strong>{templates.length}</strong></p>}
        </div>
        {templates.length
          ? <TemplateTabs templates={templates} />
          : <div className="empty-state"><h2>Материал готовится</h2><p>Шаблон для этого задания появится после проверки.</p><a className="text-link" href="/">Вернуться к каталогу</a></div>}
      </article>
      <footer className="site-footer"><p>Нашёл ошибку? Напиши автору.</p><nav><a href="https://github.com/procosttt/egeinf" target="_blank" rel="noreferrer">Made by procost ↗</a></nav></footer>
    </main>
  );
}
