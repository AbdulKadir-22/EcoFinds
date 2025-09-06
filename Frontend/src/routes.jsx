import { Routes, Route } from "react-router-dom";
import Registration from "./pages/Registration";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import ProductPage from "./pages/ProductPage";
import ProfilePage from "./pages/ProfilePage";
import ProductForm from "./pages/ProductForm"; // New profile page

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
      
      {/* Profile (current logged-in user) */}
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
};

export default AppRoutes;
