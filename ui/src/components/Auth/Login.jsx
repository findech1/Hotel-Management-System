import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../store/authSlice";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage("Please enter username and password");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await dispatch(login({ username, password })).unwrap();
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setLoading(false);
      setMessage(error || "Invalid username or password");
    }
  };

  return (
    // ═══════════════════════════════════════════════════════════════
//  LOGIN PAGE — EDITABLE JSX SECTION (REDESIGNED)
//  Drop this in place of your existing return() JSX
// ═══════════════════════════════════════════════════════════════

<div className="login-container">

  {/* ── LEFT PANEL ─────────────────────────────────────────── */}
  <div className="login-left">

    <div className="login-brand">
      <div className="brand-eyebrow">Luxury Hospitality</div>
      <h1>Hotel<br /><em>Management</em></h1>
      <p>The definitive platform for seamless, refined hotel operations and guest experiences.</p>
    </div>

    <div className="ornament">
      <span className="ornament-line" />
      <span className="ornament-diamond" />
      <span className="ornament-line" />
    </div>

    <div className="login-features">
      <div className="feature">
        <div className="feature-icon">
          <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
          </svg>
        </div>
        <div className="feature-body">
          <h3>Effortless Booking</h3>
          <p>Reserve the perfect room in seconds, with full inventory visibility.</p>
        </div>
      </div>

      <div className="feature">
        <div className="feature-icon">
          <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <div className="feature-body">
          <h3>Enterprise Security</h3>
          <p>Your data is guarded with industry-leading encryption and access controls.</p>
        </div>
      </div>

      <div className="feature">
        <div className="feature-icon">
          <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div className="feature-body">
          <h3>24 / 7 Concierge</h3>
          <p>Our support team is available around the clock, every day of the year.</p>
        </div>
      </div>
    </div>

    <p className="login-left-footer">
      "Where every detail tells a story of elegance."
    </p>

  </div>

  {/* ── RIGHT PANEL ────────────────────────────────────────── */}
  <div className="login-right">
    <div className="login-form-container">

      <div className="form-eyebrow">Staff Portal</div>
      <h2>Welcome<br /><em>Back</em></h2>
      <p className="subtitle">Sign in to access your dashboard</p>

      <div className="form-divider" />

      <form onSubmit={handleLogin}>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <div className="input-wrapper">
            <span className="input-icon">
              <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </span>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-wrapper">
            <span className="input-icon">
              <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        {message && (
          <div className="alert alert-danger fade show" role="alert">
            <span className="alert-icon">
              <svg viewBox="0 0 24 24" stroke="#8B2A2A" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </span>
            {message}
          </div>
        )}

        <button type="submit" className="btn-login" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Signing in…
            </>
          ) : (
            <>
              <span>Sign In</span>
              <span className="btn-arrow">→</span>
            </>
          )}
        </button>

      </form>

      <div className="demo-credentials">
        <p>Demo Credentials</p>
        <div className="credentials">
          <div className="cred-box">
            <strong>Admin</strong>
            <small>admin / admin123</small>
          </div>
          <div className="cred-box">
            <strong>User</strong>
            <small>user / user123</small>
          </div>
        </div>
      </div>

    </div>
  </div>

</div>
  );
};

export default Login;
