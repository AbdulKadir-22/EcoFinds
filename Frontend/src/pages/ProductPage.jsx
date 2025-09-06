import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axios"; // ✅ use axiosInstance everywhere
import "../styles/ProductPage.css";
import Header from "../components/Header";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Fetch product details
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await axiosInstance.get(`/products/${id}`);
        const data = res.data;

        setProduct(data);
        setMainImage(
          data.images?.[0] ||
            "https://placehold.co/600x400/EFEFEF/3A3A3A?text=No+Image"
        );
      } catch (err) {
        console.error("Product fetch error:", err);
        setError(err.response?.data?.message || "❌ Failed to load product.");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  // ✅ Handle Add to Cart
  const handleAddToCart = async () => {
    if (!product?._id) return;
    setAdding(true);
    setMessage("");
    try {
      await axiosInstance.post("/cart", { productId: product._id });
      setMessage("✅ Added to cart!");
    } catch (err) {
      console.error("Cart error:", err);
      setMessage(err.response?.data?.error || "⚠ Failed to add product to cart.");
    } finally {
      setAdding(false);
    }
  };

  // ✅ Wishlist toggle
  const toggleWishlist = () => {
    setWishlisted((prev) => !prev);
  };

  if (loading) return <p className="loading">⏳ Loading product...</p>;
  if (error) return <p className="error">⚠ {error}</p>;
  if (!product) return <p className="error">No product found.</p>;

  return (
    <div className="product-page">
      <Header />

      <div className="product-content">
        {/* Gallery */}
        <div className="product-gallery">
          <img src={mainImage} alt={product.title} className="main-image" />
          {product.images?.length > 0 && (
            <div className="thumbnail-row">
              {product.images.map((thumb, i) => (
                <img
                  key={i}
                  src={thumb}
                  alt={`Thumbnail ${i}`}
                  className={`thumbnail ${mainImage === thumb ? "active" : ""}`}
                  onClick={() => setMainImage(thumb)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="product-details">
          <h3 className="breadcrumbs">
            {product.category?.name || "Uncategorized"}
          </h3>
          <h1 className="title">{product.title}</h1>
          <p className="price">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(product.price)}
          </p>
          <p className="status">
            Status:{" "}
            <strong
              className={product.status === "Available" ? "available" : "sold"}
            >
              {product.status}
            </strong>
          </p>

          {/* Seller Info */}
          <div className="seller-info">
            {product.seller?.profileImage ? (
              <img
                src={product.seller.profileImage}
                alt={product.seller.username}
                className="seller-img"
              />
            ) : (
              <div className="seller-placeholder">
                {product.seller?.username?.[0]?.toUpperCase() || "?"}
              </div>
            )}
            <div>
              <p className="seller-name">{product.seller?.username}</p>
              <p className="seller-id">{product.seller?.email}</p>
            </div>
          </div>

          {/* Description */}
          <div className="description">
            <h4>Product Description</h4>
            <p>{product.description}</p>
          </div>

          {/* Actions */}
          <div className="actions">
            <button
              className={`wishlist-btn ${wishlisted ? "active" : ""}`}
              onClick={toggleWishlist}
            >
              {wishlisted ? "♥ Wishlisted" : "♡ Add to Wishlist"}
            </button>
            <button
              className="cart-btn"
              onClick={handleAddToCart}
              disabled={adding}
            >
              {adding ? "Adding..." : "🛒 Add to Cart"}
            </button>
          </div>

          {/* Feedback */}
          {message && <p className="cart-message">{message}</p>}
        </div>
      </div>
    </div>
  );
}
