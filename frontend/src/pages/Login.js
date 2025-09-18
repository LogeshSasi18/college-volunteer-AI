import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import loginBg from '../assets/login.jpg';
import "../App.css";


const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      console.log("API Response:", res.data); // Log API response
      
      if (res.data.user && res.data.token) {
        console.log("User ID:", res.data.user.id);
        console.log("User Role:", res.data.user.role);
  
        localStorage.setItem('userId', res.data.user.id);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.user.role);
  
        alert('Login successful!');
  
        window.dispatchEvent(new Event("authChange"));
  
        // Force navigation
        if (res.data.user.role === 'admin') {
          console.log("Navigating to /events");
          navigate('/', { replace: true });
        } else {
          console.log("Navigating to /profile");
          navigate('/', { replace: true });
        }
      } else {
        alert('Login failed: No user data received');
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      alert(err.response?.data?.msg || 'Login failed. Please try again.');
    }
  };
  

  return (
    <div className="auth-container login" style={{ backgroundImage: `url(${loginBg})` }}>
      <div className="auth-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit">Login</button>
        </form>
        <p>
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
