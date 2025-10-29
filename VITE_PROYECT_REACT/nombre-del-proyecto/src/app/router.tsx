import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import Home from "../pages/Home/Home";
import Products from "../pages/Products/Products";
import ProductDetail from "../pages/Products/ProductDetail";
import AboutUs from "../pages/About/About";
import Blog from "../pages/Blog/Blog";
import Contact from "../pages/Contact/Contact";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Cart from "../pages/Cart/Cart";
// import NotFound from "../pages/NotFound/NotFound"; // si tienes

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // layout
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <Products /> },
      { path: "products/:id", element: <ProductDetail /> },
      { path: "aboutus", element: <AboutUs /> },
      { path: "blog", element: <Blog /> },
      { path: "contact", element: <Contact /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "cart", element: <Cart /> },
      // { path: "*", element: <NotFound /> },
    ],
  },
]);
