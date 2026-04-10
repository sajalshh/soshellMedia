import { requireRole } from "@/lib/auth";
import { getRoles } from "@/lib/api";
import UserForm from "../UserForm";

export default async function NewUserPage() {
  await requireRole(["Owner"]);

  let roles: { _id: string; name: string; description: string }[] = [];
  try {
    const res = await getRoles();
    roles = res.data;
  } catch {
    // Non-fatal
  }

  return (
    <div className="p-8 max-w-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
          New User
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Create a new account and assign a role.
        </p>
      </div>
      <UserForm roles={roles} mode="create" />
    </div>
  );
}
