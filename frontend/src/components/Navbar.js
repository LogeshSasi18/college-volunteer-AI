import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"; 

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const navigate = useNavigate();

  useEffect(() => {
    const updateAuthState = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("authChange", updateAuthState);

    return () => {
      window.removeEventListener("authChange", updateAuthState);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);

    // Dispatch an event after logout
    window.dispatchEvent(new Event("authChange"));

    navigate("/login");
  };

  return (
    <nav className="navbar">
  <div className="navbar-box">
    <h2 className="logo">AI Volunteer Matcher</h2>
    <ul className="nav-links">
      <li><Link to="/" className="nav-item">Home</Link></li>
      {isLoggedIn && role === "user" && <li><Link to="/profile" className="nav-item">Profile</Link></li>}
      {isLoggedIn && role === "user" && <li><Link to="/events" className="nav-item">Events</Link></li>}
      {/* {isLoggedIn && role === "user" && <li><Link to="/notifications" className="nav-item">Notifications</Link></li>} */}
      {isLoggedIn && role === "admin" && <li><Link to="/admin/dashboard" className="nav-item">Admin Dashboard</Link></li>}
      {isLoggedIn && role === "admin" && <li><Link to="/admin/manage-events" className="nav-item">Manage Events</Link></li>}
      {isLoggedIn && role === "admin" && <li><Link to="/admin/add-event" className="nav-item add-event-btn">Add Event</Link></li>}
      {!isLoggedIn ? (
        <>
          <li><Link to="/signup" className="nav-item">Signup</Link></li>
          <li><Link to="/login" className="nav-item">Login</Link></li>
          {/* <li><Link to="/forgot-password" className="nav-item">Forgot Password</Link></li> */}
        </>
      ) : (
        <li>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </li>
      )}
    </ul>
  </div>
</nav>

  );
};

export default Navbar;
