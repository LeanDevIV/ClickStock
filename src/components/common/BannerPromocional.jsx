import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, Slide } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const mensajes = [
  "🚚 Envíos gratis a todo el país por compras mayores a $20.000",
  "🔥 15% de descuento en productos seleccionados esta semana",
  "🛒 ¡No olvides revisar tu carrito antes de irte!",
];

function BannerPromocional() {
  const [visible, setVisible] = useState(false);
  const [indice, setIndice] = useState(0);
  const [cerrado, setCerrado] = useState(false);

  useEffect(() => {
    const bannerCerrado = localStorage.getItem("bannerCerrado");
    if (!bannerCerrado) setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const intervalo = setInterval(() => {
      setIndice((prev) => (prev + 1) % mensajes.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, [visible]);

  const handleCerrar = () => {
    setCerrado(true);
    localStorage.setItem("bannerCerrado", "true");
    setTimeout(() => setVisible(false), 500);
  };

  if (!visible) return null;

  return (
    <Slide direction="right" in={!cerrado} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          left: 24,
          zIndex: 1300,
          bgcolor: "background.paper",
          color: "text.primary",
          boxShadow: 6,
          borderRadius: 50,
          px: 3,
          py: 1,
          display: "flex",
          alignItems: "center",
          gap: 2,
          border: "1px solid",
          borderColor: "divider",
          maxWidth: "90%",
          width: "auto",
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, fontSize: "0.9rem" }}
        >
          {mensajes[indice]}
        </Typography>
        <IconButton
          onClick={handleCerrar}
          size="small"
          sx={{
            color: "text.secondary",
            p: 0.5,
            ml: 1,
            "&:hover": { color: "error.main" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    </Slide>
  );
}

export default BannerPromocional;
