import { createTheme } from "@mui/material/styles";

export const getCustomTheme = (modoOscuro) =>
  createTheme({
    palette: {
      mode: modoOscuro ? "dark" : "light",
      primary: {
        main: "#D4AF37", // Gold
        contrastText: "#000000",
      },
      secondary: {
        main: "#B91C1C", // Cornell Red
        contrastText: "#F5F5F5",
      },
      background: {
        default: modoOscuro ? "#000000" : "#F5F5F5", // Black / White smoke
        paper: modoOscuro ? "#404040" : "#ffffff", // Onyx / white
      },
      text: {
        primary: modoOscuro ? "#F5F5F5" : "#000000",
        secondary: modoOscuro ? "#D4AF37" : "#404040",
      },
    },
    typography: {
      fontFamily: "Poppins, sans-serif",
      fontWeightMedium: 600,
      button: {
        textTransform: "none",
      },
    },
    shape: {
      borderRadius: 10,
    },
  });
