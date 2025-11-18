import { useEffect, useMemo, useState } from "react";
import { API_URL } from "../config";

export default function ApplyOD() {
  const user = useMemo(() => JSON.parse(localStorage.getItem("user") || "{}"), []);
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState("");
  const [eventName, setEventName] = useState("");
  const [venue, setVenue] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [faculty, setFaculty] = useState("");
  const [notes, setNotes] = useState("");
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!subject || !eventName || !fromDate || !toDate) {
      setMessage("Please fill all mandatory fields.");
      return;
    }

    setSubmitting(true);
    setMessage("Submitting OD request...");

    const payload = {
      student: user.id,
      subject,
      fromDate,
      toDate,
      type: "od",
      reason: `[OD] ${eventName} at ${venue || "N/A"} | Faculty: ${faculty || "N/A"} | Notes: ${notes || "N/A"}`,
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
        <div className="page-title">Apply On Duty (OD)</div>
        <p className="text-muted" style={{ marginBottom: 24 }}>
          Provide event details so your faculty can approve OD faster.
        </p>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="section-title">Subject</label>
            <select className="input-field" value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="">Select subject</option>
              {subjects.map((s) => (
                <option value={s.subjectId} key={s.subjectId}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label className="section-title">Event Name</label>
            <input
              className="input-field"
              type="text"
              placeholder="Workshop / Hackathon / Sports Meet"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label className="section-title">Venue</label>
            <input
              className="input-field"
              type="text"
              placeholder="College / City / Virtual"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
            />
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
            <label className="section-title">Faculty In-Charge</label>
            <input
              className="input-field"
              type="text"
              placeholder="Faculty name"
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label className="section-title">Additional Notes</label>
            <textarea
              className="input-field"
              rows="3"
              placeholder="Mention schedule, travel info, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="submit" className="main-btn" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit OD Request"}
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