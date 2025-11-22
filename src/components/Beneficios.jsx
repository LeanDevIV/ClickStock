import React from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import {
  LocalShipping,
  VerifiedUser,
  CreditCard,
  LocalOffer,
} from "@mui/icons-material";
import { styled, keyframes } from "@mui/material/styles";

// Keyframe para el efecto de luz neón recorriendo los bordes
const neonBorder = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
`;

// Styled Card con efecto neón
const NeonCard = styled(Card)(({ theme }) => ({
  height: "100%",
  textAlign: "center",
  position: "relative",
  overflow: "visible",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme.shadows[6],
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: theme.shape.borderRadius,
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
    zIndex: -1,
    opacity: 0.8,
  },
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
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
          Beneficios de comprar con Nosotros
        </Typography>
      </Box>

      <Grid container spacing={2} justifyContent="center">
        {beneficios.map((beneficio, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <NeonCard>
              <CardContent
                sx={{ py: 2, px: 2, position: "relative", zIndex: 1 }}
              >
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
                  component="h6"
                  gutterBottom
                  fontWeight="bold"
                >
                  {beneficio.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {beneficio.description}
                </Typography>
              </CardContent>
            </NeonCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BeneficiosHome;
