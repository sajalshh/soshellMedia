import { requireAuth } from "@/lib/auth";
import { getProject, getUsersByRole, ApiError } from "@/lib/api";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProjectDetailClient from "./ProjectDetailClient";

type UsersByRole = Record<string, { _id: string; username: string; email: string }[]>;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await requireAuth();

  const canManageTeam = user.isSuperAdmin || user.roleName === "Production";

  let project;
  let usersByRole: UsersByRole = {};

  try {
    const [projectRes, usersRes] = await Promise.all([
      getProject(id),
      canManageTeam
        ? getUsersByRole().catch(() => ({ success: true, data: {} as UsersByRole }))
        : Promise.resolve({ success: true, data: {} as UsersByRole }),
    ]);
    project = projectRes.data;
    usersByRole = usersRes.data;
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 403)
        redirect("/dashboard/projects?error=access_denied");
      if (err.status === 404) notFound();
    }
    notFound();
  }

  return (
    <div className="p-8">
      <Link
        href="/dashboard/projects"
        className="link-hover inline-flex items-center gap-2 text-sm mb-6 transition-colors"
        style={{ color: "var(--text-muted)" }}
      >
        <ArrowLeft size={14} />
        Back to Projects
      </Link>
      <ProjectDetailClient project={project} user={user} usersByRole={usersByRole} />
    </div>
  );
}
