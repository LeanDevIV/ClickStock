import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Products from "../pages/Products";
import Admin from "../pages/Admin";
import Error404 from "../pages/Error404";
import Aboutus from "../pages/Aboutus";
import Contact from "../pages/Contact";
import PedidosTabla from "../components/admin/tablaPedidos";

function IndexRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Productos" element={<Products />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/Acerca" element={<Aboutus />} />
        <Route path="/Contacto" element={<Contact />} />
        <Route path="/pedidos" element={<PedidosTabla />} />
      </Route>
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}

export default IndexRoutes;
