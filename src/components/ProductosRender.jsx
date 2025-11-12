import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 Importa esto
import clientAxios from "../utils/clientAxios";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useFavoritos } from "../hooks/useFavoritos";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Grid,
  Box,
  CircularProgress,
  IconButton,
} from "@mui/material";

function Products() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { esFavorito, toggleFavorito, loading: loadingFavoritos } = useFavoritos();

  const navigate = useNavigate(); // 👈 Hook de navegación

  useEffect(() => {
    obtenerProductos();
  }, []);

  async function obtenerProductos() {
    try {
      setLoading(true);
      const response = await clientAxios.get("/productos");
      const productosData = response.data?.productos || response.data;

      if (Array.isArray(productosData)) {
        // Filtrar productos: stock > 0 y disponible === true
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
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Productos
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ justifyContent: "center" }}>
          {productos.length > 0 ? (
            productos.map((producto) => (
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
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: 20,
                      "&:hover .favorito-btn": {
                        opacity: 1,
                        transform: "translateY(0)",
                      },
                    },
                  }}
                >
                  {producto.destacado && (
                    <Chip
                      label="🌟"
                      color="error"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        fontWeight: "bold",
                      }}
                    />
                  )}

                  <CardMedia
                    component="img"
                    image={
                      producto.imagenes[0] ||
                      "https://via.placeholder.com/300x200?text=Sin+imagen"
                    }
                    alt={producto.nombre}
                    sx={{
                      height: 180,
                      objectFit: "cover",
                    }}
                  />

                  {/* Botón de favoritos */}
                  <IconButton
                    className="favorito-btn"
                    onClick={() => toggleFavorito(producto._id)}
                    disabled={loadingFavoritos}
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      color: esFavorito(producto._id)
                        ? "error.main"
                        : "white",
                      backgroundColor: "rgba(0,0,0,0.4)",
                      opacity: 0,
                      transform: "translateY(-10px)",
                      transition: "all 0.3s ease",
                      "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
                    }}
                  >
                    {esFavorito(producto._id) ? (
                      <FavoriteIcon />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>

                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      textAlign: "center",
                      p: 2,
                    }}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {producto.nombre}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        Stock:{" "}
                        <span
                          style={{
                            color:
                              producto.stock === 0
                                ? "#f44336"
                                : producto.stock < 10
                                ? "#ff9800"
                                : "#4caf50",
                            fontWeight: 600,
                          }}
                        >
                          {producto.stock}
                        </span>
                      </Typography>

                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        ${producto.precio}
                      </Typography>
                    </Box>

                    {/* 👇 Navega al detalle */}
                    <Button
                      variant="contained"
                      sx={{
                        borderRadius: 2,
                        mt: 2,
                        textTransform: "none",
                        fontWeight: "bold",
                      }}
                      onClick={() => navigate(`/producto/detalle/${producto._id}`)}
                    >
                      Ver más
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography>No hay productos disponibles.</Typography>
          )}
        </Grid>
      )}
    </Box>
  );
}

export default Products;
