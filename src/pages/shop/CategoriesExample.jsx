import { useState, useEffect } from "react";
import CategoriesList from "../components/CategoriesList";
import clientAxios from "../../utils/clientAxios";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
} from "@mui/material";

/**
 * Ejemplo de cómo usar el sistema de categorías
 *
 * Este archivo muestra cómo:
 * 1. Mostrar todas las categorías
 * 2. Filtrar productos por categoría seleccionada
 * 3. Actualizar la vista de productos
 */

export const CategoriesExample = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cuando se selecciona una categoría, obtener sus productos
  useEffect(() => {
    if (selectedCategoryId) {
      fetchProductosPorCategoria(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  const fetchProductosPorCategoria = async (categoryId) => {
    setLoading(true);
    try {
      const { data } = await clientAxios.get(
        `/productos/categoria/${categoryId}`
      );
      setProductosFiltrados(data);
    } catch (error) {
      console.error("Error:", error);
      setProductosFiltrados([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Mostrar la lista de categorías */}
      <CategoriesList onSelectCategory={setSelectedCategoryId} />

      {/* Mostrar productos filtrados por categoría */}
      {selectedCategoryId && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
            Productos en esta categoría
          </Typography>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
              <CircularProgress />
            </Box>
          ) : productosFiltrados.length > 0 ? (
            <Grid container spacing={3} sx={{ justifyContent: "center" }}>
              {productosFiltrados.map((producto) => (
                <Grid
                  item
                  key={producto._id}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Card
                    sx={{
                      width: 280,
                      height: 400,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      borderRadius: 3,
                      boxShadow: 3,
                      overflow: "hidden",
                      position: "relative",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: 20,
                      },
                    }}
                  >
                    {producto.imagenes && producto.imagenes[0] && (
                      <CardMedia
                        component="img"
                        image={producto.imagenes[0]}
                        alt={producto.nombre}
                        sx={{
                          height: 180,
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        textAlign: "center",
                        p: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {producto.nombre}
                      </Typography>
                      {producto.descripcion && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {producto.descripcion}
                        </Typography>
                      )}
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        ${producto.precio}
                      </Typography>
                      {producto.categoria && producto.categoria.nombre && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          Categoría: {producto.categoria.nombre}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>No hay productos en esta categoría</Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default CategoriesExample;
