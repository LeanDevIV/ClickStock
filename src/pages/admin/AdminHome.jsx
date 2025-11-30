import React from "react";
import { Box, Container, Card, Typography } from "@mui/material";
import { LocalShipping, Dashboard, LocalOffer } from "@mui/icons-material";
import { styled, keyframes } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const neonBorder = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
`;

const NeonCard = styled(Card)(({ theme }) => ({
  height: "100%",
  minHeight: "200px",
  width: "100%",
  position: "relative",
  overflow: "visible",
  backgroundColor: "transparent",
  borderRadius: "16px",
  transition: "transform 0.3s ease",
  boxShadow: "none",
  cursor: "pointer",

  "&:hover": {
    transform: "translateY(-8px)",
    transition: "transform 0.3s ease",
  },

  "&::before": {
    content: '""',
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: "18px",
    background: `linear-gradient(
      90deg,
      transparent 0%,
      ${theme.palette.primary.main} 20%,
      ${theme.palette.error.main} 40%,
      ${theme.palette.warning.main} 60%,
      ${theme.palette.primary.main} 80%,
      transparent 100%
    )`,
    backgroundSize: "200% 100%",
    animation: `${neonBorder} 4s linear infinite`,
    zIndex: 0,
    opacity: 0.8,
  },
}));

const CardSurface = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  height: "100%",
  width: "100%",

  backgroundColor: theme.palette.mode === "dark" ? "#121212" : "#ffffff",
  borderRadius: "16px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(3),
  boxShadow: theme.shadows[4],
}));

const AdminHome = () => {
  const navigate = useNavigate();

  const adminOptions = [
    {
      icon: <LocalShipping sx={{ fontSize: 50 }} />,
      title: "Pedidos",
      description:
        "Gestiona los pedidos de los clientes, actualiza estados y revisa detalles.",
      path: "/admin/pedidos",
    },
    {
      icon: <Dashboard sx={{ fontSize: 50 }} />,
      title: "Dashboard",
      description:
        "Visualiza métricas clave, estadísticas de ventas y resumen general.",
      path: "/admin/dashboard",
    },
    {
      icon: <LocalOffer sx={{ fontSize: 50 }} />,
      title: "Promociones",
      description:
        "Crea y administra campañas promocionales y descuentos especiales.",
      path: "/admin/promociones",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Panel de Administración
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Selecciona una opción para comenzar a gestionar tu tienda
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(3, 1fr)",
          },
          gap: 4,
          width: "100%",
          alignItems: "stretch",
        }}
      >
        {adminOptions.map((option, index) => (
          <NeonCard key={index} onClick={() => navigate(option.path)}>
            <CardSurface>
              <Box
                sx={{
                  color: "primary.main",
                  mb: 2,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {option.icon}
              </Box>
              <Typography
                variant="h5"
                component="h3"
                gutterBottom
                fontWeight="bold"
                sx={{ mb: 1 }}
              >
                {option.title}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                sx={{ lineHeight: 1.5 }}
              >
                {option.description}
              </Typography>
            </CardSurface>
          </NeonCard>
        ))}
      </Box>
    </Container>
  );
};

export default AdminHome;
