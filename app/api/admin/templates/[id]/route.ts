import { env } from "cloudflare:workers";
import { deleteTemplate, updateTemplate } from "@/lib/templates";
import { requireAdmin } from "@/lib/session.mjs";
import { validateTemplateInput } from "@/lib/template-rules.mjs";

type Context = { params: Promise<{ id: string }> };

async function authorized(request: Request) {
  const denied = await requireAdmin(request, env);
  if (denied) return denied;
  const origin = request.headers.get("origin");
  return origin && origin !== new URL(request.url).origin
    ? Response.json({ error: "Запрос отклонён" }, { status: 403 })
    : null;
}

export async function PUT(request: Request, context: Context) {
  const denied = await authorized(request);
  if (denied) return denied;
  try {
    const id = Number((await context.params).id);
    const input = validateTemplateInput(await request.json());
    const template = Number.isInteger(id) ? await updateTemplate(id, input) : null;
    return template
      ? Response.json({ template })
      : Response.json({ error: "Шаблон не найден" }, { status: 404 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Неверные данные" }, { status: 400 });
  }
}

export async function DELETE(request: Request, context: Context) {
  const denied = await authorized(request);
  if (denied) return denied;
  const id = Number((await context.params).id);
  if (!Number.isInteger(id)) return Response.json({ error: "Шаблон не найден" }, { status: 404 });
  await deleteTemplate(id);
  return new Response(null, { status: 204 });
}
