// src/pages/ProductList.jsx
import React from "react";
import { Container, Typography, Box } from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import Products from "../components/ProductosRender"; // 👈 Importa tu componente renderizador

const ProductList = () => {
  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 6,
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #fafafa 0%, #fef2f2 100%)",
        borderRadius: "20px",
        boxShadow: "0 8px 30px rgba(185, 28, 28, 0.15)",
        border: "1px solid rgba(185, 28, 28, 0.1)",
        minHeight: "100vh",
      }}
    >
      {/* Título principal */}
      <Box
        sx={{
          textAlign: "center",
          mb: 5,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "2rem", md: "2.8rem" },
            background:
              "linear-gradient(135deg, #1f2937 0%, #374151 50%, #b91c1c 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <ShoppingBagIcon
            sx={{
              color: "#b91c1c",
              fontSize: "2.5rem",
              animation: "bounceIcon 2s infinite ease-in-out",
            }}
          />
          Catálogo de Productos
        </Typography>

        <Box
          sx={{
            width: "120px",
            height: "5px",
            background:
              "linear-gradient(90deg, transparent, #dc2626, #b91c1c, #dc2626, transparent)",
            borderRadius: "10px",
            mx: "auto",
            mt: 1.5,
            animation: "shimmerBar 3s infinite ease-in-out",
          }}
        />
      </Box>

      {/* Render del componente de productos */}
      <Products />
    </Container>
  );
};

export default ProductList;
