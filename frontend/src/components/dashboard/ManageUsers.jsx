import React, { useState, useEffect, useCallback } from "react";
import useAxiosPrivate from "../../hooks/usePrivateApi";
import { useAuth } from "../../context/AuthContext";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const ManageUsers = () => {
  const privateApi = useAxiosPrivate();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    roleId: "",
    isActive: true,
  });
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [usersRes, rolesRes] = await Promise.all([
        privateApi.get("/admin/users"),
        privateApi.get("/admin/roles"),
      ]);
      setUsers(usersRes.data.data);
      setRoles(rolesRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [privateApi]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      username: "",
      email: "",
      password: "",
      roleId: roles.length > 0 ? roles[0]._id : "",
      isActive: true,
    });
    setError("");
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      roleId: user.role?._id || "",
      isActive: user.isActive,
    });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingUser) {
        const updatePayload = { ...formData };
        if (!updatePayload.password) delete updatePayload.password;
        await privateApi.put(`/admin/users/${editingUser._id}`, updatePayload);
      } else {
        if (!formData.password) {
          setError("Password is required for new users");
          return;
        }
        await privateApi.post("/admin/users", formData);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await privateApi.delete(`/admin/users/${userId}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const canModifyUser = (targetUser) => {
    if (targetUser.isSuperAdmin && !currentUser?.isSuperAdmin) return false;
    return true;
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-light" role="status" />
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <p style={{ color: "#888", margin: 0 }}>
          {users.length} user{users.length !== 1 ? "s" : ""} total
        </p>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={16} style={{ marginRight: 6 }} />
          Create User
        </button>
      </div>

      <div className="dashboard-card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th style={{ width: 120 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>
                  <span style={{ fontWeight: 500 }}>{u.username}</span>
                  {u.isSuperAdmin && (
                    <span
                      className="role-badge superadmin"
                      style={{ marginLeft: 8 }}
                    >
                      SA
                    </span>
                  )}
                </td>
                <td style={{ color: "#888" }}>{u.email}</td>
                <td>
                  <span
                    className={`role-badge ${u.isSuperAdmin ? "superadmin" : u.role?.name === "Admin" ? "admin" : "custom"}`}
                  >
                    {u.isSuperAdmin ? "SuperAdmin" : u.role?.name || "—"}
                  </span>
                </td>
                <td>
                  <span
                    className={u.isActive ? "status-active" : "status-inactive"}
                  >
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  {canModifyUser(u) && (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => openEditModal(u)}
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      {!u.isSuperAdmin &&
                        u._id !== currentUser?._id && (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(u._id)}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{ color: "#e0e0e0" }}>
                  {editingUser ? "Edit User" : "Create User"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {error && (
                    <div
                      style={{
                        background: "rgba(255, 59, 48, 0.1)",
                        border: "1px solid rgba(255, 59, 48, 0.3)",
                        borderRadius: 8,
                        padding: "10px 14px",
                        marginBottom: 16,
                        color: "#ff6b6b",
                        fontSize: 13,
                      }}
                    >
                      {error}
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                      className="form-control"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      required
                      minLength={3}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Password{" "}
                      {editingUser && (
                        <span style={{ color: "#666", fontSize: 12 }}>
                          (leave blank to keep current)
                        </span>
                      )}
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      {...(!editingUser && { required: true, minLength: 6 })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select
                      className="form-select"
                      value={formData.roleId}
                      onChange={(e) =>
                        setFormData({ ...formData, roleId: e.target.value })
                      }
                      required
                    >
                      <option value="">Select a role</option>
                      {roles
                        .filter(
                          (r) =>
                            r.name !== "SuperAdmin" ||
                            currentUser?.isSuperAdmin,
                        )
                        .map((r) => (
                          <option key={r._id} value={r._id}>
                            {r.name}
                            {r.isSystem ? " (System)" : ""}
                          </option>
                        ))}
                    </select>
                  </div>
                  {editingUser && (
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isActive: e.target.checked,
                          })
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor="isActive"
                        style={{ color: "#a0a0a0" }}
                      >
                        Account Active
                      </label>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#a0a0a0",
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingUser ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
