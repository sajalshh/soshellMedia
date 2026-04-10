"use server";

import { revalidatePath } from "next/cache";
import { updateProject, submitFeedback, deleteProject } from "@/lib/api";
import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

// Generic field update (role filtering happens in backend)
export async function updateProjectAction(
  id: string,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const body: Record<string, unknown> = {};

  for (const [key, value] of formData.entries()) {
    body[key] = String(value).trim();
  }

  try {
    await updateProject(id, body);
    revalidatePath(`/dashboard/projects/${id}`);
    revalidatePath("/dashboard/projects");
    return { success: true };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Update failed." };
  }
}

// Feedback submission (Client only)
export async function submitFeedbackAction(
  id: string,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const message = String(formData.get("message") ?? "").trim();
  if (!message) return { error: "Feedback message cannot be empty." };

  try {
    await submitFeedback(id, message);
    revalidatePath(`/dashboard/projects/${id}`);
    return { success: true };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : "Failed to submit feedback." };
  }
}

// Delete project (Owner only)
export async function deleteProjectAction(id: string): Promise<void> {
  const user = await requireAuth();
  const role = user.isSuperAdmin ? "Owner" : user.roleName;
  if (role !== "Owner") throw new Error("Not authorized");

  await deleteProject(id);
  revalidatePath("/dashboard/projects");
  redirect("/dashboard/projects");
}
