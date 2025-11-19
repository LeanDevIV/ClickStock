import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Spinner, Alert } from "react-bootstrap";
import { Button, Snackbar, Alert as MuiAlert } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import clientAxios from "../utils/clientAxios";
import ReviewForm from "../components/ReviewForm";
import ReviewsList from "../components/ReviewsList";
import useCart from "../hooks/useCart"; // Asegúrate de importar el hook corregido
import "../css/productDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const { añadirAlCarrito, cargando } = useCart();

  const handleReviewAdded = () => setRefresh((prev) => prev + 1);

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await añadirAlCarrito(product, 1);
      // Mostrar snackbar de éxito
      setSnackbarMessage("Producto agregado al carrito correctamente");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      // El hook ya muestra el toast de error, pero podemos agregar un snackbar adicional si quieres
      console.error("Error al agregar al carrito:", error);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
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

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (error)
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  if (!product)
    return (
      <Container className="mt-4">
        <Alert variant="warning">Producto no encontrado.</Alert>
      </Container>
    );

  return (
    <>
      <Container className="mt-4">
        <div className="product-detail-container d-flex flex-column flex-md-row align-items-center">
          <img
            src={
              product.imagenes?.[0] ||
              "https://via.placeholder.com/300x200?text=Sin+imagen"
            }
            alt={product.nombre}
            className="product-detail-image"
          />
          <div className="product-info ms-md-4 mt-3 mt-md-0">
            <h3>{product.nombre}</h3>
            <p className="price">${product.precio?.toLocaleString()}</p>
            <p>{product.descripcion || "Sin descripción disponible."}</p>
            <p>
              <strong>Stock:</strong> {product.stock}
            </p>
            
            {/* Botón Agregar al Carrito con MUI */}
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddShoppingCartIcon />}
              onClick={handleAddToCart}
              disabled={cargando || product.stock === 0}
              sx={{
                mt: 2,
                px: 4,
                py: 1.5,
                fontWeight: "bold",
                fontSize: "1rem",
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#1565c0",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
                },
                "&:active": {
                  transform: "translateY(0)"
                },
                "&:disabled": {
                  backgroundColor: "#e0e0e0",
                  color: "#9e9e9e",
                  transform: "none",
                  boxShadow: "none"
                },
                transition: "all 0.3s ease"
              }}
            >
              {cargando ? (
                "Agregando..."
              ) : product.stock === 0 ? (
                "Sin Stock"
              ) : (
                "Agregar al Carrito"
              )}
            </Button>

            {product.stock === 0 && (
              <p style={{ 
                color: "#d32f2f", 
                marginTop: "8px", 
                fontSize: "14px",
                fontStyle: "italic"
              }}>
                Producto temporalmente no disponible
              </p>
            )}

            {product.stock > 0 && product.stock < 10 && (
              <p style={{ 
                color: "#ed6c02", 
                marginTop: "8px", 
                fontSize: "14px"
              }}>
                ⚠️ Últimas {product.stock} unidades disponibles
              </p>
            )}
          </div>
        </div>

        <div className="reviews-section mt-5">
          <ReviewForm productId={product._id} onReviewAdded={handleReviewAdded} />
          <ReviewsList productId={product._id} refreshTrigger={refresh} />
        </div>
      </Container>

      {/* Snackbar para feedback visual */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <MuiAlert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default ProductDetail;