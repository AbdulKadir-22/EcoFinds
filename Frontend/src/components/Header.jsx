import "../styles/Header.css";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <div className="header-top">
        <div className="logo">
          <Link to="/landing" className="logo-link">
            <img src={logo} alt="EcoFinds" className="logo-img" />
            <span className="logo-text">
              Eco<span className="highlight">Finds</span>
            </span>
          </Link>
        </div>
      
        <div className="icons">
          <Link to="/cart" className="logo-link">
            <span role="img" aria-label="cart" className="icon">
             🛒
            </span>
          </Link>
          <Link to="/profile" className="logo-link">
            <span role="img" aria-label="profile" className="icon">
              👤
            </span>
          </Link>
        </div>
      </div>
      <input type="text" placeholder="Search" className="search" />
    </header>
  );
}

export default Header;
