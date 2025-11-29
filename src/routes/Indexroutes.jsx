import { Routes, Route } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import Home from "../pages/home/Home.jsx";
import Error404 from "../pages/legal/Error404.jsx";
import AboutUs from "../pages/legal/AboutUs.jsx";
import Contact from "../pages/legal/Contact.jsx";
import ProductDetail from "../pages/shop/ProductDetail.jsx";
import AdminLayout from "../layouts/AdminLayout";
import PedidosPage from "../pages/admin/PedidosPage.jsx";
import ScrollToTop from "../components/layouts/ScrollToTop.jsx";
import ProductList from "../pages/shop/ProductList.jsx";
import PromocionesPage from "../pages/admin/PromocionesPage.jsx";
import { AdminDashboard } from "../pages/admin/AdminDashboard.jsx";
import CarritoPage from "../pages/checkout/CarritoPage.jsx";
import SearchResults from "../pages/shop/SearchResults.jsx";
import AdminHome from "../pages/admin/AdminHome.jsx";
import FavoritosPage from "../pages/user/FavoritosPage.jsx";
import MisPedidos from "../pages/user/MisPedidos.jsx";

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
          <Route path="/nosotros" element={<AboutUs />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/productos" element={<ProductList />} />
          <Route path="/buscar" element={<SearchResults />} />
          <Route path="/favoritos" element={<FavoritosPage />} />
          <Route path="/mis-pedidos" element={<MisPedidos />} />

          {/* ✅ Página de productos */}
          <Route path="/producto/detalle/:id" element={<ProductDetail />} />
          {/* ✅ Dinámica */}
          {/* Layout administrativo */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="pedidos" element={<PedidosPage />} />
            <Route path="promociones" element={<PromocionesPage />} />
          </Route>
        </Route>

        {/* Página 404 */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
}

export default IndexRoutes;
