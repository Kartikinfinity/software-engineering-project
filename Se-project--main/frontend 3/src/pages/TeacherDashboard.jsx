import { useEffect, useMemo, useState } from "react";
import { API_URL } from "../config";

export default function TeacherDashboard() {
  const user = useMemo(() => JSON.parse(localStorage.getItem("user") || "{}"), []);
  const [pending, setPending] = useState([]);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user?.id) {
      window.location.href = "/";
      return;
    }
    const fetchData = async () => {
      try {
        const [pendingRes, historyRes] = await Promise.all([
          fetch(`${API_URL}/api/teacher/pending/${user.id}`),
          fetch(`${API_URL}/api/teacher/history/${user.id}`),
        ]);
        const pendingData = await pendingRes.json();
        const historyData = await historyRes.json();
        setPending(pendingData.leaves || []);
        setHistory(historyData.leaves || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [user?.id]);

  const updateStatus = async (leaveId, action) => {
    const url =
      action === "approve"
        ? `${API_URL}/api/teacher/approve/${leaveId}`
        : `${API_URL}/api/teacher/reject/${leaveId}`;
    try {
      const res = await fetch(url, { method: "POST" });
      const data = await res.json();
      setMessage(data.message);
      setPending((prev) => prev.filter((leave) => leave._id !== leaveId));
    } catch (err) {
      console.error(err);
      setMessage("Unable to update status");
    }
  };

  const summary = [
    { label: "Pending Requests", value: pending.length },
    { label: "Approved", value: history.filter((h) => h.status === "approved").length },
    { label: "Rejected", value: history.filter((h) => h.status === "rejected").length },
  ];

  const previewPending = pending.slice(0, 3);

  return (
    <div className="page-center">
      <div className="main-card">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Teacher Dashboard</p>
            <h1 className="page-title">Hi {user?.name || "Teacher"}</h1>
            <p className="text-muted">Review student leave requests and act quickly.</p>
          </div>
          <div className="header-actions">
            <button className="main-btn" onClick={() => (window.location.href = "/teacher/pending")}>
              View Pending
            </button>
            <button className="ghost-btn" onClick={() => (window.location.href = "/teacher/history")}>
              View History
            </button>
          </div>
        </header>

        <div className="summary-grid">
          {summary.map((card) => (
            <div className="summary-card" key={card.label}>
              <p className="text-muted">{card.label}</p>
              <h3>{card.value}</h3>
            </div>
          ))}
        </div>

        {message && <div className="alert success">{message}</div>}

        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>Pending Snapshot</h2>
              <p className="text-muted">Latest requests assigned to you</p>
            </div>
            <button className="ghost-btn" onClick={() => (window.location.href = "/teacher/pending")}>
              See all
            </button>
          </div>

          {previewPending.length === 0 ? (
            <div className="empty-state">No pending leaves.</div>
          ) : (
            <div className="table-box">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Subject</th>
                    <th>Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {previewPending.map((leave) => (
                    <tr key={leave._id}>
                      <td>
                        <div>{leave.student?.name}</div>
                        <small className="text-muted">{leave.student?.email}</small>
                      </td>
                      <td>{leave.subject?.name}</td>
                      <td className="text-capitalize">{leave.type}</td>
                      <td>{new Date(leave.fromDate).toLocaleDateString()}</td>
                      <td>{new Date(leave.toDate).toLocaleDateString()}</td>
                      <td>
                        <div className="table-actions">
                          <button className="main-btn" onClick={() => updateStatus(leave._id, "approve")}>
                            Approve
                          </button>
                          <button className="ghost-btn" onClick={() => updateStatus(leave._id, "reject")}>
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
