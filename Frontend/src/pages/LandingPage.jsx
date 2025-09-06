import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import "../styles/LandingPage.css";
import herobanner from "../assets/herobanner.png";
import logo from "../assets/logo.png";

export default function LandingPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch categories & products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axiosInstance.get("/categories"),
          axiosInstance.get("/products"),
        ]);
        setCategories(catRes.data || []);
        setProducts(prodRes.data || []);
      } catch (err) {
        console.error("Landing fetch error:", err);
        setError("⚠️ Failed to load categories or products.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedCategory
      ? p.category === selectedCategory
      : true;
    const matchSearch = search
      ? p.title.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchCategory && matchSearch;
  });

  return (
    <div className="landing">
      {/* ---------------- HEADER ---------------- */}
      <header className="header">
        <div className="header-top">
          <div className="logo">
            <img src={logo} alt="EcoFinds" className="logo-img" />
            <span className="logo-text">
              Eco<span className="highlight">Finds</span>
            </span>
          </div>
          <div className="icons">
            <NavLink to="/cart" className="icon" title="Cart">
              🛒
            </NavLink>
            <NavLink to="/profile" className="icon" title="Profile">
              👤
            </NavLink>
          </div>
        </div>
        <input
          type="text"
          placeholder="Search products..."
          className="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>

      {/* ---------------- HERO ---------------- */}
      <section className="hero">
        <img src={herobanner} alt="hero banner" className="hero-img" />
      </section>

      {/* ---------------- CATEGORIES ---------------- */}
      <section className="categories">
        <h2>Categories</h2>
        {loading ? (
          <p>Loading categories...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="category-list">
            <span
              className={`category ${!selectedCategory ? "active" : ""}`}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </span>
            {categories.map((c) => (
              <span
                key={c._id}
                className={`category ${
                  selectedCategory === c.name ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(c.name)}
              >
                {c.name}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* ---------------- PRODUCTS ---------------- */}
      <section className="products">
        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <div
              className="card"
              key={p._id}
              onClick={() => navigate(`/products/${p._id}`)}
            >
              <img
                src={
                  p.image ||
                  "https://i.pinimg.com/736x/34/58/f5/3458f51c93268fe04ede2e3229fb1202.jpg"
                }
                alt={p.title}
              />
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <p className="price">${p.price}</p>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </section>
    </div>
  );
}
