import { requireAuth } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import SessionGuard from "@/components/SessionGuard";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg)" }}>
      <SessionGuard />
      <Sidebar user={user} />
      <main className="flex-1 min-w-0 overflow-auto">{children}</main>
    </div>
  );
}
