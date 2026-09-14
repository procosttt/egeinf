import Link from "next/link";
import { summarizeCatalog, TASK_NUMBERS, TASK_TOPICS } from "@/lib/catalog.mjs";
import { listPublishedSummaries } from "@/lib/templates";

function typeLabel(count: number) {
  if (count % 10 === 1 && count % 100 !== 11) return `${count} тип`;
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return `${count} типа`;
  return `${count} типов`;
}

export default async function Home() {
  const summaries = await listPublishedSummaries();
  const counts = new Map(summaries.map((item) => [item.taskNumber, item.count]));
  const stats = summarizeCatalog(summaries);
  return (
    <main>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Шаблоны ЕГЭ, главная">
          <span className="brand-mark">27</span>
          <span>Шаблоны ЕГЭ</span>
        </Link>
      </header>

      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">ЕГЭ · Информатика · 2026</p>
          <h1>Нужный шаблон.<br />Без поисков по тетради.</h1>
          <p className="hero-copy">
            Выбери номер задания, узнай тип и скопируй код. Коротко, понятно и без лишней теории.
          </p>
          <div className="hero-actions">
            <a className="primary-link" href="#catalog-title">Выбрать задание <span aria-hidden="true">↓</span></a>
            <a className="creator-link" href="https://github.com/procosttt/egeinf" target="_blank" rel="noreferrer">Made by procost <span aria-hidden="true">↗</span></a>
          </div>
          <div className="hero-stats" aria-label="Статистика библиотеки">
            <p><strong>{stats.readyTasks}</strong><span>заданий разобрано</span></p>
            <p><strong>{stats.templates}</strong><span>готовых шаблонов</span></p>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-card">
            <span className="hero-card-label">ЕГЭ / ИНФ</span>
            <strong>27</strong>
            <span className="hero-card-code">print(answer)</span>
          </div>
          <span className="float-pill float-pill-python">Python</span>
          <span className="float-pill float-pill-copy">⌘ C · готово</span>
        </div>
      </section>

      <section className="catalog" aria-labelledby="catalog-title">
        <div className="section-heading">
          <div><p className="eyebrow">Библиотека</p><h2 id="catalog-title">Все 27 заданий</h2></div>
          <p aria-label={`${stats.readyTasks} заданий уже готовы`}><strong>{stats.readyTasks}</strong> / 27</p>
        </div>
        <div className="task-grid">
          {TASK_NUMBERS.map((number, index) => {
            const count = counts.get(number) ?? 0;
            return (
            <a
              className={`task-card ${count ? "is-ready" : "is-soon"}`}
              href={`/tasks/${number}`}
              key={number}
              style={{ animationDelay: `${Math.min(index * 28, 420)}ms` }}
            >
              <span className="task-card-top"><span className="task-number">{number}</span><span className="task-status">{count ? "Готово" : "Скоро"}</span></span>
              <span className="task-card-main">
                <span className="task-topic">{TASK_TOPICS[number as keyof typeof TASK_TOPICS] ?? "Материал готовится"}</span>
                <span className="task-action">{count ? typeLabel(count) : "Добавим после проверки"}</span>
              </span>
              <span className="task-arrow" aria-hidden="true">↗</span>
            </a>
          )})}
        </div>
      </section>

      <footer className="site-footer">
        <p>Шаблоны для подготовки к ЕГЭ по информатике.</p>
        <nav aria-label="Ссылки в подвале"><a href="https://github.com/procosttt/egeinf" target="_blank" rel="noreferrer">Made by procost ↗</a></nav>
      </footer>
    </main>
  );
}
