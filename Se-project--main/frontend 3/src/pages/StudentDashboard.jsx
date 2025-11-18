import { useEffect, useMemo, useState } from "react";
import { API_URL } from "../config";

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
};

export default function StudentDashboard() {
  const [stats, setStats] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useMemo(() => JSON.parse(localStorage.getItem("user") || "{}"), []);

  const totals = useMemo(() => {
    return stats.reduce(
      (acc, s) => {
        acc.subjects += 1;
        acc.maxLeaves += Number(s.maxLeaves || 0);
        acc.taken += Number(s.leavesTaken || 0);
        acc.remaining += Number(s.leavesRemaining || 0);
        acc.pending += Number(s.leavesPending || 0);
        return acc;
      },
      { subjects: 0, maxLeaves: 0, taken: 0, remaining: 0, pending: 0 }
    );
  }, [stats]);

  const summaryCards = [
    {
      label: "Active Subjects",
      value: totals.subjects,
      detail: "Tracked this semester",
    },
    {
      label: "Leaves Used",
      value: totals.taken,
      detail: `of ${totals.maxLeaves || "—"} allotted`,
    },
    {
      label: "Leaves Remaining",
      value: totals.remaining,
      detail: "Balance across subjects",
    },
    {
      label: "Pending Approvals",
      value: totals.pending,
      detail: "Awaiting teacher review",
    },
  ];

  useEffect(() => {
    const studentId = user?.id;
    if (!studentId) {
      window.location.href = "/";
      return;
    }
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/student/dashboard/${studentId}`);
        const data = await res.json();
        if (res.ok) {
          setStats(data.subjectStats || []);
          setRecent(data.recentLeaves || []);
        } else {
          console.error(data);
        }
      } catch (err) {
        console.error("Network error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="page-center">
        <div className="main-card">
          <p className="text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-center">
      <div className="main-card">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Student Dashboard</p>
            <h1 className="page-title">Welcome, {user?.name || "Student"}</h1>
            <p className="text-muted">Track leave balances, pending approvals, and recent submissions.</p>
          </div>
          <div className="header-actions">
            <button className="main-btn" onClick={() => (window.location.href = "/apply-leave")}>
              Apply Leave
            </button>
            <button className="ghost-btn" onClick={() => (window.location.href = "/apply-od")}>
              Apply OD
            </button>
            <button className="ghost-btn" onClick={() => (window.location.href = "/profile")}>
              View Profile
            </button>
          </div>
        </header>

        <div className="summary-grid">
          {summaryCards.map((card) => (
            <div className="summary-card" key={card.label}>
              <p className="text-muted">{card.label}</p>
              <h3>{card.value}</h3>
              <span>{card.detail}</span>
            </div>
          ))}
        </div>

        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>Subjects & Leave Balance</h2>
              <p className="text-muted">Live overview per subject</p>
            </div>
            <span className="pill muted">{stats.length} subjects</span>
          </div>

          {stats.length === 0 ? (
            <div className="empty-state">No subjects configured yet.</div>
          ) : (
            <div className="subject-grid">
              {stats.map((s) => {
                const usagePercent = Math.min(100, (s.leavesTaken / Math.max(1, s.maxLeaves)) * 100);
                return (
                  <div className="subject-card" key={s.subjectId}>
                    <div className="subject-card-head">
                      <div>
                        <p className="subject-name">{s.name}</p>
                        <p className="text-muted">{s.code}</p>
                      </div>
                      <div className="subject-remaining">
                        <span className="label">Remaining</span>
                        <strong>{s.leavesRemaining}</strong>
                      </div>
                    </div>

                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${usagePercent}%` }} />
                    </div>

                    <div className="progress-meta">
                      <span>Taken: {s.leavesTaken}</span>
                      <span>Max: {s.maxLeaves}</span>
                      <span>Pending: {s.leavesPending}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>Recent Leaves</h2>
              <p className="text-muted">
                {recent.length ? "Latest submissions and their statuses" : "No submissions yet"}
              </p>
            </div>
          </div>

          {recent.length === 0 ? (
            <div className="empty-state">No leave applications yet.</div>
          ) : (
            <div className="table-box">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((r) => (
                    <tr key={r._id}>
                      <td>{r.subject?.name || "—"}</td>
                      <td className="text-capitalize">{r.type}</td>
                      <td>{formatDate(r.fromDate)}</td>
                      <td>{formatDate(r.toDate)}</td>
                      <td>
                        <span className={`status-pill ${r.status}`}>{r.status}</span>
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