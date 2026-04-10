import { requireRole } from "@/lib/auth";
import { getUsers } from "@/lib/api";
import Link from "next/link";
import { Plus, UserCog } from "lucide-react";
import type { User } from "@/lib/types";
import DeleteUserButton from "./DeleteUserButton";

const ROLE_COLORS: Record<string, string> = {
  Owner:      "var(--accent)",
  Production: "#a855f7",
  Editor:     "#60a5fa",
  Designer:   "#f472b6",
  Client:     "var(--warning)",
  Admin:      "var(--success)",
  SuperAdmin: "var(--danger)",
};

export default async function UsersPage() {
  await requireRole(["Owner"]);

  let users: User[] = [];
  let fetchError = "";

  try {
    const res = await getUsers();
    users = res.data;
  } catch (e: unknown) {
    fetchError = e instanceof Error ? e.message : "Failed to load users";
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Users</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            {users.length} user{users.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/dashboard/users/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          style={{ background: "var(--accent)", color: "var(--accent-text)" }}
        >
          <Plus size={15} />
          New User
        </Link>
      </div>

      {/* Error */}
      {fetchError && (
        <div
          className="rounded-lg px-4 py-3 text-sm mb-6"
          style={{ background: "var(--danger-bg)", border: "1px solid var(--danger-border)", color: "var(--danger)" }}
        >
          {fetchError}
        </div>
      )}

      {/* Empty */}
      {!fetchError && users.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-24 rounded-2xl"
          style={{ border: "1px dashed var(--border-hover)" }}
        >
          <UserCog size={38} style={{ color: "var(--text-muted)", opacity: 0.4 }} className="mb-3" />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>No users found</p>
        </div>
      )}

      {/* Table */}
      {users.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                {["User", "Email", "Role", "Status", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3.5 text-xs font-medium uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const roleName = u.role?.name ?? "—";
                const roleColor = ROLE_COLORS[roleName] ?? "var(--text-muted)";

                return (
                  <tr
                    key={u._id}
                    className="tr-hover"
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0"
                          style={{ background: roleColor + "1a", color: roleColor }}
                        >
                          {u.username[0].toUpperCase()}
                        </div>
                        <span className="font-medium" style={{ color: "var(--text)" }}>
                          {u.username}
                        </span>
                        {u.isSuperAdmin && (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded"
                            style={{ background: "var(--danger-bg)", color: "var(--danger)" }}
                          >
                            Super
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5" style={{ color: "var(--text-muted)" }}>
                      {u.email}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: roleColor + "1a", color: roleColor }}
                      >
                        {roleName}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={
                          u.isActive
                            ? { background: "var(--success-bg)", color: "var(--success)" }
                            : { background: "var(--danger-bg)", color: "var(--danger)" }
                        }
                      >
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/users/${u._id}/edit`}
                          className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                          style={{ background: "var(--surface-2)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
                        >
                          Edit
                        </Link>
                        {!u.isSuperAdmin && (
                          <DeleteUserButton userId={u._id} username={u.username} />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
