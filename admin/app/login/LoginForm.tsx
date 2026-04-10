"use client";

import { useActionState } from "react";
import { login } from "./actions";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";

const initialState = null;

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState);
  const [showPass, setShowPass] = useState(false);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {/* Error */}
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

      {/* Username */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="identifier"
          className="text-sm font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          Username or Email
        </label>
        <input
          id="identifier"
          name="identifier"
          type="text"
          autoComplete="username"
          required
          placeholder="jatin"
          className="w-full rounded-lg px-3.5 py-2.5 text-sm transition-colors"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            color: "var(--text)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="text-sm font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPass ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="w-full rounded-lg px-3.5 py-2.5 text-sm pr-10 transition-colors"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
          <button
            type="button"
            onClick={() => setShowPass((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-muted)" }}
          >
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 mt-1"
        style={{ background: isPending ? "var(--accent-hover)" : "var(--accent)", color: "var(--accent-text)" }}
      >
        {isPending && <Loader2 size={16} className="animate-spin" />}
        {isPending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
