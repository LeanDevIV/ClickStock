import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BotonCompartir from '../components/BotonCompartir.jsx';
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
  Chip,
} from "@mui/material";
import { AddShoppingCart, ArrowBack, Inventory } from "@mui/icons-material";
import { Snackbar, Alert } from "@mui/material";
import clientAxios from "../utils/clientAxios";
import ReviewForm from "../components/ReviewForm";
import ReviewsList from "../components/ReviewsList";
import useCart from "../hooks/useCart";

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

  const { añadirAlCarrito, cargando } = useCart();

  const handleReviewAdded = () => setRefresh((prev) => prev + 1);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await añadirAlCarrito(product, 1);
      setSnackbarMessage("Producto agregado al carrito correctamente");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      setSnackbarMessage("Error al agregar al carrito", error.message);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await clientAxios.get(`/productos/${id}`);
        setProduct(data.producto || data);
      } catch {
        setError("No se pudo cargar el producto.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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
          onClick={() => navigate("/productos")}
          startIcon={<ArrowBack />}
        >
          Volver a Productos
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
          onClick={() => navigate("/productos")}
          startIcon={<ArrowBack />}
        >
          Volver a Productos
        </Button>
      </Container>
    );
  }

  const mainImage =
    product.imagenes?.[selectedImage] ||
    "https://via.placeholder.com/600x400?text=Sin+imagen";
  const hasMultipleImages = product.imagenes && product.imagenes.length > 1;

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Botón de volver */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/productos")}
          sx={{
            mb: 3,
            color: "text.secondary",
            "&:hover": {
              color: "primary.main",
            },
          }}
        >
          Volver a productos
        </Button>

        <Grid container spacing={4}>
          {/* Sección de Imagen */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "background.paper",
                boxShadow: theme.shadows[2],
              }}
            >
              <Box sx={{ position: "relative" }}>
                <img
                  src={mainImage}
                  alt={product.nombre}
                  style={{
                    width: "100%",
                    height: isMobile ? "300px" : "450px",
                    objectFit: "cover",
                  }}
                />
              </Box>

              {/* Miniaturas */}
              {hasMultipleImages && (
                <Box sx={{ p: 2, display: "flex", gap: 1, overflowX: "auto" }}>
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

          {/* Sección de Información */}
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              {/* Título y precio */}
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  fontWeight="bold"
                  gutterBottom
                  color="text.primary"
                  sx={{ lineHeight: 1.2 }}
                >
                  {product.nombre}
                </Typography>
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  color="primary.main"
                  gutterBottom
                >
                  ${product.precio?.toLocaleString()}
                </Typography>
                    <BotonCompartir 
        idProducto="test-123"
        nombreProducto="Producto de Prueba"
      />
              </Box>

              {/* Descripción */}
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

              {/* Información de stock */}
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

              {/* Botón principal */}
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

              {/* Botón secundario */}
              <Button
                variant="outlined"
                onClick={() => navigate("/productos")}
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

        {/* Sección de Reseñas */}
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

      {/* Snackbar */}
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
