import React, { useState, useEffect, useCallback } from "react";
import usePrivateApi from "../../hooks/usePrivateApi";
import { Plus, Pencil, Trash2 } from "lucide-react";

const PRIORITY_COLORS = {
  low: "#6c757d",
  medium: "#fd7e14",
  high: "#dc3545",
};

const STATUS_COLORS = {
  pending: { bg: "rgba(255,193,7,0.15)", color: "#ffc107" },
  "in-progress": { bg: "rgba(13,110,253,0.15)", color: "#4da3ff" },
  done: { bg: "rgba(0,255,204,0.1)", color: "#00ffcc" },
};

const emptyForm = {
  title: "",
  description: "",
  assignedTo: "",
  dueDate: "",
  dueTime: "",
  priority: "medium",
};

export default function ManageTasks() {
  const privateApi = usePrivateApi();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // ── Fetch all users for assign dropdown ──
  const fetchUsers = useCallback(async () => {
    try {
      const res = await privateApi.get("/admin/users");
      setUsers(res.data.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  }, [privateApi]);

  // ── Fetch tasks with optional filters ──
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterUser) params.append("userId", filterUser);
      if (filterStatus) params.append("status", filterStatus);

      const res = await privateApi.get(`/tasks/all?${params.toString()}`);
      setTasks(res.data.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    } finally {
      setLoading(false);
    }
  }, [privateApi, filterUser, filterStatus]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ── Open create modal ──
  const openCreate = () => {
    setEditingTask(null);
    setForm({
      ...emptyForm,
      assignedTo: users[0]?._id || "",
    });
    setError("");
    setShowModal(true);
  };

  // ── Open edit modal ──
  const openEdit = (task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description || "",
      assignedTo: task.assignedTo?._id || "",
      dueDate: task.dueDate,
      dueTime: task.dueTime,
      priority: task.priority,
    });
    setError("");
    setShowModal(true);
  };

  // ── Submit create or edit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingTask) {
        await privateApi.put(`/tasks/${editingTask._id}`, form);
      } else {
        await privateApi.post("/tasks", form);
      }
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Save failed.");
    }
  };

  // ── Delete task ──
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await privateApi.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      alert("Failed to delete task.");
    }
  };

  // ── Summary counts ──
  const totalTasks = tasks.length;
  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const inProgressCount = tasks.filter(
    (t) => t.status === "in-progress",
  ).length;
  const doneCount = tasks.filter((t) => t.status === "done").length;

  return (
    <>
      {/* ── Summary Cards ── */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        {[
          { label: "Total Tasks", value: totalTasks, color: "#00ffcc" },
          { label: "Pending", value: pendingCount, color: "#ffc107" },
          { label: "In Progress", value: inProgressCount, color: "#4da3ff" },
          { label: "Done", value: doneCount, color: "#28a745" },
        ].map((card) => (
          <div
            key={card.label}
            className="dashboard-card"
            style={{
              padding: "16px 24px",
              minWidth: 120,
              flex: 1,
            }}
          >
            <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
              {card.label}
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: card.color,
              }}
            >
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters + Add Button ── */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 16,
          flexWrap: "wrap",
          alignItems: "flex-end",
        }}
      >
        <div>
          <label
            style={{
              fontSize: 12,
              color: "#888",
              display: "block",
              marginBottom: 4,
            }}
          >
            Filter by Employee
          </label>
          <select
            className="form-select"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            style={{ maxWidth: 200 }}
          >
            <option value="">All Employees</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.username}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            style={{
              fontSize: 12,
              color: "#888",
              display: "block",
              marginBottom: 4,
            }}
          >
            Filter by Status
          </label>
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ maxWidth: 160 }}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => {
            setFilterUser("");
            setFilterStatus("");
          }}
        >
          Clear
        </button>

        <button
          className="btn btn-primary"
          style={{ marginLeft: "auto" }}
          onClick={openCreate}
        >
          <Plus size={15} style={{ marginRight: 6 }} />
          Assign Task
        </button>
      </div>

      {/* ── Task Cards ── */}
      {loading ? (
        <p style={{ color: "#888" }}>Loading...</p>
      ) : tasks.length === 0 ? (
        <div
          className="dashboard-card"
          style={{ padding: 32, textAlign: "center", color: "#888" }}
        >
          No tasks found.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {tasks.map((task) => (
            <div
              key={task._id}
              className="dashboard-card"
              style={{
                padding: 16,
                borderLeft: `4px solid ${PRIORITY_COLORS[task.priority]}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                <div>
                  <span style={{ fontWeight: 700 }}>{task.title}</span>
                  {task.description && (
                    <p
                      style={{
                        margin: "3px 0",
                        fontSize: 13,
                        color: "#aaa",
                      }}
                    >
                      {task.description}
                    </p>
                  )}
                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      fontSize: 12,
                      color: "#888",
                      flexWrap: "wrap",
                      marginTop: 4,
                    }}
                  >
                    <span>
                      👤 Assigned to:{" "}
                      <strong style={{ color: "#ccc" }}>
                        {task.assignedTo?.username}
                      </strong>
                    </span>
                    <span>
                      📅 Due: {task.dueDate} at {task.dueTime}
                    </span>
                    <span>
                      🏷 Priority:{" "}
                      <span
                        style={{
                          color: PRIORITY_COLORS[task.priority],
                          fontWeight: 600,
                        }}
                      >
                        {task.priority}
                      </span>
                    </span>
                    <span>👤 Assigned by: {task.assignedBy?.username}</span>
                    {task.completedAt && (
                      <span>
                        ✅ Completed:{" "}
                        {new Date(task.completedAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 600,
                      background: STATUS_COLORS[task.status]?.bg,
                      color: STATUS_COLORS[task.status]?.color,
                    }}
                  >
                    {task.status}
                  </span>
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => openEdit(task)}
                    title="Edit"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(task._id)}
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create / Edit Modal ── */}
      {showModal && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title" style={{ color: "#e0e0e0" }}>
                    {editingTask ? "Edit Task" : "Assign New Task"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  />
                </div>

                <div className="modal-body">
                  {error && (
                    <div
                      style={{
                        background: "rgba(220,53,69,0.1)",
                        border: "1px solid rgba(220,53,69,0.3)",
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
                    <label className="form-label">Task Title *</label>
                    <input
                      className="form-control"
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={form.description}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Assign To *</label>
                    <select
                      className="form-select"
                      value={form.assignedTo}
                      onChange={(e) =>
                        setForm({ ...form, assignedTo: e.target.value })
                      }
                      required
                    >
                      <option value="">Select employee</option>
                      {users.map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.username} ({u.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Due Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={form.dueDate}
                        onChange={(e) =>
                          setForm({ ...form, dueDate: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Due Time *</label>
                      <input
                        type="time"
                        className="form-control"
                        value={form.dueTime}
                        onChange={(e) =>
                          setForm({ ...form, dueTime: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Priority</label>
                    <select
                      className="form-select"
                      value={form.priority}
                      onChange={(e) =>
                        setForm({ ...form, priority: e.target.value })
                      }
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingTask ? "Update" : "Assign"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
