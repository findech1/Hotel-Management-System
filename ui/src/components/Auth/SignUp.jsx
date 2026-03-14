import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../../store/authSlice";

const Signup = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [successful, setSuccessful] = useState(false);
	const [message, setMessage] = useState("");

	const dispatch = useDispatch();

	const handleRegister = (e) => {
		e.preventDefault();

		setMessage("");
		setSuccessful(false);

		dispatch(register({ username, password }))
			.unwrap()
			.then(() => {
				setSuccessful(true);
				setMessage("Registration successful");
			})
			.catch(() => {
				setSuccessful(false);
				setMessage("Failed to register");
			});
	};

	return (
		// ═══════════════════════════════════════════════════════════════
//  SIGNUP PAGE — EDITABLE JSX SECTION (REDESIGNED)
//  Drop this in place of your existing return() JSX
//  Make sure Login.css is imported in this file too:
//    import "../Login/Login.css";   (adjust path as needed)
// ═══════════════════════════════════════════════════════════════

<div className="signup-container">
  <div className="signup-card">

    <div className="signup-header">
      <div className="signup-eyebrow">Create Account</div>
      <h2>Join <em>The Estate</em></h2>
      <p>Register your staff credentials below</p>
    </div>

    <div className="signup-divider" />

    <form onSubmit={handleRegister}>

      <div className="form-group">
        <label htmlFor="username">Username</label>
        <div className="input-wrapper">
          <span className="input-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </span>
          <input
            type="text"
            id="username"
            className="form-control"
            name="username"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <div className="input-wrapper">
          <span className="input-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </span>
          <input
            type="password"
            id="password"
            className="form-control"
            name="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <button type="submit" className="btn-signup">
          <span>Create Account</span>
        </button>
      </div>

      {message && (
        <div className="form-group">
          <div
            className={successful ? "alert alert-success" : "alert alert-danger"}
            role="alert"
          >
            <span className="alert-icon">
              {successful ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="#2A5A2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="#8B2A2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              )}
            </span>
            {message}
          </div>
        </div>
      )}

    </form>

    <div className="signup-login-link">
      Already have an account? <a href="/login">Sign in here</a>
    </div>

  </div>
</div>
	);
};

export default Signup;
