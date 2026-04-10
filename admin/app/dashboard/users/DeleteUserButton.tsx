"use client";

import { useTransition } from "react";
import { deleteUserAction } from "./actions";
import { Trash2, Loader2 } from "lucide-react";

export default function DeleteUserButton({ userId, username }: { userId: string; username: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Delete user "${username}"? This cannot be undone.`)) return;
    startTransition(() => deleteUserAction(userId));
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 disabled:opacity-50 transition-colors"
      style={{ background: "var(--danger-bg)", color: "var(--danger)", border: "1px solid var(--danger-border)" }}
    >
      {isPending ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
      Delete
    </button>
  );
}
