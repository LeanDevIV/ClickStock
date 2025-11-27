import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import clientAxios from "../utils/clientAxios";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { useFavoritos } from "../hooks/useFavoritos";
import { useCart } from "../hooks/useCart";
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
  Skeleton,
  useTheme,
  useMediaQuery,
  Container,
  Stack,
  Tooltip,
} from "@mui/material";

function Products({ productos: productosExternos }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(!productosExternos);
  const {
    esFavorito,
    toggleFavorito,
    loading: loadingFavoritos,
  } = useFavoritos();
  const {
    añadirAlCarrito,
    quitarDelCarrito,
    cargando: cargandoCarrito,
    articulos,
  } = useCart();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Función para verificar si el producto está en el carrito
  const estaEnCarrito = (productoId) => {
    return articulos.some((item) => item.idProducto === productoId);
  };

  useEffect(() => {
    if (productosExternos) {
      setProductos(productosExternos);
      setLoading(false);
    } else {
      obtenerProductos();
    }
  }, [productosExternos]);

  async function obtenerProductos() {
    try {
      setLoading(true);
      const response = await clientAxios.get("/productos");
      const productosData = response.data?.productos || response.data;

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
  }

  const handleToggleCarrito = async (producto) => {
    try {
      if (estaEnCarrito(producto._id)) {
        // Si ya está en el carrito, quitarlo
        await quitarDelCarrito(producto._id);
      } else {
        // Si no está en el carrito, agregarlo
        await añadirAlCarrito(producto, 1);
      }
    } catch (error) {
      console.error("Error al modificar el carrito:", error);
    }
  };

  const ProductCardSkeleton = () => (
    <Card
      sx={{
        width: isMobile ? 280 : 300,
        height: 420,
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        boxShadow: 2,
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      <Skeleton
        variant="rectangular"
        width="100%"
        height={200}
        sx={{ bgcolor: "grey.800" }}
      />

      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={20} width="60%" sx={{ mb: 1 }} />
        <Skeleton variant="text" height={28} width="40%" sx={{ mb: 2 }} />

        <Box sx={{ mt: "auto" }}>
          <Skeleton
            variant="rectangular"
            height={40}
            sx={{ borderRadius: 2 }}
          />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h3"
          component="h1"
          fontWeight="bold"
          gutterBottom
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Nuestros Productos
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: "auto" }}
        >
          Descubre nuestra selección exclusiva de productos de alta calidad
        </Typography>
      </Box>

      {loading ? (
        <Grid container spacing={3} justifyContent="center">
          {[...Array(8)].map((_, index) => (
            <Grid
              item
              key={index}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <ProductCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {productos.length > 0 ? (
            productos.map((producto) => {
              const enCarrito = estaEnCarrito(producto._id);

              return (
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
                      width: isMobile ? 280 : 300,
                      height: 420,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      borderRadius: 3,
                      boxShadow: theme.shadows[3],
                      overflow: "hidden",
                      position: "relative",
                      background: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      transition: "all 0.4s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: theme.shadows[8],
                        "& .favorito-btn": {
                          opacity: 1,
                          transform: "translateY(0)",
                        },
                        "& .carrito-btn": {
                          opacity: 1,
                          transform: "translateY(0)",
                        },
                        "& .product-image": {
                          transform: "scale(1.05)",
                        },
                      },
                    }}
                  >
                    {producto.destacado && (
                      <Chip
                        label="Destacado"
                        color="primary"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 12,
                          left: 12,
                          fontWeight: "bold",
                          zIndex: 2,
                          backdropFilter: "blur(10px)",
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(0,0,0,0.7)"
                              : "rgba(255,255,255,0.9)",
                        }}
                      />
                    )}

                    <Box sx={{ position: "relative", overflow: "hidden" }}>
                      <CardMedia
                        component="img"
                        image={
                          producto.imagenes?.[0] ||
                          "https://picsum.photos/300/200?random=" + producto._id
                        }
                        alt={producto.nombre}
                        className="product-image"
                        sx={{
                          height: 200,
                          objectFit: "cover",
                          transition: "transform 0.4s ease",
                        }}
                      />
                    </Box>

                    <IconButton
                      className="favorito-btn"
                      onClick={() => toggleFavorito(producto._id)}
                      disabled={loadingFavoritos}
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        color: esFavorito(producto._id)
                          ? theme.palette.error.main
                          : "grey.400",
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(0,0,0,0.7)"
                            : "rgba(255,255,255,0.9)",
                        backdropFilter: "blur(10px)",
                        opacity: 0,
                        transform: "translateY(-10px)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(0,0,0,0.9)"
                              : "white",
                          transform: "scale(1.1)",
                        },
                      }}
                    >
                      {esFavorito(producto._id) ? (
                        <FavoriteIcon />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </IconButton>

                    <Tooltip
                      title={
                        enCarrito ? "Quitar del carrito" : "Agregar al carrito"
                      }
                    >
                      <IconButton
                        className="carrito-btn"
                        onClick={() => handleToggleCarrito(producto)}
                        disabled={cargandoCarrito}
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 54,
                          color: enCarrito
                            ? theme.palette.success.main
                            : theme.palette.primary.main,
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(0,0,0,0.7)"
                              : "rgba(255,255,255,0.9)",
                          backdropFilter: "blur(10px)",
                          opacity: 0,
                          transform: "translateY(-10px)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? "rgba(0,0,0,0.9)"
                                : "white",
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        {enCarrito ? (
                          <ShoppingCartCheckoutIcon fontSize="small" />
                        ) : (
                          <AddShoppingCartIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>

                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        p: 2.5,
                      }}
                    >
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="h6"
                          component="h2"
                          sx={{
                            fontWeight: 600,
                            mb: 1,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            minHeight: "48px",
                            color: "text.primary",
                          }}
                        >
                          {producto.nombre}
                        </Typography>

                        <Typography
                          variant="h5"
                          component="p"
                          sx={{
                            fontWeight: "bold",
                            color: "primary.main",
                            textAlign: "center",
                            mb: 2,
                          }}
                        >
                          ${producto.precio?.toLocaleString()}
                        </Typography>

                        {producto.categoria && (
                          <Chip
                            label={
                              typeof producto.categoria === "object"
                                ? producto.categoria.nombre
                                : producto.categoria
                            }
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: "0.7rem",
                              mb: 1.5,
                              width: "100%",
                              borderColor: "primary.main",
                              color: "primary.main",
                            }}
                          />
                        )}

                        <Box sx={{ mt: "auto", pt: 1 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              fontSize: "0.875rem",
                              textAlign: "center",
                              fontWeight:
                                producto.stock < 10 ? "bold" : "normal",
                            }}
                          >
                            Disponible:{" "}
                            <Box
                              component="span"
                              sx={{
                                color:
                                  producto.stock === 0
                                    ? theme.palette.error.main
                                    : producto.stock < 10
                                    ? theme.palette.warning.main
                                    : theme.palette.success.main,
                                fontWeight: 600,
                              }}
                            >
                              {producto.stock} unidades
                            </Box>
                          </Typography>

                          {producto.stock < 10 && producto.stock > 0 && (
                            <Typography
                              variant="caption"
                              sx={{
                                display: "block",
                                textAlign: "center",
                                mt: 0.5,
                                color: theme.palette.warning.main,
                                fontWeight: "bold",
                              }}
                            >
                              Últimas unidades
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      <Button
                        variant="contained"
                        fullWidth
                        sx={{
                          borderRadius: 2,
                          py: 1.2,
                          textTransform: "none",
                          fontWeight: "bold",
                          fontSize: "1rem",
                          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          color: theme.palette.primary.contrastText,
                          boxShadow: `0 4px 15px ${theme.palette.primary.main}30`,
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: `0 6px 20px ${theme.palette.primary.main}50`,
                            background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                          },
                          transition: "all 0.3s ease",
                          mt: 2,
                        }}
                        onClick={() =>
                          navigate(`/producto/detalle/${producto._id}`)
                        }
                      >
                        Ver Detalles
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <Box sx={{ textAlign: "center", py: 8, width: "100%" }}>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                No hay productos disponibles
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Pronto tendremos nuevos productos para ti
              </Typography>
            </Box>
          )}
        </Grid>
      )}
    </Container>
  );
}

export default Products;
