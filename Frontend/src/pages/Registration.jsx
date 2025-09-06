import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/registration.css";
// import axiosInstance from "../api/axios"; // Assuming you have this configured

const Registration = () => {
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
  });
  const [profileImage, setProfileImage] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Mock API call for demonstration
    console.log("Submitting:", {
        name: formData.displayName,
        email: formData.email,
        password: formData.password,
        // profileImage would be handled as a file upload
    });

    // Replace with your actual API call
    setTimeout(() => {
        setSuccess("Account created successfully!");
        setLoading(false);
        // setTimeout(() => navigate("/login"), 1500);
    }, 1000);


    /*
    // --- Your Original API Call Logic (Adjusted) ---
    const payload = {
      name: formData.displayName,
      email: formData.email,
      password: formData.password,
    };

    try {
      const res = await axiosInstance.post("/user/signup", payload);
      setSuccess(res.data.message || "Account created successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
    */
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <div className="registration-image-section">
          <img
            src="https://i.pinimg.com/736x/ab/ef/e1/abefe11b7fc5206ce977d940cbc9e3f2.jpg"
            alt="EcoFinds Visual"
          />
        </div>

        <div className="registration-form-section">
          <h2>Create an Account</h2>
          <div className="login-link">
            Already have an account?
            <NavLink to="/login"> Login</NavLink>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="profile-image-uploader">
                <input 
                    type="file" 
                    id="profileImage" 
                    name="profileImage" 
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }} 
                />
                <label htmlFor="profileImage" className="uploader-label">
                    {profileImage ? (
                        <img src={profileImage} alt="Profile Preview" className="profile-preview"/>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-camera"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                    )}
                </label>
            </div>

            <div className="form-input-wrapper">
              <input
                type="text"
                name="displayName"
                placeholder="Display Name"
                className="form-input"
                value={formData.displayName}
                onChange={handleChange}
                required
              />
            </div>
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
            <div className="form-input-wrapper">
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

            <button type="submit" className="create-account-btn" disabled={loading}>
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
