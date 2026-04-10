import { getAccessToken, refreshAccessToken } from "./auth";

const BACKEND = process.env.BACKEND_URL || "http://localhost:3001";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  let token = await getAccessToken();

  const res = await fetch(`${BACKEND}/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  // Attempt one token refresh on 401
  if (res.status === 401 && retry) {
    token = await refreshAccessToken();
    if (token) return apiFetch<T>(path, options, false);

    // Refresh failed — session is truly expired.
    // Fire a custom event so client components can redirect to /login.
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("session-expired"));
    }
    throw new ApiError(401, "SESSION_EXPIRED");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message || `API error ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ---- Media Projects ----

export const getProjects = () =>
  apiFetch<{ success: boolean; data: import("./types").MediaProject[] }>(
    "/media-projects",
  );

export const getProject = (id: string) =>
  apiFetch<{ success: boolean; data: import("./types").MediaProject }>(
    `/media-projects/${id}`,
  );

export const createProject = (body: Record<string, unknown>) =>
  apiFetch<{ success: boolean; data: import("./types").MediaProject }>(
    "/media-projects",
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  );

export const updateProject = (id: string, body: Record<string, unknown>) =>
  apiFetch<{ success: boolean; data: import("./types").MediaProject }>(
    `/media-projects/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(body),
    },
  );

export const deleteProject = (id: string) =>
  apiFetch<{ success: boolean; message: string }>(`/media-projects/${id}`, {
    method: "DELETE",
  });

export const submitFeedback = (id: string, message: string) =>
  apiFetch<{ success: boolean; data: import("./types").MediaProject }>(
    `/media-projects/${id}/feedback`,
    {
      method: "POST",
      body: JSON.stringify({ message }),
    },
  );

export const getUsersByRole = () =>
  apiFetch<{
    success: boolean;
    data: Record<string, { _id: string; username: string; email: string }[]>;
  }>("/media-projects/users/by-role");

// ---- Users (admin) ----

export const getUsers = () =>
  apiFetch<{ success: boolean; data: import("./types").User[] }>(
    "/admin/users",
  );

export const createUser = (body: Record<string, unknown>) =>
  apiFetch<{ success: boolean; data: import("./types").User }>("/admin/users", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const updateUser = (id: string, body: Record<string, unknown>) =>
  apiFetch<{ success: boolean; data: import("./types").User }>(
    `/admin/users/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(body),
    },
  );

export const deleteUser = (id: string) =>
  apiFetch<{ success: boolean; message: string }>(`/admin/users/${id}`, {
    method: "DELETE",
  });

export const getRoles = () =>
  apiFetch<{
    success: boolean;
    data: { _id: string; name: string; description: string }[];
  }>("/admin/roles");
