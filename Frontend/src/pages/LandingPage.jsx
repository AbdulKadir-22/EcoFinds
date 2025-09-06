import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import "../styles/LandingPage.css";
import herobanner from "../assets/herobanner.png";
import Header from "../components/Header";

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

  // Filter products by category + search
  const filteredProducts = products.filter((p) => {
    const productCategory = p.category?.name || p.category;
    const matchCategory = selectedCategory
      ? productCategory === selectedCategory
      : true;
    const matchSearch = search
      ? p.title.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchCategory && matchSearch;
  });

  return (
    <div className="landing">
      <Header />

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
                  p.images && p.images.length > 0
                    ? p.images[0]
                    : "https://placehold.co/300x200/EFEFEF/3A3A3A?text=No+Image"
                }
                alt={p.title}
              />
              <h3>{p.title}</h3>
              <p className="description">
                {p.description?.slice(0, 60)}...
              </p>
              <p className="price">₹{p.price}</p>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </section>
    </div>
  );
}
