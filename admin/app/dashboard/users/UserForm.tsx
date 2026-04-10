"use client";

import { useActionState } from "react";
import { createUserAction, updateUserAction } from "./actions";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { User } from "@/lib/types";

interface Props {
  roles: { _id: string; name: string; description: string }[];
  mode: "create" | "edit";
  user?: User;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

export default function UserForm({ roles, mode, user }: Props) {
  const boundAction =
    mode === "edit" && user
      ? updateUserAction.bind(null, user._id)
      : createUserAction;

  const [state, formAction, isPending] = useActionState(boundAction, null);
  const [showPass, setShowPass] = useState(false);

  const assignableRoles = roles.filter((r) => r.name !== "SuperAdmin");

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5 rounded-2xl p-7"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      {state?.error && (
        <div
          className="rounded-lg px-4 py-3 text-sm"
          style={{ background: "var(--danger-bg)", border: "1px solid var(--danger-border)", color: "var(--danger)" }}
        >
          {state.error}
        </div>
      )}

      <Field label={mode === "edit" ? "Username" : "Username *"}>
        <input
          name="username"
          type="text"
          defaultValue={user?.username ?? ""}
          required={mode === "create"}
          placeholder="username"
          className="w-full rounded-lg px-3.5 py-2.5 text-sm"
        />
      </Field>

      <Field label={mode === "edit" ? "Email" : "Email *"}>
        <input
          name="email"
          type="email"
          defaultValue={user?.email ?? ""}
          required={mode === "create"}
          placeholder="user@example.com"
          className="w-full rounded-lg px-3.5 py-2.5 text-sm"
        />
      </Field>

      <Field label={mode === "edit" ? "New Password (leave blank to keep)" : "Password *"}>
        <div className="relative">
          <input
            name="password"
            type={showPass ? "text" : "password"}
            required={mode === "create"}
            placeholder="••••••••"
            className="w-full rounded-lg px-3.5 py-2.5 text-sm pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPass((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-muted)" }}
          >
            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </Field>

      <Field label="Role *">
        <select
          name="roleId"
          required
          defaultValue={user?.role?._id ?? ""}
          className="w-full rounded-lg px-3.5 py-2.5 text-sm"
        >
          <option value="">— Select role —</option>
          {assignableRoles.map((r) => (
            <option key={r._id} value={r._id}>
              {r.name}
            </option>
          ))}
        </select>
      </Field>

      {mode === "edit" && (
        <Field label="Status">
          <select
            name="isActive"
            defaultValue={user?.isActive ? "true" : "false"}
            className="w-full rounded-lg px-3.5 py-2.5 text-sm"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </Field>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors"
          style={{ background: "var(--accent)", color: "var(--accent-text)" }}
        >
          {isPending && <Loader2 size={14} className="animate-spin" />}
          {isPending
            ? mode === "create" ? "Creating…" : "Saving…"
            : mode === "create" ? "Create User" : "Save Changes"}
        </button>
        <a
          href="/dashboard/users"
          className="px-6 py-2.5 rounded-lg text-sm font-medium"
          style={{ background: "var(--surface-2)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
