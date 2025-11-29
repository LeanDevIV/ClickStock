import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ProductCard from "./ProductCard";

const ProductGrid = ({ productos = [] }) => {
  const theme = useTheme();

  if (productos.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          textAlign: "center",
          py: 8,
        }}
      >
        <Inventory2OutlinedIcon
          sx={{
            fontSize: 80,
            color: theme.palette.text.disabled,
            mb: 2,
            opacity: 0.5,
          }}
        />
        <Typography
          variant="h5"
          color="text.secondary"
          gutterBottom
          sx={{ fontWeight: 300 }}
        >
          Nada por aquí... aún
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ opacity: 0.7, maxWidth: 400 }}
        >
          No se encontraron productos para mostrar.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2,1fr)",
          sm: "repeat(3,1fr)",
          md: "repeat(4,1fr)",
          lg: "repeat(5,1fr)",
        },
        gap: { xs: 2.5, md: 3.5 },
        justifyItems: "center",
        minHeight: {
          xs: "760px",
          sm: "860px",
          md: "1050px",
          lg: "1150px",
        },
        alignContent: "start",
      }}
    >
      {productos.map((producto) => (
        <ProductCard key={producto._id} producto={producto} />
      ))}
    </Box>
  );
};

export default ProductGrid;
