import { useEffect, useMemo, useState } from "react";
import { API_URL } from "../config";

export default function TeacherApproved() {
  const user = useMemo(() => JSON.parse(localStorage.getItem("user") || "{}"), []);
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      window.location.href = "/";
      return;
    }
    const fetchLeaves = async () => {
      try {
        const res = await fetch(`${API_URL}/api/teacher/history/${user.id}`);
        const data = await res.json();
        setLeaves(data.leaves || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, [user?.id]);

  const filteredLeaves = leaves.filter((leave) => {
    const matchesStatus = filter === "all" ? true : leave.status === filter;
    const studentName = leave.student?.name?.toLowerCase() || "";
    const matchesSearch = studentName.includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="page-center">
      <div className="main-card">
        <div className="page-title">Leave History</div>
        <p className="text-muted" style={{ marginBottom: 24 }}>
          Approved and rejected requests handled by you.
        </p>

        <div className="filters">
          <select className="input-field" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <input
            className="input-field"
            type="text"
            placeholder="Search student"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="empty-state">Loading history...</div>
        ) : filteredLeaves.length === 0 ? (
          <div className="empty-state">No records found.</div>
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
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map((leave) => (
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
                      <span className={`status-pill ${leave.status}`}>{leave.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

