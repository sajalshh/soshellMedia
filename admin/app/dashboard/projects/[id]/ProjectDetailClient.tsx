"use client";

import { useState, useTransition, useCallback } from "react";
import {
  ExternalLink,
  Save,
  Loader2,
  Trash2,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import {
  updateProjectAction,
  submitFeedbackAction,
  deleteProjectAction,
} from "./actions";
import type { MediaProject, SessionUser } from "@/lib/types";

type UsersByRole = Record<string, { _id: string; username: string; email: string }[]>;

// ── Reusable field components ──────────────────────────────────────────────────

function LinkField({
  label,
  value,
  name,
  readOnly = false,
}: {
  label: string;
  value: string;
  name: string;
  readOnly?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-xs font-medium uppercase tracking-wide"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </label>
      <div className="flex gap-2">
        <input
          name={name}
          defaultValue={value}
          key={value}
          readOnly={readOnly}
          placeholder={readOnly ? "—" : "Paste link here…"}
          className="flex-1 rounded-lg px-3.5 py-2.5 text-sm"
          style={{ cursor: readOnly ? "default" : undefined }}
        />
        {value && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-10 rounded-lg shrink-0 transition-colors"
            style={{
              background: "var(--accent-muted)",
              border: "1px solid rgba(0,255,204,0.15)",
              color: "var(--accent)",
            }}
          >
            <ExternalLink size={13} />
          </a>
        )}
      </div>
    </div>
  );
}

function UserSelect({
  label,
  name,
  value,
  options,
}: {
  label: string;
  name: string;
  value: string;
  options: { _id: string; username: string }[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-xs font-medium uppercase tracking-wide"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </label>
      <select
        name={name}
        defaultValue={value}
        key={value}
        className="w-full rounded-lg px-3.5 py-2.5 text-sm"
      >
        <option value="">— Unassigned —</option>
        {options.map((u) => (
          <option key={u._id} value={u._id}>
            {u.username}
          </option>
        ))}
      </select>
    </div>
  );
}

function Section({
  title,
  accentColor,
  children,
}: {
  title: string;
  accentColor?: string;
  children: React.ReactNode;
}) {
  const color = accentColor ?? "var(--text-muted)";
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-4"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderLeft: `2px solid ${color}`,
      }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-wider"
        style={{ color }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

function SaveButton({ isPending }: { isPending: boolean }) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors"
      style={{ background: "var(--accent)", color: "var(--accent-text)" }}
    >
      {isPending ? (
        <Loader2 size={13} className="animate-spin" />
      ) : (
        <Save size={13} />
      )}
      {isPending ? "Saving…" : "Save"}
    </button>
  );
}

// ── Approval config ────────────────────────────────────────────────────────────

const APPROVAL_CONFIG = {
  pending: { label: "Pending Review", icon: Clock, color: "var(--warning)" },
  approved: { label: "Approved", icon: CheckCircle2, color: "var(--success)" },
  not_approved: {
    label: "Not Approved",
    icon: XCircle,
    color: "var(--danger)",
  },
};

// ── Main ───────────────────────────────────────────────────────────────────────

