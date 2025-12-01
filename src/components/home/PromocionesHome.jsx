import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  useTheme,
  alpha,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { usePromocionStore } from "../../hooks/usePromocionStore";
import PromocionCard from "../promotions/PromocionCard";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const PromocionesHome = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { obtenerPromocionesActivas } = usePromocionStore();
  const [promociones, setPromociones] = useState([]);

  useEffect(() => {
    const cargarPromociones = async () => {
      try {
        const data = await obtenerPromocionesActivas();
        setPromociones(data.slice(0, 3)); // Máximo 3 para home
      } catch (error) {
        console.error("Error al cargar promociones:", error);
      }
    };

    cargarPromociones();
  }, [obtenerPromocionesActivas]);

  // No mostrar nada si no hay promociones
  if (promociones.length === 0) return null;

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(180deg, ${
          theme.palette.background.default
        } 0%, ${alpha(theme.palette.primary.main, 0.02)} 50%, ${
          theme.palette.background.default
        } 100%)`,
      }}
    >
      <Container maxWidth="lg">
        {/* Header de sección */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                boxShadow: `0 4px 12px ${alpha(
                  theme.palette.primary.main,
                  0.3
                )}`,
              }}
            >
              <LocalOfferIcon sx={{ color: "white", fontSize: 28 }} />
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  fontFamily: "Orbitron, sans-serif",
                  mb: 0.5,
                }}
              >
                Ofertas del Momento
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aprovechá estas promociones por tiempo limitado
              </Typography>
            </Box>
          </Box>

          <Button
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate("/promos")}
            sx={{
              borderRadius: 50,
              px: 3,
              py: 1,
              fontWeight: 700,
              borderWidth: 2,
              textTransform: "none",
              "&:hover": {
                borderWidth: 2,
                background: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            Ver todas las promociones
          </Button>
        </Box>

        {/* Grid de promociones */}
        <Grid container spacing={3} justifyContent="center">
          {promociones.map((promocion) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={promocion._id}
              sx={{
                display: "flex",
                maxWidth: { xs: "100%", sm: "50%", md: "400px" },
              }}
            >
              <Box sx={{ width: "100%", height: "100%" }}>
                <PromocionCard
                  promocion={promocion}
                  onVerProductos={() => navigate("/promos")}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default PromocionesHome;
