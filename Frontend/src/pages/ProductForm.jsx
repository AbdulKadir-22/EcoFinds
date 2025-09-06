import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import "../styles/ProductForm.css";
import Header from "../components/Header";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
    status: "Available",
    seller: "",
    images: [],
  });

  const [newImageUrl, setNewImageUrl] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ Fetch categories
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

  // ✅ Generic input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Add image URL
  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImageUrl],
      }));
      setNewImageUrl("");
    }
  };

  // ✅ Remove image
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // ✅ Submit
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

      setSuccess("✅ Product saved successfully!");
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
      setError(err.response?.data?.error || "❌ Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header/>
      <div className="product-form-container">
        <form className="product-details" onSubmit={handleSubmit}>
          <h2 className="section-title">Add / Edit Product</h2>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          {/* Title */}
          <input
            type="text"
            name="title"
            placeholder="Product Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          {/* Images */}
          <div className="image-url-box">
            <div className="image-input-row">
              <input
                type="text"
                placeholder="Enter Image URL"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
              />
              <button
                type="button"
                className="add-image-btn"
                onClick={handleAddImage}
                disabled={!newImageUrl.trim()}
              >
                ➕ Add
              </button>
            </div>

            <div className="image-preview-grid">
              {formData.images.map((url, idx) => (
                <div key={idx} className="preview-item">
                  <img src={url} alt={`Preview ${idx}`} />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="remove-img-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Category */}
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

          {/* Description */}
          <textarea
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          {/* Price & Quantity */}
          <div className="form-row">
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
          </div>

          {/* Status */}
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Available">Available</option>
            <option value="Sold">Sold</option>
          </select>

          {/* Seller */}
          <input
            type="text"
            name="seller"
            placeholder="Seller ID / Name"
            value={formData.seller}
            onChange={handleChange}
          />

          {/* Submit */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "⏳ Saving..." : "💾 Save Product"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ProductForm;
