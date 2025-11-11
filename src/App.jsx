import React from "react";
import AppRoutes from "./routes/indexroutes.jsx";
import FloatingChat from "./components/Chatbot.jsx";
import { useState, useMemo } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer.jsx";
import ProductosRender from "./components/ProductosRender.jsx";
import { getCustomTheme } from "./styles/customTheme";
import { globalStyles } from "./styles/globalStyles";

function App() {
  const [modoOscuro, setModoOscuro] = useState(() => {
    return localStorage.getItem("modoOscuro") === "true";
  });

  const theme = useMemo(() => getCustomTheme(modoOscuro), [modoOscuro]);

  const toggleModo = () => {
    setModoOscuro((prev) => {
      const nuevoModo = !prev;
      localStorage.setItem("modoOscuro", nuevoModo);
      return nuevoModo;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {globalStyles(theme, modoOscuro)}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: modoOscuro ? "#333" : "#fff",
            color: modoOscuro ? "#fff" : "#333",
          },
          success: {
            iconTheme: {
              primary: "#4caf50",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#f44336",
              secondary: "#fff",
            },
          },
        }}
      />
      <AppRoutes modoOscuro={modoOscuro} toggleModo={toggleModo} />
      <FloatingChat />
      <ProductosRender />
      <Footer />
    </ThemeProvider>
  );
}

export default App;
