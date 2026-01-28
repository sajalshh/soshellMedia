import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig"; // Adjust path if needed based on your folder structure

export default function ManageAiCalls() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch data
  const fetchCalls = async () => {
    try {
      const res = await api.get("/ai-call/logs");
      if (res.data.success) {
        setCalls(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch call logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalls();
  }, []);

  // Helper for status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case "called":
        return <span className="badge bg-success">Called</span>;
      case "pending":
        return <span className="badge bg-warning text-dark">Pending</span>;
      case "failed":
        return <span className="badge bg-danger">Failed</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>AI Call Requests</h3>
        <button className="btn btn-sm btn-outline-primary" onClick={fetchCalls}>
          <i className="fa-solid fa-rotate-right me-2"></i> Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Twilio SID</th>
              </tr>
            </thead>
            <tbody>
              {calls.length > 0 ? (
                calls.map((call) => (
                  <tr key={call._id}>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {new Date(call.createdAt).toLocaleString()}
                    </td>
                    <td className="fw-bold">{call.name}</td>
                    <td>{call.email}</td>
                    <td>{call.phone}</td>
                    <td>{getStatusBadge(call.status)}</td>
                    <td className="text-muted small">
                      {call.callSid || "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No call requests found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
