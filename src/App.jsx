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
import LiquidEther from "./styles/liquid-ether/LiquidEther.jsx";
import WelcomeScreen from "./components/WelcomeScreen";

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
      {/* Background animado - posición absoluta */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        <LiquidEther
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>
      <WelcomeScreen />
      <AppRoutes modoOscuro={modoOscuro} toggleModo={toggleModo} />
      <FloatingChat />
      <Footer />
    </ThemeProvider>
  );
}

export default App;
