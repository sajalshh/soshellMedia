import { getAccessToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const token = await getAccessToken();
  if (token) redirect("/dashboard");

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-[120px] opacity-10 pointer-events-none"
        style={{ background: "var(--accent)" }}
      />

      <div className="relative w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4"
            style={{
              background: "var(--accent-muted)",
              border: "1px solid rgba(0,255,204,0.2)",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="var(--accent)" />
              <path
                d="M2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="var(--accent)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
            Soshell Media
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Production Admin Panel
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 shadow-2xl"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <h2 className="text-base font-semibold mb-6" style={{ color: "var(--text)" }}>
            Sign in to continue
          </h2>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
