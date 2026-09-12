import { env } from "cloudflare:workers";
import { createTemplate, listAllTemplates } from "@/lib/templates";
import { requireAdmin } from "@/lib/session.mjs";
import { validateTemplateInput } from "@/lib/template-rules.mjs";

export async function GET(request: Request) {
  const denied = await requireAdmin(request, env);
  if (denied) return denied;
  try {
    return Response.json({ templates: await listAllTemplates() });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Не удалось загрузить" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin(request, env);
  if (denied) return denied;
  if (request.headers.get("origin") && request.headers.get("origin") !== new URL(request.url).origin) {
    return Response.json({ error: "Запрос отклонён" }, { status: 403 });
  }
  try {
    const input = validateTemplateInput(await request.json());
    return Response.json({ template: await createTemplate(input) }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Неверные данные" }, { status: 400 });
  }
}
