import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import signupBg from '../assets/login.jpg';
import "../App.css";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "user" }); // Default role: user
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/signup", formData);
      navigate("/login");
    } catch (err) {
      console.error("Signup Error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="auth-container signup" style={{ backgroundImage: `url(${signupBg})` }}>
      <div className="auth-card">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />

          <select name="role" onChange={handleChange} required>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
