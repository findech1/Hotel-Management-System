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
    <div className="login-container">
      <div className="login-left">
        <div className="login-brand">
          <h1>🏨 Hotel Management</h1>
          <p>Your ultimate solution for seamless hotel bookings</p>
        </div>
        <div className="login-features">
          <div className="feature">
            <div className="feature-icon">✨</div>
            <h3>Easy Booking</h3>
            <p>Book your perfect room in just a few clicks</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Safe</h3>
            <p>Your data is protected with enterprise-grade security</p>
          </div>
          <div className="feature">
            <div className="feature-icon">24/7</div>
            <h3>24/7 Support</h3>
            <p>Our team is ready to help you anytime</p>
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-container">
          <h2>Welcome Back</h2>
          <p className="subtitle">Sign in to your account</p>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
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
                <span className="input-icon">🔐</span>
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
                <span className="alert-icon">⚠️</span> {message}
              </div>
            )}

            <button type="submit" className="btn btn-login" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Signing in...
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
            <p>Demo Credentials:</p>
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
