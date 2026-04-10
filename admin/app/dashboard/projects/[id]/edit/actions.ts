"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { updateProject } from "@/lib/api";

export async function editProjectAction(
  id: string,
  _prev: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const clientId = String(formData.get("clientId") ?? "").trim() || null;
  const assignedProduction =
    String(formData.get("assignedProduction") ?? "").trim() || null;
  const assignedEditor =
    String(formData.get("assignedEditor") ?? "").trim() || null;
  const assignedDesigner =
    String(formData.get("assignedDesigner") ?? "").trim() || null;

  if (!title) return { error: "Project title is required." };

  try {
    await updateProject(id, {
      title,
      description,
      clientId,
      assignedProduction,
      assignedEditor,
      assignedDesigner,
    });
    revalidatePath(`/dashboard/projects/${id}`);
    revalidatePath("/dashboard/projects");
    redirect(`/dashboard/projects/${id}`);
  } catch (e: unknown) {
    if (isRedirectError(e)) throw e;
    return {
      error: e instanceof Error ? e.message : "Failed to update project.",
    };
  }
}
