import { createTheme } from "@mui/material/styles";

export const getCustomTheme = (modoOscuro) =>
  createTheme({
    palette: {
      mode: modoOscuro ? "dark" : "light",
      primary: {
        main: "#D4AF37",
        light: "#E6C869",
        dark: "#B8941F",
        contrastText: "#000000",
      },
      secondary: {
        main: "#B91C1C",
        light: "#D33434",
        dark: "#8B0000",
        contrastText: "#FFFFFF",
      },
      background: {
        default: modoOscuro ? "#121212" : "#F5F5F5",
        paper: modoOscuro ? "#1E1E1E" : "#FFFFFF",
      },
      text: {
        primary: modoOscuro ? "#FFFFFF" : "#000000",
        secondary: modoOscuro ? "#D4AF37" : "#404040",
      },

      success: {
        main: "#22C55E",
      },
      error: {
        main: "#EF4444",
      },
      warning: {
        main: "#F59E0B",
      },
      info: {
        main: "#3B82F6",
      },
    },
    typography: {
      fontFamily: "'Exo 2', sans-serif", // Fuente por defecto para el cuerpo
      h1: { fontFamily: "'Orbitron', sans-serif" },
      h2: { fontFamily: "'Orbitron', sans-serif" },
      h3: { fontFamily: "'Orbitron', sans-serif" },
      h4: { fontFamily: "'Orbitron', sans-serif" },
      h5: { fontFamily: "'Orbitron', sans-serif" },
      h6: { fontFamily: "'Orbitron', sans-serif" },
      button: { fontFamily: "'Exo 2', sans-serif", fontWeight: 600 },
    },
  });
