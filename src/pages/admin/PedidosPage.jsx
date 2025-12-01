import React from "react";
import TablaPedidos from "../../components/pedidos/TablaPedidos";
import { Box, Typography, Container } from "@mui/material";

import { usePageTitle } from "../../hooks/usePageTitle";

const PedidosPage = () => {
  usePageTitle("Admin - Pedidos");

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <TablaPedidos />
    </Container>
  );
};

export default PedidosPage;
