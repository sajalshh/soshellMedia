"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FolderKanban, Users, LogOut, LayoutDashboard } from "lucide-react";
import type { SessionUser } from "@/lib/types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
}

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={17} /> },
  { label: "Projects", href: "/dashboard/projects", icon: <FolderKanban size={17} /> },
  { label: "Users", href: "/dashboard/users", icon: <Users size={17} />, roles: ["Owner"] },
];

export default function Sidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const effectiveRole = user.isSuperAdmin ? "Owner" : user.roleName;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const visibleNav = NAV.filter(
    (item) => !item.roles || item.roles.includes(effectiveRole)
  );

  return (
    <aside
      className="flex flex-col w-56 shrink-0 h-screen sticky top-0"
      style={{
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* Brand */}
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
          style={{
            background: "var(--accent-muted)",
            border: "1px solid rgba(0,255,204,0.15)",
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="var(--accent)" />
            <path
              d="M2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="var(--accent)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight" style={{ color: "var(--text)" }}>
            Soshell Media
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Admin
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-3 py-4 flex-1">
        {visibleNav.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: active ? "var(--accent-muted)" : "transparent",
                color: active ? "var(--accent)" : "var(--text-muted)",
                borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent",
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4" style={{ borderTop: "1px solid var(--border)" }}>
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-2"
          style={{ background: "var(--surface-2)" }}
        >
          <div
            className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0"
            style={{
              background: "var(--accent-muted)",
              color: "var(--accent)",
              border: "1px solid rgba(0,255,204,0.2)",
            }}
          >
            {user.username[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>
              {user.username}
            </p>
            <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
              {effectiveRole}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "var(--danger)";
            (e.currentTarget as HTMLElement).style.background = "var(--danger-bg)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
            (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
