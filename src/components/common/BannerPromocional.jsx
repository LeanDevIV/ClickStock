import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, Slide } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { usePromocionStore } from "../../hooks/usePromocionStore";
import { formatearDescuento } from "../../utils/promocionUtils";

function BannerPromocional() {
  const navigate = useNavigate();
  const { obtenerPromocionesActivas } = usePromocionStore();
  const [visible, setVisible] = useState(false);
  const [indice, setIndice] = useState(0);
  const [cerrado, setCerrado] = useState(false);
  const [promociones, setPromociones] = useState([]);

  useEffect(() => {
    const bannerCerrado = localStorage.getItem("bannerCerrado");
    if (!bannerCerrado) setVisible(true);
  }, []);

  useEffect(() => {
    const cargarPromociones = async () => {
      try {
        const data = await obtenerPromocionesActivas();
        setPromociones(data);
      } catch (error) {
        console.error("Error al cargar promociones:", error);
      }
    };

    if (visible) {
      cargarPromociones();
    }
  }, [visible, obtenerPromocionesActivas]);

  useEffect(() => {
    if (!visible || promociones.length === 0) return;
    const intervalo = setInterval(() => {
      setIndice((prev) => (prev + 1) % promociones.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, [visible, promociones.length]);

  const handleCerrar = () => {
    setCerrado(true);
    localStorage.setItem("bannerCerrado", "true");
    setTimeout(() => setVisible(false), 500);
  };

  const handleClick = () => {
    navigate("/promos");
  };

  if (!visible || promociones.length === 0) return null;

  const promocionActual = promociones[indice];

  return (
    <Slide direction="right" in={!cerrado} mountOnEnter unmountOnExit>
      <Box
        onClick={handleClick}
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
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateX(4px)",
            boxShadow: 8,
          },
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, fontSize: "0.9rem" }}
        >
          🔥 {promocionActual.titulo} -{" "}
          {formatearDescuento(promocionActual.descuento)}
        </Typography>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handleCerrar();
          }}
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
