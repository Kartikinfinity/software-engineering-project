import { useState } from "react";
import { API_URL } from "../config";

const roleRoutes = {
  student: "/student-dashboard",
  teacher: "/teacher-dashboard",
  admin: "/admin-dashboard",
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      setMessage("Enter your email and password");
      return;
    }
    setLoading(true);
    setMessage("Signing in...");
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = roleRoutes[data.user.role] || "/student-dashboard";
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Unable to reach the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div className="main-card login-card">
        <div className="page-title">Smart Leave System</div>
        <p className="text-muted" style={{ marginBottom: 20 }}>
          Access your dashboard with your institute credentials.
        </p>

        <form className="grid" onSubmit={handleLogin}>
          <div>
            <label className="section-title">Email</label>
            <input
              className="input-field"
              type="email"
              placeholder="name@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="section-title">Password</label>
            <input
              className="input-field"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="section-title">Login as</label>
            <select className="input-field" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button className="main-btn" type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {message && (
          <p className="text-muted" style={{ marginTop: 14, textAlign: "center", fontWeight: 600 }}>
            {message}
          </p>
        )}

        <p className="text-muted" style={{ marginTop: 30, textAlign: "center" }}>
          Trouble signing in? Contact your administrator.
        </p>
      </div>
    </div>
  );
}