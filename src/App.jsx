import { useState, useMemo } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import AppRoutes from "./routes/Indexroutes.jsx";
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
      <AppRoutes modoOscuro={modoOscuro} toggleModo={toggleModo} />
      <ProductosRender />
      <Footer />
    </ThemeProvider>
  );
}

export default App;
