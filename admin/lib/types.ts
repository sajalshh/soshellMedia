export type RoleName = "Owner" | "Production" | "Editor" | "Designer" | "Client" | "Admin" | "SuperAdmin";

export interface User {
  _id: string;
  username: string;
  email: string;
  isSuperAdmin: boolean;
  isActive: boolean;
  role: {
    _id: string;
    name: RoleName;
    permissions: { feature: string; actions: string[] }[];
  };
}

export interface SessionUser {
  _id: string;
  username: string;
  email: string;
  isSuperAdmin: boolean;
  roleName: RoleName;
}

export interface Feedback {
  _id: string;
  message: string;
  round: number;
  submittedBy?: { _id: string; username: string };
  createdAt: string;
}

export interface AssignedUser {
  _id: string;
  username: string;
  email: string;
}

export interface MediaProject {
  _id: string;
  title: string;
  description: string;
  clientId: AssignedUser | null;
  assignedProduction: AssignedUser | null;
  assignedEditor: AssignedUser | null;
  assignedDesigner: AssignedUser | null;
  rawFileLink: string;
  scriptLink: string;
  editedFileLink: string;
  finalLink: string;
  editorStatus: "in_progress" | "completed";
  clientApproval: "pending" | "approved" | "not_approved";
  feedback: Feedback[];
  currentRound: number;
  status: "active" | "completed" | "archived";
  createdBy: { _id: string; username: string };
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
