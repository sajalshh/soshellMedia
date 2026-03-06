import React, { useState, useEffect, useCallback } from "react";
import usePrivateApi from "../../hooks/usePrivateApi";

const STATUS_COLORS = {
  pending: { bg: "rgba(255,193,7,0.15)", color: "#ffc107" },
  "in-progress": { bg: "rgba(13,110,253,0.15)", color: "#4da3ff" },
  done: { bg: "rgba(0,255,204,0.1)", color: "#00ffcc" },
};

const PRIORITY_COLORS = {
  low: "#6c757d",
  medium: "#fd7e14",
  high: "#dc3545",
};

export default function EmployeeDashboard() {
  const privateApi = usePrivateApi();

  // Attendance state
  const [todayRecord, setTodayRecord] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [punchMessage, setPunchMessage] = useState({ text: "", error: false });

  // Task state
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  // Active tab
  const [activeTab, setActiveTab] = useState("attendance");

  // Checkout availability
  const [checkoutAvailable, setCheckoutAvailable] = useState(false);
  const [countdownText, setCountdownText] = useState("");

  // ── Fetch attendance ──
  const fetchAttendance = useCallback(async () => {
    try {
      const [todayRes, historyRes] = await Promise.all([
        privateApi.get("/attendance/my/today"),
        privateApi.get("/attendance/my"),
      ]);
      setTodayRecord(todayRes.data.data);
      setAttendanceHistory(historyRes.data.data);
    } catch (err) {
      console.error("Failed to fetch attendance", err);
    } finally {
      setAttendanceLoading(false);
    }
  }, [privateApi]);

  // ── Fetch tasks ──
  const fetchTasks = useCallback(async () => {
    try {
      const res = await privateApi.get("/tasks/my");
      setTasks(res.data.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    } finally {
      setTasksLoading(false);
    }
  }, [privateApi]);

  useEffect(() => {
    fetchAttendance();
    fetchTasks();
  }, [fetchAttendance, fetchTasks]);

  // ── Countdown timer — rechecks every 30 seconds ──
  useEffect(() => {
    const check = () => {
      if (!todayRecord || todayRecord.checkOut) {
        setCheckoutAvailable(false);
        setCountdownText("");
        return;
      }
      const checkInTime = new Date(todayRecord.checkIn);
      const unlockTime = new Date(checkInTime.getTime() + 5 * 60 * 60 * 1000);
      const now = new Date();
      if (now >= unlockTime) {
        setCheckoutAvailable(true);
        setCountdownText("");
      } else {
        const diff = unlockTime - now;
        const hrs = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setCheckoutAvailable(false);
        setCountdownText(`Available in ${hrs}h ${mins}m`);
      }
    };
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, [todayRecord]);

  // ── Punch In ──
  const handleCheckIn = async () => {
    try {
      await privateApi.post("/attendance/checkin");
      setPunchMessage({ text: "Checked in successfully!", error: false });
      await fetchAttendance();
    } catch (err) {
      setPunchMessage({
        text: err.response?.data?.message || "Check-in failed.",
        error: true,
      });
    }
    setTimeout(() => setPunchMessage({ text: "", error: false }), 4000);
  };

  // ── Punch Out ──
  const handleCheckOut = async () => {
    try {
      await privateApi.post("/attendance/checkout");
      setPunchMessage({ text: "Checked out successfully!", error: false });
      await fetchAttendance();
    } catch (err) {
      setPunchMessage({
        text: err.response?.data?.message || "Check-out failed.",
        error: true,
      });
    }
    setTimeout(() => setPunchMessage({ text: "", error: false }), 4000);
  };

  // ── Mark Task Done ──
  const handleMarkDone = async (taskId) => {
    try {
      await privateApi.put(`/tasks/${taskId}/done`);
      await fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update task.");
    }
  };

  const formatTime = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  const formatDateTime = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleString() : "—";

  return (
    <div>
      {/* ── Tabs ── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["attendance", "tasks"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border: "none",
              fontWeight: 600,
              background:
                activeTab === tab ? "#00ffcc" : "rgba(255,255,255,0.07)",
              color: activeTab === tab ? "#000" : "#a0a0a0",
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ════════════ ATTENDANCE TAB ════════════ */}
      {activeTab === "attendance" && (
        <div>
          {/* Today's Punch Card */}
          <div
            className="dashboard-card"
            style={{ marginBottom: 24, padding: 24 }}
          >
            <h5 style={{ marginBottom: 16 }}>
              Today —{" "}
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h5>

            {attendanceLoading ? (
              <p style={{ color: "#888" }}>Loading...</p>
            ) : (
              <>
                {/* Stats Row */}
                <div
                  style={{
                    display: "flex",
                    gap: 32,
                    marginBottom: 20,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, color: "#888" }}>CHECK-IN</div>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: "#00ffcc",
                      }}
                    >
                      {todayRecord ? formatTime(todayRecord.checkIn) : "—"}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#888" }}>CHECK-OUT</div>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: "#00ffcc",
                      }}
                    >
                      {todayRecord?.checkOut
                        ? formatTime(todayRecord.checkOut)
                        : "—"}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#888" }}>
                      TOTAL HOURS
                    </div>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: "#00ffcc",
                      }}
                    >
                      {todayRecord?.totalHours
                        ? `${todayRecord.totalHours}h`
                        : "—"}
                    </div>
                  </div>
                </div>

                {/* Punch Message */}
                {punchMessage.text && (
                  <div
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      marginBottom: 16,
                      background: punchMessage.error
                        ? "rgba(220,53,69,0.15)"
                        : "rgba(0,255,204,0.1)",
                      color: punchMessage.error ? "#ff6b6b" : "#00ffcc",
                      fontSize: 13,
                    }}
                  >
                    {punchMessage.text}
                  </div>
                )}

                {/* Action Buttons */}
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {/* No record today → show Check In */}
                  {!todayRecord && (
                    <button className="btn btn-primary" onClick={handleCheckIn}>
                      ✅ Punch In
                    </button>
                  )}

                  {/* Checked in but not out → show Punch Out or countdown */}
                  {todayRecord && !todayRecord.checkOut && (
                    <>
                      <button
                        className="btn btn-danger"
                        onClick={handleCheckOut}
                        disabled={!checkoutAvailable}
                      >
                        🚪 Punch Out
                      </button>
                      {!checkoutAvailable && countdownText && (
                        <span style={{ color: "#888", fontSize: 13 }}>
                          ⏳ {countdownText}
                        </span>
                      )}
                    </>
                  )}

                  {/* Fully done for the day */}
                  {todayRecord?.checkOut && (
                    <span style={{ color: "#00ffcc", fontWeight: 600 }}>
                      ✅ Attendance complete for today
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* History Table */}
          <div
            className="dashboard-card"
            style={{ padding: 0, overflow: "hidden" }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <h5 style={{ margin: 0 }}>Attendance History (Last 30 days)</h5>
            </div>
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Total Hours</th>
                </tr>
              </thead>
              <tbody>
                {attendanceHistory.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        textAlign: "center",
                        color: "#888",
                        padding: 24,
                      }}
                    >
                      No records yet.
                    </td>
                  </tr>
                ) : (
                  attendanceHistory.map((r) => (
                    <tr key={r._id}>
                      <td>{r.date}</td>
                      <td>{formatTime(r.checkIn)}</td>
                      <td>
                        {r.checkOut ? (
                          formatTime(r.checkOut)
                        ) : (
                          <span style={{ color: "#fd7e14" }}>
                            Not checked out
                          </span>
                        )}
                      </td>
                      <td>{r.totalHours ? `${r.totalHours}h` : "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ════════════ TASKS TAB ════════════ */}
      {activeTab === "tasks" && (
        <div>
          {tasksLoading ? (
            <p style={{ color: "#888" }}>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <div
              className="dashboard-card"
              style={{
                padding: 32,
                textAlign: "center",
                color: "#888",
              }}
            >
              No tasks assigned to you yet.
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="dashboard-card"
                  style={{
                    padding: 20,
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
                      <h6 style={{ margin: 0, fontWeight: 700 }}>
                        {task.title}
                      </h6>
                      {task.description && (
                        <p
                          style={{
                            margin: "4px 0 8px",
                            color: "#aaa",
                            fontSize: 13,
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
                        }}
                      >
                        <span>
                          📅 Due: {task.dueDate} at {task.dueTime}
                        </span>
                        <span>👤 Assigned by: {task.assignedBy?.username}</span>
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
                        {task.completedAt && (
                          <span>
                            ✅ Completed: {formatDateTime(task.completedAt)}
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
                      {task.status !== "done" && (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleMarkDone(task._id)}
                        >
                          Mark Done
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
