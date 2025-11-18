import { useEffect, useState } from "react";
import { API_URL } from "../../config";

export default function ViewSubjects() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/admin/subjects`)
      .then((res) => res.json())
      .then((data) => setSubjects(data.subjects || []));
  }, []);

  return (
    <div className="page-center">
      <div className="main-card">
        <div className="page-title">All Subjects</div>
        <p className="text-muted" style={{ marginBottom: 24 }}>
          Monitor subject inventory, codes, leave quotas, and assigned teachers.
        </p>

        <div className="table-box">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Max Leaves</th>
                <th>Teacher</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((s) => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.code}</td>
                  <td>{s.maxLeaves}</td>
                  <td>
                    <span className={`status-pill ${s.teacher ? "approved" : "pending"}`}>
                      {s.teacher ? s.teacher.name : "Not assigned"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
