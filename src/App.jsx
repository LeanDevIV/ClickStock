import { useState, useMemo } from "react";
import AppRoutes from "./routes/Indexroutes.jsx";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer.jsx";
import ProductosRender from "./components/ProductosRender.jsx";
import { getCustomTheme } from "./styles/customTheme";
import { globalStyles } from "./styles/globalStyles";
import FloatingChat from "./components/Chatbot.jsx";
import { getItem, setItem } from "./utils/localStorageHelper";

function App() {
  const [modoOscuro, setModoOscuro] = useState(() => {
    return getItem("modoOscuro", false); // Retorna boolean directamente
  });

  const theme = useMemo(() => getCustomTheme(modoOscuro), [modoOscuro]);

  const toggleModo = () => {
    setModoOscuro((prev) => {
      const nuevoModo = !prev;
      setItem("modoOscuro", nuevoModo); // Guarda boolean directamente
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
      <Footer />
    </ThemeProvider>
  );
}

export default App;
