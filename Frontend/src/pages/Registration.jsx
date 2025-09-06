import React, { useState } from "react";
import { FiCamera } from "react-icons/fi";
import { NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import "../styles/registration.css";

const Registration = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    profileImage: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      profileImage: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Send as JSON instead of multipart
      const res = await axiosInstance.post("/users/signup", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        // Send profileImage as string URL or skip for now
        profileImage: formData.profileImage
          ? formData.profileImage.name
          : undefined,
      });

      setSuccess(res.data.message || "Account created successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        {/* Left image section */}
        <div className="registration-image-section">
          <img
            src="https://i.pinimg.com/736x/34/58/f5/3458f51c93268fe04ede2e3229fb1202.jpg"
            alt="Registration Visual"
          />
        </div>

        {/* Right form section */}
        <div className="registration-form-section">
          <h2>Create an Account</h2>
          <div className="login-link">
            Already have an account?
            <NavLink to="/login"> Login</NavLink>
          </div>

          {/* Profile image upload */}
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              border: "2px solid #2E7D32",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "10px auto 25px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                opacity: 0,
                cursor: "pointer",
              }}
            />
            {formData.profileImage ? (
              <img
                src={URL.createObjectURL(formData.profileImage)}
                alt="Profile Preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <FiCamera size={28} color="#2E7D32" />
            )}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="form-input-wrapper">
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="form-input"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="form-input-wrapper" style={{ marginTop: "15px" }}>
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

            {/* Terms & Conditions */}
            <div className="terms-checkbox">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree with the <a href="#">Terms and Conditions</a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="create-account-btn"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Account"}
            </button>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
