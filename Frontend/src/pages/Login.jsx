import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios"; // ✅ use same instance
import "../styles/login.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post("/users/login", formData);

      const data = response.data;
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("username", data.username); // ✅ store username if needed
        localStorage.setItem("email", data.email);
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again later.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Right form section */}
        <div className="login-form-section">
          <h2>Welcome Back</h2>
          <div className="login-link">
            Don’t have an account? <NavLink to="/">Register</NavLink>
          </div>

          {error && <p className="error-text">{error}</p>}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-input-wrapper">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="form-input-wrapper" style={{ marginTop: "15px" }}>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Forgot password */}
            <div className="terms-checkbox">
              <label>
                <a href="#">Forgot Password?</a>
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        {/* Left image section */}
        <div className="login-image-section">
          <img
            src="https://i.pinimg.com/736x/34/58/f5/3458f51c93268fe04ede2e3229fb1202.jpg"
            alt="Login Visual"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
