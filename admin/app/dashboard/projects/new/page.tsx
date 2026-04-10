import { requireRole } from "@/lib/auth";
import { getUsersByRole } from "@/lib/api";
import NewProjectForm from "./NewProjectForm";

export default async function NewProjectPage() {
  await requireRole(["Owner", "Production"]);

  let usersByRole: Record<string, { _id: string; username: string; email: string }[]> = {};
  try {
    const res = await getUsersByRole();
    usersByRole = res.data;
  } catch {
    // Non-fatal — form still works, dropdowns will be empty
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
          New Project
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Fill in the project details and assign team members.
        </p>
      </div>
      <NewProjectForm usersByRole={usersByRole} />
    </div>
  );
}
