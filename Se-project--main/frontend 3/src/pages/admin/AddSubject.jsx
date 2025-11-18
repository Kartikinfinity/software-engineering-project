import { useState } from "react";
import { API_URL } from "../../config";

export default function AddSubject() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [maxLeaves, setMaxLeaves] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!name || !code) {
      setMessage("Name and code are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/add-subject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, code, maxLeaves }),
      });
      const data = await res.json();
      setMessage(data.message);
      if (res.ok) {
        setName("");
        setCode("");
        setMaxLeaves("");
      }
    } catch (err) {
      console.error(err);
      setMessage("Unable to add subject");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div className="main-card">
        <div className="page-title">Add Subject</div>
        <p className="text-muted" style={{ marginBottom: 24 }}>
          Define new subjects and configure their leave policies.
        </p>

        <form className="form-grid" onSubmit={submit}>
          <div className="form-field">
            <label className="section-title">Subject Name</label>
            <input
              className="input-field"
              placeholder="Subject Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label className="section-title">Subject Code</label>
            <input className="input-field" placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)} />
          </div>

          <div className="form-field">
            <label className="section-title">Max Leaves</label>
            <input
              className="input-field"
              placeholder="Default 3"
              value={maxLeaves}
              onChange={(e) => setMaxLeaves(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button className="main-btn" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Add Subject"}
            </button>
            <button className="ghost-btn" type="button" onClick={() => (window.location.href = "/admin-dashboard")}>
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
