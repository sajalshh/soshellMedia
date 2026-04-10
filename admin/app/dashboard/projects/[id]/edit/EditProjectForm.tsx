"use client";

import { useActionState } from "react";
import { editProjectAction } from "./actions";
import { Loader2 } from "lucide-react";
import type { MediaProject } from "@/lib/types";

interface UserOption {
  _id: string;
  username: string;
  email: string;
}

interface Props {
  project: MediaProject;
  usersByRole: Record<string, UserOption[]>;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-xs font-medium uppercase tracking-wide"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function UserSelect({
  name,
  users,
  defaultValue,
  placeholder,
}: {
  name: string;
  users: UserOption[];
  defaultValue: string;
  placeholder: string;
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      className="w-full rounded-lg px-3.5 py-2.5 text-sm"
    >
      <option value="">{placeholder}</option>
      {users.map((u) => (
        <option key={u._id} value={u._id}>
          {u.username} ({u.email})
        </option>
      ))}
    </select>
  );
}

export default function EditProjectForm({ project, usersByRole }: Props) {
  const boundAction = editProjectAction.bind(null, project._id);
  const [state, formAction, isPending] = useActionState<
    { error: string } | null,
    FormData
  >(boundAction, null);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5 rounded-2xl p-7"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      {state?.error && (
        <div
          className="rounded-lg px-4 py-3 text-sm"
          style={{
            background: "var(--danger-bg)",
            border: "1px solid var(--danger-border)",
            color: "var(--danger)",
          }}
        >
          {state.error}
        </div>
      )}

      {/* Core info */}
      <Field label="Project Title *">
        <input
          name="title"
          type="text"
          required
          defaultValue={project.title}
          placeholder="e.g. Brand Video Q3"
          className="w-full rounded-lg px-3.5 py-2.5 text-sm"
        />
      </Field>

      <Field label="Description">
        <textarea
          name="description"
          rows={3}
          defaultValue={project.description}
          placeholder="Brief description of the project…"
          className="w-full rounded-lg px-3.5 py-2.5 text-sm resize-none"
        />
      </Field>

      {/* Team reassignment */}
      <div
        className="rounded-xl p-5 flex flex-col gap-4"
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--accent)", opacity: 0.7 }}
        >
          Reassign Team
        </p>

        <Field label="Client">
          <UserSelect
            name="clientId"
            users={usersByRole["Client"] ?? []}
            defaultValue={project.clientId?._id ?? ""}
            placeholder="— No client —"
          />
        </Field>

        <Field label="Production">
          <UserSelect
            name="assignedProduction"
            users={usersByRole["Production"] ?? []}
            defaultValue={project.assignedProduction?._id ?? ""}
            placeholder="— No production —"
          />
        </Field>

        <Field label="Editor">
          <UserSelect
            name="assignedEditor"
            users={usersByRole["Editor"] ?? []}
            defaultValue={project.assignedEditor?._id ?? ""}
            placeholder="— No editor —"
          />
        </Field>

        <Field label="Designer">
          <UserSelect
            name="assignedDesigner"
            users={usersByRole["Designer"] ?? []}
            defaultValue={project.assignedDesigner?._id ?? ""}
            placeholder="— No designer —"
          />
        </Field>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors"
          style={{ background: "var(--accent)", color: "var(--accent-text)" }}
        >
          {isPending && <Loader2 size={14} className="animate-spin" />}
          {isPending ? "Saving…" : "Save Changes"}
        </button>
        <a
          href={`/dashboard/projects/${project._id}`}
          className="px-6 py-2.5 rounded-lg text-sm font-medium"
          style={{
            background: "var(--surface-2)",
            color: "var(--text-muted)",
            border: "1px solid var(--border)",
          }}
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
