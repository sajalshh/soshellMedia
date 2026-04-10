import { requireRole } from "@/lib/auth";
import { getProject, getUsersByRole, ApiError } from "@/lib/api";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EditProjectForm from "./EditProjectForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  await requireRole(["Owner"]);

  let project;
  let usersByRole: Record<
    string,
    { _id: string; username: string; email: string }[]
  > = {};

  try {
    const [projectRes, usersRes] = await Promise.all([
      getProject(id),
      getUsersByRole(),
    ]);
    project = projectRes.data;
    usersByRole = usersRes.data;
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 404) notFound();
      if (err.status === 403) redirect("/dashboard/projects");
    }
    notFound();
  }

  return (
    <div className="p-8 max-w-2xl">
      {/* Back link */}
      <Link
        href={`/dashboard/projects/${id}`}
        className="link-hover inline-flex items-center gap-2 text-sm mb-6 transition-colors"
        style={{ color: "var(--text-muted)" }}
      >
        <ArrowLeft size={14} />
        Back to Project
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
          Edit Project
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Update <span style={{ color: "var(--accent)" }}>{project.title}</span>
          's details and team assignments.
        </p>
      </div>

      <EditProjectForm project={project} usersByRole={usersByRole} />
    </div>
  );
}
