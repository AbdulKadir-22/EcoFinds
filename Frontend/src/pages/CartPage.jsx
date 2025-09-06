import { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import Header from "../components/Header";
import "../styles/Cart.css";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch Cart
  useEffect(() => {
    async function fetchCart() {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("⚠ Please login to view your cart.");
          setLoading(false);
          return;
        }

        const res = await axiosInstance.get("/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCart(res.data || []);
      } catch (err) {
        console.error("Cart fetch error:", err);
        setError(err.response?.data?.error || "⚠ Failed to load cart.");
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, []);

  // ✅ Handle Quantity Change
  const handleQuantityChange = async (productId, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === productId
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) }
          : item
      )
    );

    try {
      const token = localStorage.getItem("authToken");
      await axiosInstance.put(
        `/cart/${productId}`,
        { delta },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  // ✅ Remove Item
  const handleRemove = async (productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));

    try {
      const token = localStorage.getItem("authToken");
      await axiosInstance.delete(`/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Failed to remove product:", err);
    }
  };

  // ✅ Summary Calculations
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const tax = subtotal * 0.1; // Example: 10% tax
  const total = subtotal + tax;

  if (loading) return <p className="loading">⏳ Loading your cart...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="cart-container">
      <Header />

      <div className="cart-header">
        <h1 className="cart-title">🛒 Your Shopping Cart</h1>
      </div>

      {cart.length === 0 ? (
        <p className="empty-cart">🛍 Your cart is empty. Start shopping!</p>
      ) : (
        <div className="cart-content">
          {/* ✅ Product List */}
          <div className="product-list">
            {cart.map((product) => (
              <div className="product-card" key={product._id}>
                <img
                  src={
                    product.images?.[0] ||
                    "https://placehold.co/100x100/EFEFEF/3A3A3A?text=No+Image"
                  }
                  alt={product.title}
                  className="product-img"
                />

                <div className="product-info">
                  <h3>{product.title}</h3>
                  <p className="price">${product.price}</p>
                  <p className="color">
                    Seller: {product.seller?.username || "Unknown"}
                  </p>

                  {/* ✅ Quantity Controls */}
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(product._id, -1)}
                    >
                      -
                    </button>
                    <span>{product.quantity || 1}</span>
                    <button
                      onClick={() => handleQuantityChange(product._id, 1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(product._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Summary Box */}
          <div className="summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}
