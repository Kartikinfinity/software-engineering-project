import { useEffect, useMemo, useState } from "react";
import { API_URL } from "../config";

export default function Profile() {
  const user = useMemo(() => JSON.parse(localStorage.getItem("user") || "{}"), []);
  const [stats, setStats] = useState({ taken: 0, pending: 0, remaining: 0, subjects: 0 });

  useEffect(() => {
    if (!user?.id) {
      window.location.href = "/";
      return;
    }
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_URL}/api/student/dashboard/${user.id}`);
        const data = await res.json();
        const subjectStats = data.subjectStats || [];
        const aggregated = subjectStats.reduce(
          (acc, s) => {
            acc.subjects += 1;
            acc.taken += Number(s.leavesTaken || 0);
            acc.pending += Number(s.leavesPending || 0);
            acc.remaining += Number(s.leavesRemaining || 0);
            return acc;
          },
          { taken: 0, pending: 0, remaining: 0, subjects: 0 }
        );
        setStats(aggregated);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, [user?.id]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="page-center">
      <div className="main-card">
        <div className="page-title">Profile</div>
        <p className="text-muted" style={{ marginBottom: 24 }}>
          Personal information and leave summary.
        </p>

        <div className="grid two-col profile-grid">
          <div className="widget">
            <p className="section-title">Name</p>
            <h3>{user?.name || "Student"}</h3>
          </div>
          <div className="widget">
            <p className="section-title">Email</p>
            <h3>{user?.email}</h3>
          </div>
          <div className="widget">
            <p className="section-title">Role</p>
            <h3 className="text-capitalize">{user?.role}</h3>
          </div>
          <div className="widget">
            <p className="section-title">Subjects Tracked</p>
            <h3>{stats.subjects}</h3>
          </div>
        </div>

        <div className="summary-grid" style={{ marginTop: 32 }}>
          <div className="summary-card">
            <p className="text-muted">Leaves Taken</p>
            <h3>{stats.taken}</h3>
          </div>
          <div className="summary-card">
            <p className="text-muted">Pending Leaves</p>
            <h3>{stats.pending}</h3>
          </div>
          <div className="summary-card">
            <p className="text-muted">Leaves Remaining</p>
            <h3>{stats.remaining}</h3>
          </div>
        </div>

        <div className="form-actions" style={{ marginTop: 32 }}>
          <button className="main-btn" onClick={() => (window.location.href = "/student-dashboard")}>
            Back to Dashboard
          </button>
          <button className="ghost-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

