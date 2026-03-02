import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await login(identifier, password);
      setIdentifier("");
      setPassword("");
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setError("No Server Response");
      } else if (err.response?.status === 401) {
        setError("Invalid Credentials");
      } else if (err.response?.status === 403) {
        setError("Account is deactivated");
      } else {
        setError("Login Failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0d0d0f",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#151518",
          borderRadius: "16px",
          border: "1px solid rgba(255,255,255,0.06)",
          padding: "48px 36px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h2
            style={{
              color: "#fff",
              fontSize: "24px",
              fontWeight: 700,
              margin: 0,
            }}
          >
            Admin Dashboard
          </h2>
          <p
            style={{
              color: "#888",
              fontSize: "14px",
              marginTop: "8px",
            }}
          >
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                background: "rgba(255, 59, 48, 0.1)",
                border: "1px solid rgba(255, 59, 48, 0.3)",
                borderRadius: "8px",
                padding: "10px 14px",
                marginBottom: "20px",
                color: "#ff6b6b",
                fontSize: "13px",
              }}
            >
              {error}
            </div>
          )}

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="identifier"
              style={{
                display: "block",
                color: "#a0a0a0",
                fontSize: "13px",
                fontWeight: 500,
                marginBottom: "6px",
              }}
            >
              Username or Email
            </label>
            <input
              type="text"
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoComplete="username"
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "#0d0d0f",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#e0e0e0",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "#00ffcc")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.1)")
              }
            />
          </div>

          <div style={{ marginBottom: "28px" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                color: "#a0a0a0",
                fontSize: "13px",
                fontWeight: 500,
                marginBottom: "6px",
              }}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{
                width: "100%",
                padding: "10px 14px",
                background: "#0d0d0f",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "#e0e0e0",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.15s",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "#00ffcc")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.1)")
              }
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "12px",
              background: isLoading ? "#333" : "#00ffcc",
              color: "#000",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "background 0.15s",
            }}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
