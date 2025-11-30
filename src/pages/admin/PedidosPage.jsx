import React from "react";
import TablaPedidos from "../../components/pedidos/TablaPedidos";
import { Box, Typography, Container } from "@mui/material";

const PedidosPage = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <TablaPedidos />
    </Container>
  );
};

export default PedidosPage;
