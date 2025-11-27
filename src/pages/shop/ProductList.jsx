import React from "react";
import { Container, Typography, Box, useTheme, Paper } from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import Products from "../../components/products/ProductosRender";

const ProductList = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          background: theme.palette.background.paper,
          minHeight: "80vh",
        }}
      >
        {/* Título principal */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2rem", md: "2.8rem" },
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(45deg, #D4AF37, #FFD700)"
                  : "linear-gradient(45deg, #B91C1C, #D4AF37)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              mb: 2,
            }}
          >
            <ShoppingBagIcon sx={{ fontSize: "2.5rem" }} />
            Catálogo de Productos
          </Typography>

          <Box
            sx={{
              width: "120px",
              height: "4px",
              background: theme.palette.primary.main,
              borderRadius: "10px",
              mx: "auto",
              opacity: 0.7,
            }}
          />
        </Box>

        {/* Render del componente de productos */}
        <Products />
      </Paper>
    </Container>
  );
};

export default ProductList;
