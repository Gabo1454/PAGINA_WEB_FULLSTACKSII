// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import ProductsIndex from "./pages/Products/ProductsIndex";
import ProductDetail from "./pages/Products/ProductDetail";
import AboutUs from "./pages/AboutUs/AboutUs";
import Blog from "./pages/Blog/Blog";
import Contact from "./pages/Contact/Contact";
import { UserProvider } from "./pages/Register/UserContext";

export default function App() {
  return (
    <UserProvider>
      <Router>
        <div className="appShell">
          <Header />
          <main id="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductsIndex />} />
              <Route path="/products/:id" element={<ProductDetail />} />

              {/* Rutas limpias y consistentes */}
              <Route path="/aboutus" element={<AboutUs />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </UserProvider>
  );
}
