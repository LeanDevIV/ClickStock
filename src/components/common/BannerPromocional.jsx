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

  // Verifica si el usuario ya cerró el banner
  useEffect(() => {
    const bannerCerrado = localStorage.getItem("bannerCerrado");
    if (!bannerCerrado) setVisible(true);
  }, []);

  // Rotación de banners cada 5 segundos
  useEffect(() => {
    if (!visible) return;
    const intervalo = setInterval(() => {
      setIndice((prev) => (prev + 1) % mensajes.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, [visible]);

  // Cerrar banner
  const handleCerrar = () => {
    setCerrado(true);
    localStorage.setItem("bannerCerrado", "true");
    setTimeout(() => setVisible(false), 500);
  };

  if (!visible) return null;

  return (
    <Slide direction="down" in={!cerrado} mountOnEnter unmountOnExit>
      <Box
        sx={{
          width: "100%",
          bgcolor: "primary.main",
          color: "white",
          textAlign: "center",
          p: 1.5,
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1300,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {mensajes[indice]}
        </Typography>
        <IconButton
          onClick={handleCerrar}
          sx={{ position: "absolute", right: 10, color: "white" }}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Slide>
  );
}

export default BannerPromocional;
