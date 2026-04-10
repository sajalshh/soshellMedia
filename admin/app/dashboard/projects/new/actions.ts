"use server";

import { redirect } from "next/navigation";
import { createProject } from "@/lib/api";

export async function createProjectAction(
  _prev: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const clientId = String(formData.get("clientId") ?? "").trim() || undefined;
  const assignedProduction = String(formData.get("assignedProduction") ?? "").trim() || undefined;
  const assignedEditor = String(formData.get("assignedEditor") ?? "").trim() || undefined;
  const assignedDesigner = String(formData.get("assignedDesigner") ?? "").trim() || undefined;

  if (!title) return { error: "Project title is required." };

  try {
    const res = await createProject({
      title,
      description,
      clientId,
      assignedProduction,
      assignedEditor,
      assignedDesigner,
    });
    redirect(`/dashboard/projects/${res.data._id}`);
  } catch (e: unknown) {
    if (e instanceof Error && e.message.includes("NEXT_REDIRECT")) throw e;
    return { error: e instanceof Error ? e.message : "Failed to create project." };
  }
}
