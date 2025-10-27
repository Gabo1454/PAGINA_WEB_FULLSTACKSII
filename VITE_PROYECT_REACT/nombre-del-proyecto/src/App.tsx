// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import ProductsIndex from "./pages/Products/ProductsIndex";
import ProductDetail from "./pages/Products/ProductDetail";

export default function App() {
  return (
    <Router>
      <div className="appShell">
        <Header />
        <main id="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductsIndex />} />
            <Route path="/products/:id" element={<ProductDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
