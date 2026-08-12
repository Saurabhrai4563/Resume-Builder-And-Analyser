import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "../../../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import "../auth.form.scss";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { handleRegister } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await handleRegister({ username, email, password });
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="auth-page">
        <div className="form-container">
          <div className="form-header">
            <h1>Create Account</h1>
            <p>Start preparing for your dream interview today</p>
          </div>

          {error && (
            <div className="auth-error">
              <span>⚠️ {error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                id="username"
                placeholder="johndoe"
                name="username"
                value={username}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                placeholder="name@example.com"
                name="email"
                value={email}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password (min. 6 chars)</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                placeholder="••••••••"
                name="password"
                value={password}
                required
              />
            </div>
            <button className="button primary-button" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>
          <p className="auth-footer">
            Already have an account? <Link to={"/login"}>Login</Link>
          </p>
        </div>
      </main>
    </>
  );
};

export default Register;
