import React from "react";
import { Container, Typography, Box } from "@mui/material";
import PromocionesForm from "../../components/forms/PromocionesForm";

const PromocionesPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Gestión de Promociones
        </Typography>
        <Typography color="text.secondary">
          Crea y administra las promociones activas en la tienda
        </Typography>
      </Box>
      <PromocionesForm />
    </Container>
  );
};

export default PromocionesPage;
