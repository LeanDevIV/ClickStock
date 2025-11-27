import { GlobalStyles } from "@mui/material";

export const globalStyles = (theme, modoOscuro) => (
  <GlobalStyles
    styles={{
      body: {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        transition: "background-color 0.3s ease, color 0.3s ease",
      },
      a: {
        color: theme.palette.primary.main,
        textDecoration: "none",
      },
      "a:hover": {
        color: theme.palette.secondary.main,
      },
      ".navbar, .card, .modal-content": {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
      },
      "input, textarea, select": {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderColor: theme.palette.text.secondary,
      },
      "input::placeholder, textarea::placeholder": {
        color: modoOscuro ? "#aaaaaa" : "#555555",
      },
    }}
  />
);
