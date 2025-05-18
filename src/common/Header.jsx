import React from "react";
import { useNavigate } from "react-router-dom";
import "./Common.css"; // Import shared CSS

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="logo">Mentor Connect</h1>
        <nav className="nav-menu">
          <a href="/" className="nav-link">Home</a>
          <a href="/about" className="nav-link">About</a>
          <a href="/contact" className="nav-link">Contact</a>
          <button
            className="sign-in-btn"
            onClick={() => navigate("/login")} // Redirect to login page
          >
            Sign In
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
