import { useState, useMemo } from "react";
import AppRoutes from "./routes/Indexroutes.jsx";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { Toaster } from "react-hot-toast";
import Footer from "./components/layouts/Footer.jsx";
import { getCustomTheme } from "./styles/theme/customTheme.jsx";
import { globalStyles } from "./styles/theme/globalStyles.jsx";
import FloatingChat from "./components/home/Chatbot.jsx";
import { getItem, setItem } from "./utils/localStorageHelper";
import LiquidEther from "./styles/liquid-ether/LiquidEther.jsx";
import WelcomeScreen from "./styles/welcome-screen/WelcomeScreen.jsx";
import BannerPromocional from "./components/common/BannerPromocional.jsx";

function App() {
  const [modoOscuro, setModoOscuro] = useState(() => {
    return getItem("modoOscuro", false); // Retorna boolean directamente
  });

  const [backgroundEnabled, setBackgroundEnabled] = useState(() => {
    return getItem("backgroundEnabled", false); // Default false
  });

  const theme = useMemo(() => getCustomTheme(modoOscuro), [modoOscuro]);

  const toggleModo = () => {
    setModoOscuro((prev) => {
      const nuevoModo = !prev;
      setItem("modoOscuro", nuevoModo); // Guarda boolean directamente
      return nuevoModo;
    });
  };

  const toggleBackground = () => {
    setBackgroundEnabled((prev) => {
      const newState = !prev;
      setItem("backgroundEnabled", newState);
      return newState;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BannerPromocional />
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
      {/* Background animado - posición absoluta (Solo en Modo Oscuro) */}
      {backgroundEnabled && modoOscuro && (
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
      )}
      <WelcomeScreen />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <AppRoutes
            modoOscuro={modoOscuro}
            toggleModo={toggleModo}
            backgroundEnabled={backgroundEnabled}
            toggleBackground={toggleBackground}
          />
        </Box>
        <FloatingChat />
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;
