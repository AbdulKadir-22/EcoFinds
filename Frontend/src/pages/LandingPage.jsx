import "../styles/LandingPage.css";
import herobanner from "../assets/herobanner.png"; // your hero bg
import productImg from "../assets/heroproducts.jpg"; // example product
import logo from "../assets/logo.png";

export default function LandingPage() {
  const categories = ["category 1", "category 2", "category 3", "category 4"];
  const products = Array(12).fill({
    title: "Sprac Rone",
    desc: "Steconly hind gradr droods",
    price: "$14A340",
    img: productImg,
  });

  return (
    <div className="landing">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <img src={logo} alt="EcoFinds Logo" className="logo-img" />
          <span className="logo-text">
            Eco<span className="highlight">Finds</span>
          </span>
        </div>
        <input type="text" placeholder="Search" className="search" />
        <div className="icons">
          <span role="img" aria-label="cart" className="icon">
            🛒
          </span>
          <span role="img" aria-label="profile" className="icon">
            👤
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <img src={herobanner} alt="hero banner" className="hero-img" />
      </section>

      {/* Categories */}
      <section className="categories">
        <h2>Categories</h2>
        <div className="category-list">
          {categories.map((c, i) => (
            <span
              key={i}
              className={`category ${i === 0 ? "active" : ""}`} // first active
            >
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section className="products">
        {products.map((p, i) => (
          <div className="card" key={i}>
            <img src={p.img} alt={p.title} />
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
            <p className="price">{p.price}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
