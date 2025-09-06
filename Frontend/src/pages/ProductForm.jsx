import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import "../styles/ProductForm.css";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
    status: "Available",
    seller: "",
    images: [], // ✅ array of image URLs
  });

  const [newImageUrl, setNewImageUrl] = useState(""); // input for adding new image
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add image URL to images array
  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData({ ...formData, images: [...formData.images, newImageUrl] });
      setNewImageUrl("");
    }
  };

  // Remove image from array
  const handleRemoveImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({ ...formData, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("authToken");

      const res = await axiosInstance.post("/products", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setSuccess("Product saved successfully!");
      console.log("Saved product:", res.data);

      // Reset form
      setFormData({
        title: "",
        description: "",
        price: "",
        quantity: "",
        category: "",
        status: "Available",
        seller: "",
        images: [],
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-container">
      <form className="product-details" onSubmit={handleSubmit}>
        <h2 className="section-title">Add / Edit Product</h2>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <input
          type="text"
          name="title"
          placeholder="Product Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        {/* Image URL input + preview list */}
        <div style={{ margin: "15px 0" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              placeholder="Enter Image URL"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
            />
            <button type="button" className="add-image-btn"onClick={handleAddImage}>
              Add
            </button>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
            {formData.images.map((url, idx) => (
              <div key={idx} style={{ position: "relative" }}>
                <img
                  src={url}
                  alt={`Preview ${idx}`}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-6px",
                    background: "red",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="description"
          placeholder="Product Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
        />

        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="Available">Available</option>
          <option value="Sold">Sold</option>
        </select>

        <input
          type="text"
          name="seller"
          placeholder="Seller ID / Name"
          value={formData.seller}
          onChange={handleChange}
        />

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Saving..." : "Save Product"}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
