import { useEffect, useMemo, useState } from "react";
import { API_URL } from "../config";

export default function ApplyLeave() {
  const user = useMemo(() => JSON.parse(localStorage.getItem("user") || "{}"), []);
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [type, setType] = useState("normal");
  const [reason, setReason] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      window.location.href = "/";
      return;
    }
    const fetchSubjects = async () => {
      try {
        const res = await fetch(`${API_URL}/api/student/dashboard/${user.id}`);
        const data = await res.json();
        setSubjects(data.subjectStats || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSubjects();
  }, [user?.id]);

  const selectedSubject = subjects.find((s) => s.subjectId === subject);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!subject || !fromDate || !toDate) {
      setMessage("Please fill all required fields.");
      return;
    }

    setSubmitting(true);
    setMessage("Submitting leave...");

    const payload = {
      student: user.id,
      subject,
      fromDate,
      toDate,
      type,
      reason,
      medicalFile: file ? file.name : null,
    };

    try {
      const res = await fetch(`${API_URL}/api/leave/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setMessage(data.message || "Request submitted");
      if (res.ok) {
        setTimeout(() => (window.location.href = "/student-dashboard"), 1000);
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error - please try again");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-center">
      <div className="main-card">
        <div className="page-title">Apply Leave</div>
        <p className="text-muted" style={{ marginBottom: 24 }}>
          Submit a leave application with complete details for faster approval.
        </p>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="section-title">Subject</label>
            <select className="input-field" value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="">Select subject</option>
              {subjects.map((s) => (
                <option value={s.subjectId} key={s.subjectId}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
            {selectedSubject && (
              <p className="form-note">
                Leaves remaining: <strong>{selectedSubject.leavesRemaining}</strong> / {selectedSubject.maxLeaves}
              </p>
            )}
          </div>

          <div className="form-grid two-col">
            <div className="form-field">
              <label className="section-title">From Date</label>
              <input className="input-field" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>
            <div className="form-field">
              <label className="section-title">To Date</label>
              <input className="input-field" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
          </div>

          <div className="form-field">
            <label className="section-title">Leave Type</label>
            <select className="input-field" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="normal">Normal Leave</option>
              <option value="medical">Medical Leave</option>
              <option value="od">On Duty (Event)</option>
            </select>
          </div>

          {type === "medical" && (
            <div className="form-field">
              <label className="section-title">Upload Medical Certificate</label>
              <input className="input-field" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <p className="form-note">PDF / JPG files under 2MB.</p>
            </div>
          )}

          <div className="form-field">
            <label className="section-title">Reason</label>
            <textarea
              className="input-field"
              rows="4"
              placeholder="Explain your reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="submit" className="main-btn" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Leave"}
            </button>
            <button type="button" className="ghost-btn" onClick={() => (window.location.href = "/student-dashboard")}>
              Cancel
            </button>
          </div>
        </form>

        {message && (
          <p className="text-muted" style={{ marginTop: 16, fontWeight: 600 }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
