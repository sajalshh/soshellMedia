import { requireRole } from "@/lib/auth";
import { getUsers, getRoles } from "@/lib/api";
import { notFound } from "next/navigation";
import UserForm from "../../UserForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: Props) {
  const { id } = await params;
  await requireRole(["Owner"]);

  let user;
  let roles: { _id: string; name: string; description: string }[] = [];

  try {
    const [usersRes, rolesRes] = await Promise.all([getUsers(), getRoles()]);
    user = usersRes.data.find((u) => u._id === id);
    roles = rolesRes.data;
  } catch {
    notFound();
  }

  if (!user) notFound();

  return (
    <div className="p-8 max-w-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
          Edit User
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Update account details for <span style={{ color: "var(--accent)" }}>{user.username}</span>.
        </p>
      </div>
      <UserForm roles={roles} mode="edit" user={user} />
    </div>
  );
}
