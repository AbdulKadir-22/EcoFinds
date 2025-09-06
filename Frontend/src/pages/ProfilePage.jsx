import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import Header from "../components/Header";
import "../styles/Profile.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("⚠️ You must be logged in to view your profile.");
          setLoading(false);
          return;
        }

        const res = await axiosInstance.get("/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
      } catch (err) {
        console.error(err);
        setError("❌ Failed to load profile. Please login again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="loading">Loading profile...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <Header />
      <div className="profile-page">
        <div className="profile-header">
          <img
            src={
              user.profileImage ||
              "https://placehold.co/150x150/EFEFEF/3A3A3A?text=No+Image"
            }
            alt={user.username}
            className="profile-img"
          />
          <h2>{user.username}</h2>
          <p className="email">{user.email}</p>
          <p className="joined">
            Member since <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          </p>
        </div>

        {/* ✅ Navigation Section */}
        <div className="profile-nav">
          <h3>Quick Actions</h3>
          <button className="nav-btn light" onClick={() => navigate("/cart")}>
            🛒 My Cart
          </button>
          <button
            className="nav-btn primary"
            onClick={() => navigate("/products/new")}
          >
            ➕ Add New Product
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
