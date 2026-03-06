import React, { useState, useEffect, useCallback } from "react";
import usePrivateApi from "../../hooks/usePrivateApi";

export default function ManageAttendance() {
  const privateApi = usePrivateApi();
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");
  const [filterUser, setFilterUser] = useState("");

  // ── Fetch all users for the filter dropdown ──
  const fetchUsers = useCallback(async () => {
    try {
      const res = await privateApi.get("/admin/users");
      setUsers(res.data.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  }, [privateApi]);

  // ── Fetch attendance records with optional filters ──
  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterDate) params.append("date", filterDate);
      if (filterUser) params.append("userId", filterUser);

      const res = await privateApi.get(`/attendance/all?${params.toString()}`);
      setRecords(res.data.data);
    } catch (err) {
      console.error("Failed to fetch attendance records", err);
    } finally {
      setLoading(false);
    }
  }, [privateApi, filterDate, filterUser]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const formatTime = (d) =>
    d
      ? new Date(d).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  // ── Summary counts ──
  const totalPresent = records.length;
  const totalCheckedOut = records.filter((r) => r.checkOut).length;
  const totalActive = records.filter((r) => !r.checkOut).length;

  return (
    <div>
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
          { label: "Total Records", value: totalPresent, color: "#00ffcc" },
          { label: "Checked Out", value: totalCheckedOut, color: "#4da3ff" },
          { label: "Still Active", value: totalActive, color: "#fd7e14" },
        ].map((card) => (
          <div
            key={card.label}
            className="dashboard-card"
            style={{
              padding: "16px 24px",
              minWidth: 140,
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

      {/* ── Filters ── */}
      <div
        className="dashboard-card"
        style={{
          padding: 16,
          marginBottom: 16,
          display: "flex",
          gap: 12,
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
            Filter by Date
          </label>
          <input
            type="date"
            className="form-control"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{ maxWidth: 180 }}
          />
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
            Filter by Employee
          </label>
          <select
            className="form-select"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            style={{ maxWidth: 220 }}
          >
            <option value="">All Employees</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.username}
              </option>
            ))}
          </select>
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => {
            setFilterDate("");
            setFilterUser("");
          }}
        >
          Clear Filters
        </button>

        <button
          className="btn btn-outline-primary"
          style={{ marginLeft: "auto" }}
          onClick={fetchRecords}
        >
          🔄 Refresh
        </button>
      </div>

      {/* ── Table ── */}
      <div
        className="dashboard-card"
        style={{ padding: 0, overflow: "hidden" }}
      >
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Email</th>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Total Hours</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: 24 }}>
                  Loading...
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    color: "#888",
                    padding: 24,
                  }}
                >
                  No records found.
                </td>
              </tr>
            ) : (
              records.map((r) => (
                <tr key={r._id}>
                  <td style={{ fontWeight: 500 }}>{r.user?.username}</td>
                  <td style={{ color: "#888", fontSize: 13 }}>
                    {r.user?.email}
                  </td>
                  <td>{r.date}</td>
                  <td>{formatTime(r.checkIn)}</td>
                  <td>
                    {r.checkOut ? (
                      formatTime(r.checkOut)
                    ) : (
                      <span style={{ color: "#fd7e14" }}>Not yet</span>
                    )}
                  </td>
                  <td>{r.totalHours ? `${r.totalHours}h` : "—"}</td>
                  <td>
                    {r.checkOut ? (
                      <span className="badge bg-success">Complete</span>
                    ) : (
                      <span className="badge bg-warning text-dark">Active</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
