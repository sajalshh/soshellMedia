"use server";

import { redirect } from "next/navigation";
import { loginAction } from "@/lib/auth";

export async function login(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const identifier = String(formData.get("identifier") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!identifier || !password) {
    return { error: "Username and password are required." };
  }

  const result = await loginAction(identifier, password);

  if (!result.success) {
    return { error: result.message || "Invalid credentials." };
  }

  redirect("/dashboard");
}