export default function ProjectDetailClient({
  project: initial,
  user,
  usersByRole = {},
}: {
  project: MediaProject;
  user: SessionUser;
  usersByRole?: UsersByRole;
}) {
  const [project, setProject] = useState<MediaProject>(initial);
  const [isPending, startTransition] = useTransition();
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [sectionMsg, setSectionMsg] = useState<Record<string, string>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const effectiveRole = user.isSuperAdmin ? "Owner" : user.roleName;
  const isOwner = effectiveRole === "Owner";
  const isProduction = effectiveRole === "Production";
  const isEditorOrDesigner =
    effectiveRole === "Editor" || effectiveRole === "Designer";
  const isClient = effectiveRole === "Client";

  // Re-fetch latest project data from the server and sync local state
  const refreshProject = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/projects/${project._id}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data);
      }
    } catch {
      // Silently fail — stale data is still shown
    } finally {
      setIsRefreshing(false);
    }
  }, [project._id]);

  function handleSectionSubmit(key: string) {
    return async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      startTransition(async () => {
        const r = await updateProjectAction(project._id, fd);
        if (r.error) {
          setSectionMsg((p) => ({ ...p, [key]: r.error! }));
          setTimeout(() => setSectionMsg((p) => ({ ...p, [key]: "" })), 3000);
        } else {
          await refreshProject();
          setSectionMsg((p) => ({ ...p, [key]: "Saved!" }));
          setTimeout(() => setSectionMsg((p) => ({ ...p, [key]: "" })), 2500);
        }
      });
    };
  }

  function SectionNote({ k }: { k: string }) {
    const msg = sectionMsg[k];
    if (!msg) return null;
    return (
      <span
        className="text-xs"
        style={{ color: msg === "Saved!" ? "var(--success)" : "var(--danger)" }}
      >
        {msg}
      </span>
    );
  }

  async function handleFeedbackSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!feedbackMsg.trim()) return;
    const fd = new FormData();
    fd.set("message", feedbackMsg);
    startTransition(async () => {
      const r = await submitFeedbackAction(project._id, fd);
      if (r.success) {
        setFeedbackMsg("");
        await refreshProject();
        setSectionMsg((p) => ({ ...p, feedback: "Feedback submitted!" }));
      } else {
        setSectionMsg((p) => ({ ...p, feedback: r.error ?? "Failed." }));
      }
      setTimeout(() => setSectionMsg((p) => ({ ...p, feedback: "" })), 3000);
    });
  }

  async function handleDelete() {
    if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
    startTransition(() => deleteProjectAction(project._id));
  }

  const approvalCfg =
    APPROVAL_CONFIG[project.clientApproval] ?? APPROVAL_CONFIG.pending;
  const ApprovalIcon = approvalCfg.icon;

  // Show feedback-received alert to editor/designer
  const hasPendingFeedback =
    isEditorOrDesigner &&
    project.clientApproval === "not_approved" &&
    project.feedback.length > 0;

  // User option lists from usersByRole
  const clientOptions = usersByRole["Client"] ?? [];
  const editorOptions = usersByRole["Editor"] ?? [];
  const designerOptions = usersByRole["Designer"] ?? [];

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
              {project.title}
            </h1>
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
              style={{
                background:
                  project.status === "active"
                    ? "var(--success-bg)"
                    : project.status === "completed"
                      ? "var(--accent-muted)"
                      : "rgba(160,160,160,0.1)",
                color:
                  project.status === "active"
                    ? "var(--success)"
                    : project.status === "completed"
                      ? "var(--accent)"
                      : "var(--text-muted)",
              }}
            >
              {project.status}
            </span>
            {isRefreshing && (
              <RefreshCw
                size={13}
                className="animate-spin"
                style={{ color: "var(--text-muted)" }}
              />
            )}
          </div>
          {project.description && (
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {project.description}
            </p>
          )}
        </div>

        {isOwner && (
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`/dashboard/projects/${project._id}/edit`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm"
              style={{
                background: "var(--surface-2)",
                color: "var(--text-muted)",
                border: "1px solid var(--border)",
              }}
            >
              Edit
            </a>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm disabled:opacity-50"
              style={{
                background: "var(--danger-bg)",
                color: "var(--danger)",
                border: "1px solid var(--danger-border)",
              }}
            >
              <Trash2 size={13} />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Approval status bar */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <ApprovalIcon size={15} style={{ color: approvalCfg.color }} />
        <span className="font-medium" style={{ color: approvalCfg.color }}>
          {approvalCfg.label}
        </span>
        {project.feedback.length > 0 && (
          <span
            className="ml-auto flex items-center gap-1.5 text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            <MessageSquare size={12} />
            {project.feedback.length} feedback · Round {project.currentRound}
          </span>
        )}
      </div>

      {/* ── Feedback received alert for Editor/Designer ── */}
      {hasPendingFeedback && (
        <div
          className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm"
          style={{
            background: "var(--warning-bg)",
            border: "1px solid rgba(255,193,7,0.3)",
          }}
        >
          <MessageSquare
            size={15}
            className="shrink-0"
            style={{ color: "var(--warning)", marginTop: 1 }}
          />
          <div>
            <p className="font-semibold" style={{ color: "var(--warning)" }}>
              Client requested changes
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--text-muted)" }}
            >
              Review the feedback below and upload a new final link when ready.
            </p>
          </div>
        </div>
      )}

      {/* ── Production Section ── */}
      {/* Owner + Production: editable. Editor/Designer: read-only view of raw files. */}
      {(isOwner || isProduction || isEditorOrDesigner) && (
        <Section title="Production Data" accentColor="var(--accent)">
          {isEditorOrDesigner ? (
            // Read-only for Editor/Designer
            <div className="flex flex-col gap-4">
              <LinkField
                label="Raw File Link"
                name="rawFileLink"
                value={project.rawFileLink}
                readOnly
              />
              <LinkField
                label="Script Link"
                name="scriptLink"
                value={project.scriptLink}
                readOnly
              />
            </div>
          ) : (
            // Editable for Owner + Production
            <form
              onSubmit={handleSectionSubmit("production")}
              className="flex flex-col gap-4"
            >
              <LinkField
                label="Raw File Link"
                name="rawFileLink"
                value={project.rawFileLink}
              />
              <LinkField
                label="Script Link"
                name="scriptLink"
                value={project.scriptLink}
              />

              {/* Production: team assignment dropdowns */}
              {isProduction && (
                <>
                  <UserSelect
                    label="Client"
                    name="clientId"
                    value={project.clientId?._id ?? ""}
                    options={clientOptions}
                  />
                  <UserSelect
                    label="Editor"
                    name="assignedEditor"
                    value={project.assignedEditor?._id ?? ""}
                    options={editorOptions}
                  />
                  <UserSelect
                    label="Designer"
                    name="assignedDesigner"
                    value={project.assignedDesigner?._id ?? ""}
                    options={designerOptions}
                  />
                </>
              )}

              {/* Owner: project status */}
              {isOwner && (
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-xs font-medium uppercase tracking-wide"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Project Status
                  </label>
                  <select
                    name="status"
                    defaultValue={project.status}
                    key={project.status}
                    className="w-full rounded-lg px-3.5 py-2.5 text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              )}

              <div className="flex items-center gap-3">
                <SaveButton isPending={isPending} />
                <SectionNote k="production" />
              </div>
            </form>
          )}
        </Section>
      )}

      {/* ── Delivery Section ── */}
      {/* Owner/Editor/Designer: editable. Production: read-only. */}
      {(isOwner || isProduction || isEditorOrDesigner) && (
        <Section title="Delivery" accentColor="#a855f7">
          {isEditorOrDesigner || isOwner ? (
            <form
              onSubmit={handleSectionSubmit("editor")}
              className="flex flex-col gap-4"
            >
              <LinkField
                label="Edited File Link"
                name="editedFileLink"
                value={project.editedFileLink}
              />
              <LinkField
                label="Final Link"
                name="finalLink"
                value={project.finalLink}
              />
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-medium uppercase tracking-wide"
                  style={{ color: "var(--text-muted)" }}
                >
                  Editor Status
                </label>
                <select
                  name="editorStatus"
                  defaultValue={project.editorStatus}
                  key={project.editorStatus}
                  className="w-full rounded-lg px-3.5 py-2.5 text-sm"
                >
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <SaveButton isPending={isPending} />
                <SectionNote k="editor" />
              </div>
            </form>
          ) : (
            // Production: read-only view of delivery
            <div className="flex flex-col gap-4">
              <LinkField
                label="Edited File Link"
                name="editedFileLink"
                value={project.editedFileLink}
                readOnly
              />
              <LinkField
                label="Final Link"
                name="finalLink"
                value={project.finalLink}
                readOnly
              />
              <div className="flex items-center gap-2 text-sm">
                <span style={{ color: "var(--text-muted)" }}>Status:</span>
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    background:
                      project.editorStatus === "completed"
                        ? "var(--success-bg)"
                        : "var(--warning-bg)",
                    color:
                      project.editorStatus === "completed"
                        ? "var(--success)"
                        : "var(--warning)",
                  }}
                >
                  {project.editorStatus === "completed"
                    ? "Completed"
                    : "In Progress"}
                </span>
              </div>
            </div>
          )}
        </Section>
      )}

      {/* ── Client Review Section ── */}
      {(isOwner || isEditorOrDesigner || isClient || isProduction) && (
        <Section title="Client Review" accentColor="var(--warning)">
          {/* Client sees links + approval dropdown + feedback form */}
          {isClient && (
            <div className="flex flex-col gap-4">
              {project.editedFileLink && (
                <LinkField
                  label="Edited File"
                  name="editedFileLink"
                  value={project.editedFileLink}
                  readOnly
                />
              )}
              {project.finalLink && (
                <LinkField
                  label="Final Delivery"
                  name="finalLink"
                  value={project.finalLink}
                  readOnly
                />
              )}
              {!project.editedFileLink && !project.finalLink && (
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  No files uploaded yet. Check back soon.
                </p>
              )}

              {/* Client approval — only Approved / Not Approved (no Pending) */}
              <form
                onSubmit={handleSectionSubmit("approval")}
                className="flex flex-col gap-3"
              >
                <div className="flex flex-col gap-1.5">
                  <label
                    className="text-xs font-medium uppercase tracking-wide"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Your Decision
                  </label>
                  <select
                    name="clientApproval"
                    defaultValue={
                      project.clientApproval === "pending"
                        ? "approved"
                        : project.clientApproval
                    }
                    key={project.clientApproval}
                    className="w-full rounded-lg px-3.5 py-2.5 text-sm"
                  >
                    <option value="approved">Approved</option>
                    <option value="not_approved">Not Approved</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <SaveButton isPending={isPending} />
                  <SectionNote k="approval" />
                </div>
              </form>
            </div>
          )}

          {/* Owner approval — all three options */}
          {isOwner && (
            <form
              onSubmit={handleSectionSubmit("approval")}
              className="flex flex-col gap-3"
            >
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-medium uppercase tracking-wide"
                  style={{ color: "var(--text-muted)" }}
                >
                  Approval
                </label>
                <select
                  name="clientApproval"
                  defaultValue={project.clientApproval}
                  key={project.clientApproval}
                  className="w-full rounded-lg px-3.5 py-2.5 text-sm"
                >
                  <option value="pending">Pending Review</option>
                  <option value="approved">Approved</option>
                  <option value="not_approved">Not Approved</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <SaveButton isPending={isPending} />
                <SectionNote k="approval" />
              </div>
            </form>
          )}

          {/* Feedback history — visible to all roles in this section */}
          {project.feedback.length > 0 && (
            <div className="flex flex-col gap-2">
              <p
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: "var(--text-muted)" }}
              >
                Feedback History
              </p>
              <div className="flex flex-col gap-2">
                {project.feedback.map((fb) => (
                  <div
                    key={fb._id}
                    className="rounded-lg px-4 py-3 text-sm"
                    style={{
                      background: "var(--surface-2)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div
                      className="flex items-center gap-2 mb-1.5 text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <span
                        className="px-2 py-0.5 rounded text-xs"
                        style={{
                          background: "var(--accent-muted)",
                          color: "var(--accent)",
                        }}
                      >
                        Round {fb.round}
                      </span>
                      <span>{fb.submittedBy?.username ?? "Client"}</span>
                      <span>·</span>
                      <span>{new Date(fb.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p style={{ color: "var(--text)" }}>{fb.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit feedback — Client only */}
          {isClient && (
            <form
              onSubmit={handleFeedbackSubmit}
              className="flex flex-col gap-3"
            >
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-xs font-medium uppercase tracking-wide"
                  style={{ color: "var(--text-muted)" }}
                >
                  Leave Feedback
                </label>
                <textarea
                  value={feedbackMsg}
                  onChange={(e) => setFeedbackMsg(e.target.value)}
                  rows={3}
                  placeholder="Describe what changes you'd like…"
                  className="w-full rounded-lg px-3.5 py-2.5 text-sm resize-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isPending || !feedbackMsg.trim()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors"
                  style={{
                    background: "var(--accent)",
                    color: "var(--accent-text)",
                  }}
                >
                  {isPending && <Loader2 size={13} className="animate-spin" />}
                  Submit Feedback
                </button>
                <SectionNote k="feedback" />
              </div>
            </form>
          )}

          {/* Non-client non-owner: show approval status read-only */}
          {!isClient && !isOwner && (
            <div className="flex items-center gap-2 text-sm">
              <span style={{ color: "var(--text-muted)" }}>
                Client decision:
              </span>
              <ApprovalIcon size={13} style={{ color: approvalCfg.color }} />
              <span style={{ color: approvalCfg.color }}>
                {approvalCfg.label}
              </span>
            </div>
          )}
        </Section>
      )}

      {/* ── Team ── */}
      <Section title="Team">
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            { label: "Client", user: project.clientId },
            { label: "Production", user: project.assignedProduction },
            { label: "Editor", user: project.assignedEditor },
            { label: "Designer", user: project.assignedDesigner },
          ].map(({ label, user: u }) => (
            <div key={label}>
              <p
                className="text-xs mb-0.5"
                style={{ color: "var(--text-muted)" }}
              >
                {label}
              </p>
              <p
                style={{
                  color: u ? "var(--text)" : "var(--text-muted)",
                  opacity: u ? 1 : 0.4,
                }}
              >
                {u ? u.username : "—"}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
