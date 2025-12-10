import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BotonCompartir from "../../components/common/BotonCompartir.jsx";
import {
  Container,
  Box,
  Typography,
  Button,
  Stack,
  Divider,
  Skeleton,
  Grid,
  useTheme,
  useMediaQuery,
  Paper,
  IconButton,
} from "@mui/material";
import {
  AddShoppingCart,
  ArrowBack,
  Inventory,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import { Snackbar, Alert } from "@mui/material";
import clientAxios from "../../utils/clientAxios.js";
import ReviewForm from "../../components/reviews/ReviewForm.jsx";
import ReviewsList from "../../components/reviews/ReviewsList.jsx";
import useCart from "../../hooks/useCart.js";
import { useFavoritos } from "../../hooks/useFavoritos.js";
import { usePageTitle } from "../../hooks/usePageTitle";
import { usePromocionStore } from "../../hooks/usePromocionStore";
import PromocionBadge from "../../components/promotions/PromocionBadge";
import {
  obtenerPromocionProducto,
  calcularPrecioConDescuento,
} from "../../utils/promocionUtils";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [promociones, setPromociones] = useState([]);

  usePageTitle(product?.nombre || "Detalle del Producto");

  const { añadirAlCarrito, cargando } = useCart();
  const { obtenerPromocionesActivas } = usePromocionStore();

  const {
    toggleFavorito,
    esFavorito,
    loading: cargandoFavorito,
  } = useFavoritos();

  const handleReviewAdded = () => setRefresh((prev) => prev + 1);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await añadirAlCarrito(product, 1);
      setSnackbarMessage("Producto agregado al carrito correctamente");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      setSnackbarMessage("Error al agregar al carrito");
      setSnackbarOpen(true);
    }
  };

  const handleToggleFavorito = async () => {
    if (!product) return;

    try {
      await toggleFavorito(product._id);
    } catch (error) {
      console.error("Error al gestionar favoritos:", error);
      setSnackbarMessage("Error al gestionar favoritos");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productRes, promocionesRes] = await Promise.all([
          clientAxios.get(`/productos/${id}`),
          obtenerPromocionesActivas(),
        ]);
        setProduct(productRes.data.producto || productRes.data);
        setPromociones(promocionesRes || []);
      } catch {
        setError("No se pudo cargar el producto.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, obtenerPromocionesActivas]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton
              variant="rectangular"
              height={400}
              sx={{
                borderRadius: 2,
                bgcolor: "background.default",
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
            <Skeleton variant="text" height={40} width="40%" sx={{ mb: 3 }} />
            <Skeleton variant="text" height={100} sx={{ mb: 3 }} />
            <Skeleton
              variant="rectangular"
              height={50}
              sx={{
                borderRadius: 1,
                mb: 2,
              }}
            />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          startIcon={<ArrowBack />}
        >
          Volver a Inicio
        </Button>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Producto no encontrado
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          startIcon={<ArrowBack />}
        >
          Volver a Inicio
        </Button>
      </Container>
    );
  }

  const mainImage =
    product.imagenes?.[selectedImage] ||
    "https://via.placeholder.com/600x400?text=Sin+imagen";
  const hasMultipleImages = product.imagenes && product.imagenes.length > 1;

  const promocion = obtenerPromocionProducto(product._id, promociones);
  const precioConDescuento = promocion
    ? calcularPrecioConDescuento(product.precio, promocion.descuento)
    : null;

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/")}
          sx={{
            mb: 3,
            color: "text.secondary",
            "&:hover": {
              color: "primary.main",
            },
          }}
        >
          Volver a Inicio
        </Button>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "background.paper",
                boxShadow: theme.shadows[2],
                width: "100%",
                position: "relative",
              }}
            >
              <Box sx={{ position: "relative", width: "100%" }}>
                <img
                  src={mainImage}
                  alt={product.nombre}
                  style={{
                    width: "100%",
                    height: isMobile ? "300px" : "450px",
                    objectFit: "cover",
                  }}
                />

                {/* Badge de promoción */}
                {promocion && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      zIndex: 1,
                    }}
                  >
                    <PromocionBadge
                      descuento={promocion.descuento}
                      size="medium"
                    />
                  </Box>
                )}

                {/* BOTÓN DE FAVORITOS sobre la imagen */}
                <IconButton
                  onClick={handleToggleFavorito}
                  disabled={cargandoFavorito}
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    color: esFavorito(product._id)
                      ? "error.main"
                      : "text.secondary",
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: "12px",
                    width: 48,
                    height: 48,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: esFavorito(product._id)
                        ? "error.light"
                        : "primary.light",
                      color: esFavorito(product._id)
                        ? "error.dark"
                        : "primary.main",
                      transform: "scale(1.1)",
                    },
                    "&:disabled": {
                      opacity: 0.5,
                    },
                  }}
                >
                  {esFavorito(product._id) ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
              </Box>

              {hasMultipleImages && (
                <Box
                  sx={{
                    p: 2,
                    display: "flex",
                    gap: 1,
                    overflowX: "auto",
                    "&::-webkit-scrollbar": {
                      height: 6,
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "transparent",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: theme.palette.divider,
                      borderRadius: 3,
                    },
                  }}
                >
                  {product.imagenes.map((img, index) => (
                    <Box
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 1,
                        border:
                          selectedImage === index
                            ? `2px solid ${theme.palette.primary.main}`
                            : "1px solid",
                        borderColor:
                          selectedImage === index ? "primary.main" : "divider",
                        cursor: "pointer",
                        overflow: "hidden",
                        flexShrink: 0,
                        "&:hover": {
                          borderColor: "primary.main",
                        },
                      }}
                    >
                      <img
                        src={img}
                        alt={`Vista ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    mb: 1,
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                  }}
                >
                  <Typography
                    variant="h4"
                    component="h1"
                    fontWeight="bold"
                    color="text.primary"
                    sx={{
                      lineHeight: 1.2,
                      flex: 1,
                    }}
                  >
                    {product.nombre}
                  </Typography>

                  {/* BOTÓN DE COMPARTIR en el header */}
                  <BotonCompartir
                    idProducto={product._id}
                    nombreProducto={product.nombre}
                  />
                </Box>

                {promocion ? (
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        textDecoration: "line-through",
                        color: "text.secondary",
                        fontWeight: 500,
                        mb: 0.5,
                      }}
                    >
                      ${product.precio?.toLocaleString()}
                    </Typography>
                    <Typography
                      variant="h3"
                      fontWeight="bold"
                      color="error.main"
                      gutterBottom
                    >
                      ${precioConDescuento?.toLocaleString()}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="success.main"
                      sx={{ fontWeight: 600 }}
                    >
                      Ahorrás $
                      {(product.precio - precioConDescuento).toLocaleString()}
                    </Typography>
                  </Box>
                ) : (
                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    color="primary.main"
                    gutterBottom
                  >
                    ${product.precio?.toLocaleString()}
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography
                  variant="body1"
                  color="text.primary"
                  sx={{
                    lineHeight: 1.7,
                    fontSize: "1.1rem",
                    mb: 2,
                  }}
                >
                  {product.descripcion ||
                    "Este producto no tiene descripción disponible."}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Inventory color="primary" />
                <Box>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    fontWeight="medium"
                  >
                    Stock disponible: {product.stock} unidades
                  </Typography>

                  {product.stock === 0 && (
                    <Typography
                      variant="body2"
                      color="error.main"
                      sx={{ mt: 0.5 }}
                    >
                      Producto temporalmente no disponible
                    </Typography>
                  )}

                  {product.stock > 0 && product.stock < 10 && (
                    <Typography
                      variant="body2"
                      color="warning.main"
                      sx={{ mt: 0.5 }}
                    >
                      Últimas {product.stock} unidades disponibles
                    </Typography>
                  )}
                </Box>
              </Box>

              <Divider />

              <Button
                variant="contained"
                size="large"
                startIcon={<AddShoppingCart />}
                onClick={handleAddToCart}
                disabled={cargando || product.stock === 0}
                sx={{
                  py: 2,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  borderRadius: 2,
                  bgcolor: "primary.main",
                  "&:hover": {
                    bgcolor: "primary.dark",
                    transform: "translateY(-2px)",
                    boxShadow: theme.shadows[4],
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  },
                  "&:disabled": {
                    bgcolor: "action.disabled",
                    color: "text.disabled",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {cargando
                  ? "Agregando..."
                  : product.stock === 0
                  ? "Sin Stock"
                  : "Agregar al Carrito"}
              </Button>

              <Button
                variant="outlined"
                onClick={() => navigate("/")}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: "primary.main",
                  color: "primary.main",
                  "&:hover": {
                    borderColor: "primary.dark",
                    bgcolor: "action.hover",
                  },
                }}
              >
                Seguir Comprando
              </Button>
            </Stack>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: "background.paper",
              boxShadow: theme.shadows[1],
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              fontWeight="bold"
              color="text.primary"
              sx={{ mb: 3 }}
            >
              Opiniones del Producto
            </Typography>

            <ReviewForm
              productId={product._id}
              onReviewAdded={handleReviewAdded}
            />

            <Divider sx={{ my: 4 }} />

            <ReviewsList productId={product._id} refreshTrigger={refresh} />
          </Paper>
        </Box>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{
            width: "100%",
            borderRadius: 2,
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductDetail;
