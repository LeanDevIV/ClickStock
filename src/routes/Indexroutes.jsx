import { Routes, Route } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import Home from "../pages/Home";
import Products from "../pages/Products";
import Error404 from "../pages/Error404";
import AboutUs from "../pages/AboutUs";
import Contact from "../pages/Contact";
import AdminProductos from "../pages/AdminProductos";
import ProductDetail from "../pages/ProductDetail";

function IndexRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminProductos />} />
        <Route path="/Productos" element={<Products />} />
        <Route path="/Acerca" element={<AboutUs />} />
        <Route path="/Contacto" element={<Contact />} />
        <Route path="/Producto/detalle" element={<ProductDetail />} />
      </Route>
      <Route path="*" element={<Error404 />} />

      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}

export default IndexRoutes;
