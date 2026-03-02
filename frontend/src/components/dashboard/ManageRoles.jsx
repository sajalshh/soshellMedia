import React, { useState, useEffect, useCallback } from "react";
import useAxiosPrivate from "../../hooks/usePrivateApi";
import { useAuth } from "../../context/AuthContext";
import { Plus, Pencil, Trash2 } from "lucide-react";

const FEATURE_LABELS = {
  hero: "Hero Section",
  showcase: "Showcase Videos",
  aboutTabs: "We Understand Tabs",
  workProcess: "Work Process",
  serviceCards: "Service Cards",
  projects: "Projects",
  pricing: "Pricing",
  servicesPage: "Services Page",
  aboutPage: "About Page",
  team: "Team Members",
  blog: "Blog Posts",
  caseStudies: "Case Studies",
  portfolio: "Portfolio",
  seo: "Page SEO",
  aiCalls: "AI Call Logs",
  users: "User Management",
  roles: "Role Management",
};

const ManageRoles = () => {
  const privateApi = useAxiosPrivate();
  const { user: currentUser } = useAuth();
  const [roles, setRoles] = useState([]);
  const [features, setFeatures] = useState([]);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: {},
  });
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [rolesRes, featuresRes] = await Promise.all([
        privateApi.get("/admin/roles"),
        privateApi.get("/admin/roles/features"),
      ]);
      setRoles(rolesRes.data.data);
      setFeatures(featuresRes.data.data.features);
      setActions(featuresRes.data.data.actions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [privateApi]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const permissionsToMap = (permArray) => {
    const map = {};
    (permArray || []).forEach((p) => {
      map[p.feature] = {};
      (p.actions || []).forEach((a) => {
        map[p.feature][a] = true;
      });
    });
    return map;
  };

  const mapToPermissions = (map) => {
    return Object.entries(map)
      .filter(([, actions]) => Object.values(actions).some(Boolean))
      .map(([feature, actions]) => ({
        feature,
        actions: Object.entries(actions)
          .filter(([, checked]) => checked)
          .map(([action]) => action),
      }));
  };

  const openCreateModal = () => {
    setEditingRole(null);
    const emptyPerms = {};
    features.forEach((f) => {
      emptyPerms[f] = {};
      actions.forEach((a) => {
        emptyPerms[f][a] = false;
      });
    });
    setFormData({ name: "", description: "", permissions: emptyPerms });
    setError("");
    setShowModal(true);
  };

  const openEditModal = (role) => {
    setEditingRole(role);
    const permMap = {};
    features.forEach((f) => {
      permMap[f] = {};
      actions.forEach((a) => {
        permMap[f][a] = false;
      });
    });
    const existing = permissionsToMap(role.permissions);
    Object.keys(existing).forEach((f) => {
      if (permMap[f]) {
        Object.keys(existing[f]).forEach((a) => {
          if (permMap[f] !== undefined) permMap[f][a] = true;
        });
      }
    });
    setFormData({
      name: role.name,
      description: role.description || "",
      permissions: permMap,
    });
    setError("");
    setShowModal(true);
  };

  const togglePermission = (feature, action) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [feature]: {
          ...prev.permissions[feature],
          [action]: !prev.permissions[feature]?.[action],
        },
      },
    }));
  };

  const toggleAllForFeature = (feature) => {
    const allChecked = actions.every((a) => formData.permissions[feature]?.[a]);
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [feature]: actions.reduce(
          (acc, a) => ({ ...acc, [a]: !allChecked }),
          {},
        ),
      },
    }));
  };

  const toggleAllForAction = (action) => {
    const allChecked = features.every(
      (f) => formData.permissions[f]?.[action],
    );
    setFormData((prev) => {
      const newPerms = { ...prev.permissions };
      features.forEach((f) => {
        newPerms[f] = { ...newPerms[f], [action]: !allChecked };
      });
      return { ...prev, permissions: newPerms };
    });
  };

  const selectAll = () => {
    const newPerms = {};
    features.forEach((f) => {
      newPerms[f] = {};
      actions.forEach((a) => {
        newPerms[f][a] = true;
      });
    });
    setFormData((prev) => ({ ...prev, permissions: newPerms }));
  };

  const clearAll = () => {
    const newPerms = {};
    features.forEach((f) => {
      newPerms[f] = {};
      actions.forEach((a) => {
        newPerms[f][a] = false;
      });
    });
    setFormData((prev) => ({ ...prev, permissions: newPerms }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        permissions: mapToPermissions(formData.permissions),
      };

      if (editingRole) {
        await privateApi.put(`/admin/roles/${editingRole._id}`, payload);
      } else {
        await privateApi.post("/admin/roles", payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  const handleDelete = async (roleId) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;
    try {
      await privateApi.delete(`/admin/roles/${roleId}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete role");
    }
  };

  const countPermissions = (role) => {
    return (role.permissions || []).reduce(
      (sum, p) => sum + (p.actions?.length || 0),
      0,
    );
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
          {roles.length} role{roles.length !== 1 ? "s" : ""} defined
        </p>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={16} style={{ marginRight: 6 }} />
          Create Role
        </button>
      </div>

      <div className="dashboard-card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>Role Name</th>
              <th>Description</th>
              <th>Permissions</th>
              <th>Type</th>
              <th style={{ width: 120 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role._id}>
                <td style={{ fontWeight: 500 }}>{role.name}</td>
                <td style={{ color: "#888" }}>
                  {role.description || "—"}
                </td>
                <td>
                  <span style={{ color: "#00ffcc", fontWeight: 600 }}>
                    {countPermissions(role)}
                  </span>
                  <span style={{ color: "#666" }}> permissions</span>
                </td>
                <td>
                  {role.isSystem ? (
                    <span className="system-badge">System</span>
                  ) : (
                    <span style={{ color: "#888", fontSize: 12 }}>Custom</span>
                  )}
                </td>
                <td>
                  <div className="d-flex gap-2">
                    {(role.name !== "SuperAdmin" ||
                      currentUser?.isSuperAdmin) && (
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => openEditModal(role)}
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                    )}
                    {!role.isSystem && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(role._id)}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Role Modal */}
      {showModal && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            style={{ maxWidth: 800 }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" style={{ color: "#e0e0e0" }}>
                  {editingRole ? `Edit Role: ${editingRole.name}` : "Create Role"}
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

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Role Name</label>
                      <input
                        className="form-control"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        disabled={editingRole?.isSystem}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Description</label>
                      <input
                        className="form-control"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 style={{ color: "#e0e0e0", margin: 0 }}>
                      Permissions
                    </h6>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={selectAll}
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={clearAll}
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          color: "#a0a0a0",
                          fontSize: 13,
                        }}
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      maxHeight: 400,
                      overflowY: "auto",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 8,
                    }}
                  >
                    <table className="permission-matrix">
                      <thead>
                        <tr>
                          <th style={{ position: "sticky", top: 0, background: "#1a1a1d", zIndex: 1 }}>
                            Feature
                          </th>
                          {actions.map((action) => (
                            <th
                              key={action}
                              style={{
                                position: "sticky",
                                top: 0,
                                background: "#1a1a1d",
                                zIndex: 1,
                                cursor: "pointer",
                              }}
                              onClick={() => toggleAllForAction(action)}
                            >
                              {action}
                            </th>
                          ))}
                          <th
                            style={{
                              position: "sticky",
                              top: 0,
                              background: "#1a1a1d",
                              zIndex: 1,
                              cursor: "pointer",
                              fontSize: 11,
                            }}
                          >
                            All
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {features.map((feature) => (
                          <tr key={feature}>
                            <td style={{ fontWeight: 500 }}>
                              {FEATURE_LABELS[feature] || feature}
                            </td>
                            {actions.map((action) => (
                              <td key={action}>
                                <input
                                  type="checkbox"
                                  checked={
                                    formData.permissions[feature]?.[action] ||
                                    false
                                  }
                                  onChange={() =>
                                    togglePermission(feature, action)
                                  }
                                />
                              </td>
                            ))}
                            <td>
                              <input
                                type="checkbox"
                                checked={actions.every(
                                  (a) =>
                                    formData.permissions[feature]?.[a] || false,
                                )}
                                onChange={() => toggleAllForFeature(feature)}
                                style={{ accentColor: "#60a5fa" }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                    {editingRole ? "Update Role" : "Create Role"}
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

export default ManageRoles;
