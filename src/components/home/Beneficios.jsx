import React from "react";
import { Box, Container, Card, Typography } from "@mui/material";
import {
  LocalShipping,
  VerifiedUser,
  CreditCard,
  LocalOffer,
} from "@mui/icons-material";
import { styled, keyframes } from "@mui/material/styles";

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
  padding: theme.spacing(2),
  boxShadow: theme.shadows[4],
}));

const BeneficiosHome = () => {
  const beneficios = [
    {
      icon: <LocalShipping sx={{ fontSize: 40 }} />,
      title: "Entrega Rápida",
      description: "Recibe tu pedido en 24/48 horas",
    },
    {
      icon: <VerifiedUser sx={{ fontSize: 40 }} />,
      title: "Garantía",
      description: "30 días de garantía en todos los productos",
    },
    {
      icon: <CreditCard sx={{ fontSize: 40 }} />,
      title: "Pagos Seguros",
      description: "Transacciones 100% protegidas",
    },
    {
      icon: <LocalOffer sx={{ fontSize: 40 }} />,
      title: "Los mejores precios",
      description: "Los precios más accesibles con Nosotros",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
          Beneficios de comprar con Nosotros
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
          width: "100%",
          alignItems: "stretch",
        }}
      >
        {beneficios.map((beneficio, index) => (
          <NeonCard key={index}>
            <CardSurface>
              <Box
                sx={{
                  color: "primary.main",
                  mb: 1.5,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {beneficio.icon}
              </Box>
              <Typography
                variant="subtitle1"
                component="h3"
                gutterBottom
                fontWeight="bold"
                sx={{ mb: 0.5, lineHeight: 1.2 }}
              >
                {beneficio.title}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ lineHeight: 1.4, display: "block" }}
              >
                {beneficio.description}
              </Typography>
            </CardSurface>
          </NeonCard>
        ))}
      </Box>
    </Container>
  );
};

export default BeneficiosHome;
