import { TASK_NUMBERS, TASK_TOPICS } from "@/lib/catalog.mjs";
import { listPublishedSummaries } from "@/lib/templates";

export const dynamic = "force-dynamic";

function typeLabel(count: number) {
  if (count % 10 === 1 && count % 100 !== 11) return `${count} тип`;
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return `${count} типа`;
  return `${count} типов`;
}

export default async function Home() {
  const summaries = await listPublishedSummaries();
  const counts = new Map(summaries.map((item) => [item.taskNumber, item.count]));
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="/" aria-label="Шаблоны ЕГЭ, главная">
          <span className="brand-mark">27</span>
          <span>Шаблоны ЕГЭ</span>
        </a>
        <a className="admin-link" href="/admin">Добавить шаблон</a>
      </header>

      <section className="hero">
        <p className="eyebrow">Информатика</p>
        <h1>Нужный шаблон.<br />Без поисков по тетради.</h1>
        <p className="hero-copy">
          Выбери номер задания, узнай тип и скопируй код. Здесь собраны короткие
          рабочие решения для подготовки к ЕГЭ.
        </p>
      </section>

      <section className="catalog" aria-labelledby="catalog-title">
        <div className="section-heading">
          <h2 id="catalog-title">Все задания</h2>
          <p>1-27</p>
        </div>
        <div className="task-grid">
          {TASK_NUMBERS.map((number, index) => {
            const count = counts.get(number) ?? 0;
            return (
            <a
              className="task-card"
              href={`/tasks/${number}`}
              key={number}
              style={{ animationDelay: `${Math.min(index * 28, 420)}ms` }}
            >
              <span className="task-number">{number}</span>
              <span className="task-topic">
                {TASK_TOPICS[number as keyof typeof TASK_TOPICS] ?? "Материал готовится"}
              </span>
              <span className="task-action">{count ? typeLabel(count) : "Скоро"}</span>
            </a>
          )})}
        </div>
      </section>

      <footer>
        <p>Сделано для подготовки к ЕГЭ по информатике.</p>
      </footer>
    </main>
  );
}
