import { Routes, Route } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import Home from "../pages/Home";
import Error404 from "../pages/Error404";
import AboutUs from "../pages/AboutUs";
import Contact from "../pages/Contact";
import AdminProductos from "../pages/AdminProductos";
import ProductDetail from "../pages/ProductDetail";
import AdminUsuarios from "../pages/AdminUsuarios";
import AdminLayout from "../layouts/AdminLayout";
import TablaPedidos from "../pages/admin/tablaPedidos";
import ScrollToTop from "../components/ScrollToTop.jsx";
import ProductList from "../pages/ProductList"; // ✅ Importamos la página de productos
import PromocionesForm from "../pages/PromocionesForm.jsx";
import { AdminDashboard } from "../pages/admin/AdminDashboard.jsx";
import CarritoPage from "../pages/CarritoPage.jsx";
import SearchResults from "../pages/SearchResults.jsx";

function IndexRoutes({
  modoOscuro,
  toggleModo,
  backgroundEnabled,
  toggleBackground,
}) {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Layout público */}
        <Route
          element={
            <MainLayout
              modoOscuro={modoOscuro}
              toggleModo={toggleModo}
              backgroundEnabled={backgroundEnabled}
              toggleBackground={toggleBackground}
            />
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/carrito" element={<CarritoPage />} />
          <Route path="/Acerca" element={<AboutUs />} />
          <Route path="/Contacto" element={<Contact />} />
          <Route path="/productos" element={<ProductList />} />
          <Route path="/buscar" element={<SearchResults />} />
          <Route path="/promocion" element={<PromocionesForm />} />
          {/* ✅ Página de productos */}
          <Route path="/producto/detalle/:id" element={<ProductDetail />} />
          {/* ✅ Dinámica */}
          {/* Layout administrativo */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />

            <Route path="productos" element={<AdminProductos />} />
            <Route path="pedidos" element={<TablaPedidos />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
          </Route>
        </Route>

        {/* Página 404 */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
}

export default IndexRoutes;
