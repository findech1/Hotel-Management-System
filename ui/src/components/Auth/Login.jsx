import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("handleLogin called!");
    alert("Login button clicked!");
    
    if (!username || !password) {
      setMessage("Please enter username and password");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      console.log("Dispatching login with:", { username, password });
      const result = await dispatch(login({ username, password })).unwrap();
      console.log("Login success:", result);
      window.location.reload();
    } catch (error) {
      console.error("Login failed:", error);
      setLoading(false);
      setMessage(error || "Invalid username or password");
    }
  };

  return (
    <div className="col-md-12">
      <div className="card card-container">
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="form-control"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading && (
                <span className="spinner-border spinner-border-sm me-2"></span>
              )}
              Login
            </button>
          </div>

          {message && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
