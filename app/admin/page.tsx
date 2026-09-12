import { AdminEditor } from "@/components/admin-editor";

export default function AdminPage() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="/">
          <span className="brand-mark">27</span>
          <span>Шаблоны ЕГЭ</span>
        </a>
        <a className="text-link" href="/">К заданиям</a>
      </header>
      <AdminEditor />
    </main>
  );
}
