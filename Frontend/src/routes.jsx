import { Routes, Route } from "react-router-dom";
import Registration from "./pages/Registration";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import ProductPage from "./pages/ProductPage";
import ProfilePage from "./pages/ProfilePage";
import ProductForm from "./pages/ProductForm";
import CartPage from "./pages/CartPage" // New profile page

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/" element={<Registration />} />
      <Route path="/login" element={<Login />} />

      {/* Main pages */}
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/products/:id" element={<ProductPage />} />
      <Route path="/products/new" element={<ProductForm />} />
      <Route path="/cart" element={<CartPage />} />
      {/* Profile (current logged-in user) */}
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
};

export default AppRoutes;
