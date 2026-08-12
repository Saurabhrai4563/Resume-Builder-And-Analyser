import React from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../features/auth/hooks/useAuth";
import "./Navbar.scss";

const Navbar = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await handleLogout();
    navigate("/login");
  };

  return (
    <header className="app-navbar">
      <div className="navbar-container">
        <Link to="/" className="brand-logo">
          <span className="logo-icon">✨</span>
          <span className="logo-text">Interview<span className="logo-highlight">AI</span></span>
        </Link>

        <div className="nav-actions">
          {user ? (
            <div className="user-profile-menu">
              <span className="user-badge">👤 {user.username}</span>
              <button onClick={onLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-btn">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
