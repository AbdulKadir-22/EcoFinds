import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/ProductPage.css";
import Header from "../components/Header";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        const data = res.data;

        setProduct(data);
        // pick first image or fallback
        setMainImage(
          data.images?.[0] ||
            "https://placehold.co/600x400/EFEFEF/3A3A3A?text=No+Image"
        );
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) return <p className="loading">Loading product...</p>;
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
          <h3 className="breadcrumbs">{product.category?.name}</h3>
          <h1 className="title">{product.title}</h1>
          <p className="price">${product.price}</p>
          <p className="status">
            Status: <strong>{product.status}</strong>
          </p>

          <div className="seller-info">
            <img
              src={product.seller?.profileImage}
              alt={product.seller?.username}
              className="seller-img"
            />
            <div>
              <p className="seller-name">{product.seller?.username}</p>
              <p className="seller-id">{product.seller?.email}</p>
            </div>
          </div>

          <div className="description">
            <h4>Product Description</h4>
            <p>{product.description}</p>
          </div>

          <div className="actions">
            <button className="wishlist-btn">♡ Add to Wishlist</button>
            <button className="cart-btn">🛒 Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}
