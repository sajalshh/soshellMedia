import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { SessionUser, RoleName } from "./types";

const BACKEND = process.env.BACKEND_URL || "http://localhost:3001";
const ACCESS_COOKIE = "admin_access_token";
const REFRESH_COOKIE = "admin_refresh_token";
const USER_COOKIE = "admin_user";

// ---------- Token helpers ----------

export async function getAccessToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(ACCESS_COOKIE)?.value ?? null;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const raw = store.get(USER_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

// ---------- Auth guard ----------

export async function requireAuth(): Promise<SessionUser> {
  const token = await getAccessToken();
  if (!token) redirect("/login");

  const user = await getSessionUser();
  if (!user) redirect("/login");

  return user;
}

export async function requireRole(allowed: RoleName[]): Promise<SessionUser> {
  const user = await requireAuth();
  const effective = user.isSuperAdmin ? "Owner" : user.roleName;
  if (!allowed.includes(effective as RoleName)) {
    redirect("/dashboard");
  }
  return user;
}

// ---------- Login / Logout ----------

export interface LoginResult {
  success: boolean;
  message?: string;
}

export async function loginAction(identifier: string, password: string): Promise<LoginResult> {
  const res = await fetch(`${BACKEND}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    return { success: false, message: body.message || "Invalid credentials" };
  }

  const body = await res.json();
  const accessToken: string = body.accessToken;

  // Extract refresh token from Set-Cookie header
  const setCookie = res.headers.get("set-cookie") || "";
  const refreshMatch = setCookie.match(/refreshToken=([^;]+)/);
  const refreshToken = refreshMatch ? refreshMatch[1] : null;

  // Fetch user profile using access token
  const meRes = await fetch(`${BACKEND}/api/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!meRes.ok) {
    return { success: false, message: "Failed to load user profile" };
  }

  const meBody = await meRes.json();
  const user = meBody.data;
  const sessionUser: SessionUser = {
    _id: user._id,
    username: user.username,
    email: user.email,
    isSuperAdmin: user.isSuperAdmin,
    roleName: user.role?.name,
  };

  const store = await cookies();

  // Access token — 45 min
  store.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 45 * 60,
  });

  // Refresh token — 7 days
  if (refreshToken) {
    store.set(REFRESH_COOKIE, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
  }

  // Session user (readable for UI, non-sensitive)
  store.set(USER_COOKIE, JSON.stringify(sessionUser), {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 45 * 60,
  });

  return { success: true };
}

export async function logoutAction(): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
  store.delete(USER_COOKIE);
}

// ---------- Token refresh ----------

export async function refreshAccessToken(): Promise<string | null> {
  const store = await cookies();
  const refreshToken = store.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) return null;

  const res = await fetch(`${BACKEND}/api/auth/refresh`, {
    headers: { Cookie: `refreshToken=${refreshToken}` },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const body = await res.json();
  const newToken: string = body.accessToken;

  store.set(ACCESS_COOKIE, newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 45 * 60,
  });

  // Also extend user cookie
  const user = await getSessionUser();
  if (user) {
    store.set(USER_COOKIE, JSON.stringify(user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 45 * 60,
    });
  }

  return newToken;
}
