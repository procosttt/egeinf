"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type TemplateInput = {
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
type TemplateRecord = TemplateInput & { id: number; slug: string };

declare global {
  interface Document {
    modelContext?: {
      registerTool: (tool: Record<string, unknown>, options?: { signal?: AbortSignal }) => void | Promise<void>;
    };
  }
}

const blank: TemplateInput = {
  taskNumber: 1,
  title: "",
  recognition: "",
  problem: "",
  explanation: "",
  code: "",
  note: "",
  status: "draft",
  sortOrder: 0,
};

export function AdminEditor() {
  const [items, setItems] = useState<TemplateRecord[]>([]);
  const [form, setForm] = useState<TemplateInput>(blank);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  const load = useCallback(async () => {
    const response = await fetch("/api/admin/templates", { cache: "no-store" });
    if (response.status === 401) {
      setAuthenticated(false);
      return;
    }
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Не удалось загрузить материалы");
    setItems(data.templates);
    setAuthenticated(true);
  }, []);

  useEffect(() => { void load().catch((error) => setMessage(error.message)); }, [load]);

  const persist = useCallback(async (input: TemplateInput, id?: number) => {
    const response = await fetch(id ? `/api/admin/templates/${id}` : "/api/admin/templates", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Не удалось сохранить");
    await load();
    return data.template as TemplateRecord;
  }, [load]);

  useEffect(() => {
    if (!authenticated || !document.modelContext?.registerTool) return;
    const lifecycle = new AbortController();
    const properties = {
      taskNumber: { type: "integer", minimum: 1, maximum: 27 },
      title: { type: "string" }, recognition: { type: "string" }, problem: { type: "string" },
      explanation: { type: "string" }, code: { type: "string" }, note: { type: "string" },
      status: { type: "string", enum: ["draft", "published"] }, sortOrder: { type: "integer" },
    };
    void Promise.resolve(document.modelContext.registerTool({
      name: "save_ege_template",
      title: "Сохранить шаблон ЕГЭ",
      description: "Создаёт новый шаблон задания ЕГЭ и обновляет видимый список администратора.",
      inputSchema: { type: "object", properties, required: Object.keys(properties), additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      async execute(input: unknown) {
        const saved = await persist(input as TemplateInput);
        return { id: saved.id, slug: saved.slug, status: saved.status };
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, [authenticated, persist]);

  async function login(event: FormEvent) {
    event.preventDefault();
    setPending(true); setMessage("");
    const response = await fetch("/api/admin/login", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      const data = await response.json(); setMessage(data.error || "Не удалось войти"); setPending(false); return;
    }
    setPassword(""); await load(); setPending(false);
  }

  async function save(event: FormEvent) {
    event.preventDefault(); setPending(true); setMessage("");
    try {
      await persist(form, editingId ?? undefined);
      setForm(blank); setEditingId(null); setMessage("Сохранено");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Не удалось сохранить"); }
    setPending(false);
  }

  async function remove(id: number) {
    if (!window.confirm("Удалить этот шаблон?")) return;
    const response = await fetch(`/api/admin/templates/${id}`, { method: "DELETE" });
    if (response.ok) await load();
    else setMessage("Не удалось удалить");
  }

  if (authenticated === null) return <p className="admin-loading">Загрузка...</p>;
  if (!authenticated) return (
    <section className="login-shell">
      <form className="login-card" onSubmit={login}>
        <p className="eyebrow">Только для владельца</p>
        <h1>Вход в редактор</h1>
        <label>Пароль<input autoFocus type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        {message && <p className="form-message" role="alert">{message}</p>}
        <button disabled={pending} type="submit">{pending ? "Проверяю..." : "Войти"}</button>
      </form>
    </section>
  );

  return (
    <section className="admin-shell">
      <div className="admin-title"><div><p className="eyebrow">Редактор</p><h1>Материалы</h1></div><button className="secondary-button" onClick={() => { setForm(blank); setEditingId(null); }}>Новый шаблон</button></div>
      <div className="admin-layout">
        <aside className="material-list" aria-label="Список шаблонов">
          {items.map((item) => <button key={item.id} onClick={() => { setEditingId(item.id); setForm(item); }}><strong>№ {item.taskNumber}. {item.title}</strong><span>{item.status === "published" ? "Опубликован" : "Черновик"}</span></button>)}
          {!items.length && <p>Пока нет шаблонов.</p>}
        </aside>
        <form className="editor-form" onSubmit={save}>
          <div className="field-row">
            <label>Задание<select value={form.taskNumber} onChange={(event) => setForm({ ...form, taskNumber: Number(event.target.value) })}>{Array.from({ length: 27 }, (_, index) => <option key={index + 1}>{index + 1}</option>)}</select></label>
            <label>Статус<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as TemplateInput["status"] })}><option value="draft">Черновик</option><option value="published">Опубликован</option></select></label>
          </div>
          <label>Название<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
          <label>Как распознать<textarea value={form.recognition} onChange={(event) => setForm({ ...form, recognition: event.target.value })} /></label>
          <label>Условие<textarea required value={form.problem} onChange={(event) => setForm({ ...form, problem: event.target.value })} /></label>
          <label>Разбор<textarea required value={form.explanation} onChange={(event) => setForm({ ...form, explanation: event.target.value })} /></label>
          <label>Код<textarea className="code-input" required spellCheck={false} value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} /></label>
          <label>Примечание<textarea value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} /></label>
          <label>Порядок<input type="number" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })} /></label>
          {message && <p className="form-message" role="status">{message}</p>}
          <div className="form-actions"><button disabled={pending} type="submit">{pending ? "Сохраняю..." : "Сохранить"}</button>{editingId && <button className="danger-button" type="button" onClick={() => void remove(editingId)}>Удалить</button>}</div>
        </form>
      </div>
    </section>
  );
}
