import { requireAuth } from "@/lib/auth";
import { getProjects } from "@/lib/api";
import Link from "next/link";
import { Plus, FolderKanban } from "lucide-react";
import type { MediaProject, SessionUser } from "@/lib/types";

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  active:    { bg: "var(--success-bg)",                   color: "var(--success)", label: "Active" },
  completed: { bg: "var(--accent-muted)",                 color: "var(--accent)",  label: "Completed" },
  archived:  { bg: "rgba(160,160,160,0.1)",               color: "var(--text-muted)", label: "Archived" },
};

const APPROVAL_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  pending:      { bg: "var(--warning-bg)",  color: "var(--warning)", label: "Pending" },
  approved:     { bg: "var(--success-bg)",  color: "var(--success)", label: "Approved" },
  not_approved: { bg: "var(--danger-bg)",   color: "var(--danger)",  label: "Not Approved" },
};

function Badge({ style }: { style: { bg: string; color: string; label: string } }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ background: style.bg, color: style.color }}
    >
      {style.label}
    </span>
  );
}

function canCreate(user: SessionUser) {
  const role = user.isSuperAdmin ? "Owner" : user.roleName;
  return ["Owner", "Production"].includes(role);
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await requireAuth();
  const { error } = await searchParams;

  let projects: MediaProject[] = [];
  let fetchError = "";

  try {
    const res = await getProjects();
    projects = res.data;
  } catch (e: unknown) {
    fetchError = e instanceof Error ? e.message : "Failed to load projects";
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
            Projects
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        {canCreate(user) && (
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            style={{ background: "var(--accent)", color: "var(--accent-text)" }}
          >
            <Plus size={15} />
            New Project
          </Link>
        )}
      </div>

      {/* Access denied banner */}
      {error === "access_denied" && (
        <div
          className="rounded-lg px-4 py-3 text-sm mb-6"
          style={{
            background: "var(--warning-bg)",
            border: "1px solid rgba(255,193,7,0.3)",
            color: "var(--warning)",
          }}
        >
          You don't have access to that project.
        </div>
      )}

      {/* Error */}
      {fetchError && (
        <div
          className="rounded-lg px-4 py-3 text-sm mb-6"
          style={{
            background: "var(--danger-bg)",
            border: "1px solid var(--danger-border)",
            color: "var(--danger)",
          }}
        >
          {fetchError}
        </div>
      )}

      {/* Empty */}
      {!fetchError && projects.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-24 rounded-2xl"
          style={{ border: "1px dashed var(--border-hover)" }}
        >
          <FolderKanban size={38} style={{ color: "var(--text-muted)", opacity: 0.5 }} className="mb-3" />
          <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
            No projects yet
          </p>
          {canCreate(user) && (
            <Link
              href="/dashboard/projects/new"
              className="mt-4 text-sm font-semibold"
              style={{ color: "var(--accent)" }}
            >
              Create your first project →
            </Link>
          )}
        </div>
      )}

      {/* Project grid */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((p) => {
            const statusStyle = STATUS_STYLES[p.status] ?? STATUS_STYLES.active;
            const approvalStyle = APPROVAL_STYLES[p.clientApproval] ?? APPROVAL_STYLES.pending;

            return (
              <Link
                key={p._id}
                href={`/dashboard/projects/${p._id}`}
                className="card-hover group flex flex-col gap-4 p-5 rounded-xl transition-all"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                {/* Title row */}
                <div className="flex items-start justify-between gap-2">
                  <h2
                    className="text-sm font-semibold leading-snug"
                    style={{ color: "var(--text)" }}
                  >
                    {p.title}
                  </h2>
                  <Badge style={statusStyle} />
                </div>

                {/* Description */}
                {p.description && (
                  <p className="text-xs line-clamp-2" style={{ color: "var(--text-muted)" }}>
                    {p.description}
                  </p>
                )}

                {/* Meta */}
                <div className="flex flex-col gap-1.5 mt-auto pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                  {p.clientId && (
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: "var(--text-muted)" }}>Client</span>
                      <span style={{ color: "var(--text)" }}>{p.clientId.username}</span>
                    </div>
                  )}
                  {p.assignedEditor && (
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: "var(--text-muted)" }}>Editor</span>
                      <span style={{ color: "var(--text)" }}>{p.assignedEditor.username}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: "var(--text-muted)" }}>Approval</span>
                    <Badge style={approvalStyle} />
                  </div>
                  {p.feedback.length > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: "var(--text-muted)" }}>Feedback rounds</span>
                      <span style={{ color: "var(--accent)" }}>{p.feedback.length}</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
