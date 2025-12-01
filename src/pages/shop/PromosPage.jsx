import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Paper,
  useTheme,
  alpha,
  Button,
} from "@mui/material";
import { usePromocionStore } from "../../hooks/usePromocionStore";
import PromocionCard from "../../components/promotions/PromocionCard";
import ProductCard from "../../components/products/ProductCard";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { usePageTitle } from "../../hooks/usePageTitle";

const PromosPage = () => {
  usePageTitle("Promociones");

  const theme = useTheme();
  const { obtenerPromocionesActivas } = usePromocionStore();
  const [promociones, setPromociones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promocionSeleccionada, setPromocionSeleccionada] = useState(null);

  useEffect(() => {
    const cargarPromociones = async () => {
      try {
        setLoading(true);
        const data = await obtenerPromocionesActivas();
        setPromociones(data);
      } catch (error) {
        console.error("Error al cargar promociones:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarPromociones();
  }, [obtenerPromocionesActivas]);

  const handleVerProductos = (promocion) => {
    setPromocionSeleccionada(promocion);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleVolverPromociones = () => {
    setPromocionSeleccionada(null);
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (promocionSeleccionada) {
    return (
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          py: { xs: 4, md: 6 },
          background: `linear-gradient(180deg, ${alpha(
            theme.palette.primary.main,
            0.03
          )} 0%, ${theme.palette.background.default} 100%)`,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleVolverPromociones}
              sx={{ mb: 3 }}
            >
              Volver a promociones
            </Button>

            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                color: "white",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  bgcolor: "rgba(255,255,255,0.25)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Typography variant="h6" fontWeight={800}>
                  {promocionSeleccionada.descuento}% OFF
                </Typography>
              </Box>

              <Typography
                variant="h4"
                fontWeight={800}
                fontFamily="Orbitron, sans-serif"
                gutterBottom
              >
                {promocionSeleccionada.titulo}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.95 }}>
                {promocionSeleccionada.descripcion}
              </Typography>
            </Box>
          </Box>

          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            {promocionSeleccionada.productos.length}{" "}
            {promocionSeleccionada.productos.length === 1
              ? "Producto"
              : "Productos"}{" "}
            en oferta
          </Typography>

          <Grid container spacing={3}>
            {promocionSeleccionada.productos.map((producto) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={producto._id}>
                <ProductCard
                  producto={producto}
                  promociones={[promocionSeleccionada]}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        py: { xs: 4, md: 6 },
        background: `linear-gradient(180deg, ${alpha(
          theme.palette.primary.main,
          0.03
        )} 0%, ${theme.palette.background.default} 100%)`,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
              px: 3,
              py: 1.5,
              borderRadius: 50,
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.1
              )} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <LocalOfferIcon
              sx={{
                color: theme.palette.primary.main,
                fontSize: { xs: 28, md: 32 },
              }}
            />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontFamily: "Orbitron, sans-serif",
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              Promociones Activas
            </Typography>
          </Box>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto", fontWeight: 400 }}
          >
            Aprovechá las mejores ofertas disponibles ahora
          </Typography>
        </Box>

        {promociones.length > 0 ? (
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
                <Box sx={{ width: "100%" }}>
                  <PromocionCard
                    promocion={promocion}
                    onVerProductos={handleVerProductos}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              background: alpha(theme.palette.background.paper, 0.6),
              backdropFilter: "blur(10px)",
            }}
          >
            <SentimentDissatisfiedIcon
              sx={{
                fontSize: 80,
                color: theme.palette.text.disabled,
                mb: 2,
              }}
            />
            <Typography variant="h5" gutterBottom fontWeight={700}>
              No hay promociones activas
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Por el momento no tenemos ofertas disponibles. ¡Volvé pronto para
              descubrir nuevas promociones!
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default PromosPage;
