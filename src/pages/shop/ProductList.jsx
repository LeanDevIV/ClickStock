import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  useTheme,
  Paper,
  CircularProgress,
} from "@mui/material";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ProductGrid from "../../components/products/ProductGrid";
import clientAxios from "../../utils/clientAxios";

const ProductList = () => {
  const theme = useTheme();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        setLoading(true);
        const { data } = await clientAxios.get("/productos");
        const productosData = data?.productos || data;

        if (Array.isArray(productosData)) {
          const productosFiltrados = productosData.filter(
            (producto) => producto.stock > 0 && producto.disponible === true
          );
          setProductos(productosFiltrados);
        } else {
          setProductos([]);
        }
      } catch (error) {
        console.error("Error al obtener productos:", error);
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };

    obtenerProductos();
  }, []);

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
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <ProductGrid productos={productos} />
        )}
      </Paper>
    </Container>
  );
};

export default ProductList;
