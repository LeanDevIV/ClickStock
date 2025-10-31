import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Products from "../pages/Products";
import Admin from "../pages/Admin";
import Error404 from "../pages/Error404";

function IndexRoutes() {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Products" element={<Products />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="*" element={<Error404 />} />
    </Routes>
  );
  }

export default IndexRoutes;