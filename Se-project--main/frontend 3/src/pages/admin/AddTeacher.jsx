import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";

export default function AddTeacher() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");

  const addTeacher = async (event) => {
    event.preventDefault();
    if (!name || !email || !password) {
      setMessage("Name, email, and password are required.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setMessage("Creating teacher...");
    try {
      const res = await axios.post(`${API_URL}/api/admin/add-teacher`, {
        name,
        email,
        password,
        department,
      });

      setMessage(res.data.message || "Teacher created successfully");
      setStatus("success");
      setName("");
      setEmail("");
      setPassword("");
      setDepartment("");
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Network error";
      setMessage(errorMessage);
      setStatus("error");
    }
  };

  return (
    <div className="page-center">
      <div className="main-card">
        <div className="page-title">Add Teacher</div>
        <p className="text-muted" style={{ marginBottom: 24 }}>
          Onboard faculty members with instant access credentials.
        </p>

        <form className="form-grid" onSubmit={addTeacher}>
          <div className="form-field">
            <label className="section-title">Name</label>
            <input
              className="input-field"
              type="text"
              placeholder="Teacher Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label className="section-title">Email</label>
            <input
              className="input-field"
              type="email"
              placeholder="teacher@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label className="section-title">Temporary Password</label>
            <input
              className="input-field"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label className="section-title">Department (optional)</label>
            <input
              className="input-field"
              type="text"
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button className="main-btn" type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Adding..." : "Add Teacher"}
            </button>
            <button className="ghost-btn" type="button" onClick={() => (window.location.href = "/admin-dashboard")}>
              Cancel
            </button>
          </div>
        </form>

        {message && (
          <p className="text-muted" style={{ marginTop: 16, fontWeight: 600, color: status === "error" ? "#b91c1c" : "#0f172a" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
