"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createUser, updateUser, deleteUser } from "@/lib/api";

export async function createUserAction(
  _prev: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const username = String(formData.get("username") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const roleId = String(formData.get("roleId") ?? "").trim();

  if (!username || !email || !password || !roleId) {
    return { error: "All fields are required." };
  }

  try {
    await createUser({ username, email, password, roleId });
    revalidatePath("/dashboard/users");
    redirect("/dashboard/users");
  } catch (e: unknown) {
    if (e instanceof Error && e.message.includes("NEXT_REDIRECT")) throw e;
    return { error: e instanceof Error ? e.message : "Failed to create user." };
  }
}

export async function updateUserAction(
  id: string,
  _prev: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const body: Record<string, unknown> = {};
  const username = String(formData.get("username") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const roleId = String(formData.get("roleId") ?? "").trim();
  const isActive = formData.get("isActive") === "true";

  if (username) body.username = username;
  if (email) body.email = email;
  if (password) body.password = password;
  if (roleId) body.roleId = roleId;
  body.isActive = isActive;

  try {
    await updateUser(id, body);
    revalidatePath("/dashboard/users");
    redirect("/dashboard/users");
  } catch (e: unknown) {
    if (e instanceof Error && e.message.includes("NEXT_REDIRECT")) throw e;
    return { error: e instanceof Error ? e.message : "Failed to update user." };
  }
}

export async function deleteUserAction(id: string): Promise<void> {
  await deleteUser(id);
  revalidatePath("/dashboard/users");
}
