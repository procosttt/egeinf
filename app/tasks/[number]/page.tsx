import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { isTaskNumber, TASK_NUMBERS, TASK_TOPICS } from "@/lib/catalog.mjs";
import { listPublishedTemplates } from "@/lib/templates";

export function generateStaticParams() {
  return TASK_NUMBERS.map((number) => ({ number: String(number) }));
}

export const dynamicParams = false;

export default async function TaskPage({ params }: { params: Promise<{ number: string }> }) {
  const number = Number((await params).number);
  if (!isTaskNumber(number)) notFound();
  const templates = await listPublishedTemplates(number);
  const topic = TASK_TOPICS[number as keyof typeof TASK_TOPICS];

  if (templates.length) redirect(`/tasks/${number}/${templates[0].slug}`);

  return (
    <main>
      <header className="site-header">
        <Link className="brand" href="/"><span className="brand-mark">27</span><span>Шаблоны ЕГЭ</span></Link>
        <Link className="text-link" href="/">Все задания</Link>
      </header>
      <article className="task-page">
        <div className="task-intro">
          <div><p className="eyebrow">Задание {number}</p><h1>{topic ?? `Задание ${number}`}</h1></div>
        </div>
        <div className="empty-state"><h2>Материал готовится</h2><p>Шаблон для этого задания появится после проверки.</p><Link className="text-link" href="/">Вернуться к каталогу</Link></div>
      </article>
      <footer className="site-footer"><p>Нашёл ошибку? Напиши автору.</p><nav><a href="https://github.com/procosttt/egeinf" target="_blank" rel="noreferrer">Made by procost ↗</a></nav></footer>
    </main>
  );
}
