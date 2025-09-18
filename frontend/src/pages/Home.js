import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <div className="animated-bg">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animated-box"></div>
        ))}
      </div>

      {/* Hero Section */}
      <div className="home-content">
        <h1>Welcome to Volunteer Matcher</h1>
        <p>Connect with meaningful events that align with your skills and interests.</p>
        <Link to="/events" className="btn">
          Explore Events
        </Link>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="feature-box">
          <h3>Personalized Matches</h3>
          <p>Find events that suit your skills and interests through AI-driven matching.</p>
        </div>
        <div className="feature-box">
          <h3>Seamless Integration</h3>
          <p>Sync with your calendar and get reminders for upcoming events.</p>
        </div>
        <div className="feature-box">
          <h3>Impactful Volunteering</h3>
          <p>Contribute to causes that truly matter and track your impact.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
