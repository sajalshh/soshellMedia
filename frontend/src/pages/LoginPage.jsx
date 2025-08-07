// src/pages/LoginPage.jsx

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard"; // Where to redirect after login

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      setEmail("");
      setPassword("");
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setError("No Server Response");
      } else if (err.response?.status === 401) {
        setError("Invalid Credentials");
      } else {
        setError("Login Failed");
      }
    }
  };

  return (
    <div className="section-padding d-flex justify-content-center align-items-center">
      <div className="card p-5" style={{ minWidth: "400px" }}>
        <h2 className="text-center mb-4 login">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="alert alert-danger">{error}</p>}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
