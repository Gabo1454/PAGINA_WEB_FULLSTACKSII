// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";
import Home from "../pages/Home/Home";
import ProductsIndex from "../pages/Products/Products";
import ProductDetail from "../pages/Products/ProductDetail";
import AboutUs from "../pages/About/About";
import Blog from "../pages/Blog/Blog";
import Contact from "../pages/Contact/Contact";

import { useAuth } from "../context/AuthContext";
import { AuthProvider } from "../context/AuthContext";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Cart from "../pages/Cart/Cart";
import UserProfilePage from "../pages/UserProfilePage/UserProfilePage";
import AdminDashboardPage from "../pages/Admin/AdminDashboardPage";

// ✅ NUEVAS IMPORTACIONES Checkout y Payment succes/failed
import Checkout from "../pages/Checkout/Checkout";
import PaymentSuccess from "../pages/PaymentSuccess/PaymentSuccess";
import PaymentFailed from "../pages/PaymentFailed/PaymentFailed";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="appShell">
          <Header />
          <main id="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductsIndex />} />
              <Route path="/products/:id" element={<ProductDetail />} />

              {/* Rutas de autenticación */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* NUEVAS RUTAS - Checkout */}
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-failed" element={<PaymentFailed />} />

              {/* Otras rutas */}
              <Route path="/aboutus" element={<AboutUs />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
