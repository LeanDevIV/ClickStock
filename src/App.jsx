import React from "react";
import AppRoutes from "./routes/indexroutes.jsx";
import FloatingChat from "./components/FloatingChat.jsx";
=======
import { useState, useMemo } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/Indexroutes.jsx";
import Footer from "./components/Footer.jsx";
import ProductosRender from "./components/ProductosRender.jsx";
import { getCustomTheme } from "./styles/customTheme";
import { globalStyles } from "./styles/globalStyles";

>>>>>>> dev
function App() {
  return (
    <div>
      <AppRoutes />
      <FloatingChat />
      <Footer />
    </div>
  );
}

export default App;
