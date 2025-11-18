import { useEffect, useState } from "react";
import { API_URL } from "../../config";

export default function AssignTeacher() {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teacherId, setTeacherId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teachersRes, subjectsRes] = await Promise.all([
          fetch(`${API_URL}/api/admin/teachers`),
          fetch(`${API_URL}/api/admin/subjects`),
        ]);
        const teachersData = await teachersRes.json();
        const subjectsData = await subjectsRes.json();
        setTeachers(teachersData.teachers || []);
        setSubjects(subjectsData.subjects || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (!teacherId || !subjectId) {
      setMsg("Please select both subject and teacher.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/admin/assign-teacher`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId, subjectId }),
      });
      const data = await res.json();
      setMsg(data.message);
    } catch (err) {
      console.error(err);
      setMsg("Unable to assign teacher");
    }
  };

  return (
    <div className="page-center">
      <div className="main-card">
        <div className="page-title">Assign Teacher</div>
        <p className="text-muted" style={{ marginBottom: 24 }}>
          Link subjects with available teachers for streamlined workflows.
        </p>

        <form className="form-grid" onSubmit={submit}>
          <div className="form-field">
            <label className="section-title">Subject</label>
            <select className="input-field" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
              <option value="">Select Subject</option>
              {subjects.map((s) => (
                <option value={s._id} key={s._id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label className="section-title">Teacher</label>
            <select className="input-field" value={teacherId} onChange={(e) => setTeacherId(e.target.value)}>
              <option value="">Select Teacher</option>
              {teachers.map((t) => (
                <option value={t._id} key={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button className="main-btn" type="submit">
              Assign Teacher
            </button>
            <button className="ghost-btn" type="button" onClick={() => (window.location.href = "/admin-dashboard")}>
              Cancel
            </button>
          </div>
        </form>

        {msg && (
          <p className="text-muted" style={{ marginTop: 16, fontWeight: 600 }}>
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}
