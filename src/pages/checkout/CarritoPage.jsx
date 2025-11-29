import React, { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  Divider,
  Chip,
  Stack,
  Badge,
  Skeleton,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Add,
  Remove,
  Delete,
  ShoppingBag,
  Payment,
  ArrowBack,
  ShoppingCart,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import useCart from "../../hooks/useCart";
import { useMercadoPago } from "../../hooks/useMercadoPago";
import { useStore } from "../../hooks/useStore";
import AuthModal from "../../components/auth/AuthModal";

const CartItemSkeleton = () => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Skeleton
          variant="rectangular"
          width={80}
          height={80}
          sx={{ borderRadius: 2 }}
        />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="40%" height={28} />
          <Skeleton variant="text" width="60%" height={20} />
        </Box>
        <Stack spacing={1} alignItems="flex-end">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="text" width={20} height={24} />
            <Skeleton variant="circular" width={32} height={32} />
          </Box>
          <Skeleton variant="circular" width={32} height={32} />
        </Stack>
      </Box>
    </Card>
  );
};

const OrderSummarySkeleton = () => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <CardContent>
        <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Skeleton variant="text" width="30%" height={20} />
            <Skeleton variant="text" width="20%" height={20} />
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Skeleton variant="text" width="20%" height={28} />
            <Skeleton variant="text" width="40%" height={36} />
          </Box>
        </Box>
        <Box
          sx={{
            p: 2,
            backgroundColor:
              theme.palette.mode === "dark" ? "#2D2B1A" : "#FEF3C7",
            borderRadius: 2,
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Skeleton variant="circular" width={24} height={24} />
            <Skeleton variant="text" width="70%" height={20} />
            <Skeleton variant="text" width="20%" height={20} />
          </Box>
        </Box>
        <Stack spacing={1}>
          <Skeleton
            variant="rectangular"
            height={48}
            sx={{ borderRadius: 1 }}
          />
          <Skeleton
            variant="rectangular"
            height={40}
            sx={{ borderRadius: 1 }}
          />
          <Skeleton variant="text" width="50%" height={32} />
        </Stack>
        <Box
          sx={{
            mt: 2,
            p: 2,
            backgroundColor: theme.palette.background.default,
            borderRadius: 2,
          }}
        >
          <Skeleton variant="text" width="100%" height={20} />
        </Box>
      </CardContent>
    </Card>
  );
};

const CarritoPage = () => {
  const theme = useTheme();
  const {
    articulos,
    loading,
    cargando,
    precioTotal,
    totalArticulos,
    quitarDelCarrito,
    actualizarCantidad,
    limpiarCarrito,
  } = useCart();
  const { loading: loadingPayment, crearPreferencia } = useMercadoPago();
  const navigate = useNavigate();
  const user = useStore((state) => state.user);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleIncrementar = async (producto) => {
    await actualizarCantidad(producto.idProducto, producto.cantidad + 1);
  };

  const handleDecrementar = async (producto) => {
    if (producto.cantidad > 1) {
      await actualizarCantidad(producto.idProducto, producto.cantidad - 1);
    } else {
      await quitarDelCarrito(producto.idProducto);
    }
  };

  const handleEliminar = async (producto) => {
    await quitarDelCarrito(producto.idProducto);
  };

  const handleContinuarComprando = () => {
    navigate("/productos");
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleProcederPago = async () => {
    if (articulos.length === 0) return;

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!user.correo) {
      alert("Tu usuario no tiene un correo asociado válido.");
      return;
    }

    const productos = articulos.map((producto) => ({
      idProducto: producto.idProducto,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: producto.cantidad,
      imagen: producto.imagen,
    }));

    setSnackbarOpen(true);
    const result = await crearPreferencia(productos, user.correo);

    if (!result.success) {
      alert(result.error);
    }
  };

  if (cargando) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={48} />
              <Skeleton variant="text" width="40%" height={32} />
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Stack spacing={2}>
              {[...Array(3)].map((_, index) => (
                <CartItemSkeleton key={index} />
              ))}
            </Stack>
          </Box>
          <Box sx={{ width: { xs: "100%", md: 400 } }}>
            <OrderSummarySkeleton />
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 8, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          component={Link}
          to="/productos"
          sx={{ mb: 2, color: theme.palette.text.secondary }}
        >
          Volver a productos
        </Button>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <ShoppingCart
            sx={{ fontSize: 40, color: theme.palette.primary.main }}
          />
          <Box>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              color="text.primary"
            >
              Tu Carrito de Compras
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {totalArticulos} {totalArticulos === 1 ? "producto" : "productos"}{" "}
              en tu carrito
            </Typography>
          </Box>
          {articulos.length > 0 && (
            <Chip
              label={`${totalArticulos} items`}
              sx={{
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.secondary.contrastText,
                fontWeight: "bold",
              }}
            />
          )}
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
        }}
      >
        <Box sx={{ flex: 1 }}>
          {!user ? (
            <Card
              sx={{
                textAlign: "center",
                py: 8,
                backgroundColor: theme.palette.background.default,
              }}
            >
              <CardContent>
                <ShoppingBag
                  sx={{
                    fontSize: 80,
                    color: theme.palette.text.secondary,
                    mb: 2,
                    opacity: 0.5,
                  }}
                />
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  Inicia sesión para ver tu carrito
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3, opacity: 0.7 }}
                >
                  Guarda tus productos y agiliza tu compra
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => setShowAuthModal(true)}
                  sx={{
                    color: theme.palette.primary.contrastText,
                    backgroundColor: theme.palette.primary.main,
                    "&:hover": { backgroundColor: theme.palette.primary.dark },
                  }}
                >
                  Iniciar Sesión
                </Button>
              </CardContent>
            </Card>
          ) : articulos.length === 0 ? (
            <Card
              sx={{
                textAlign: "center",
                py: 8,
                backgroundColor: theme.palette.background.default,
              }}
            >
              <CardContent>
                <ShoppingBag
                  sx={{
                    fontSize: 80,
                    color: theme.palette.text.secondary,
                    mb: 2,
                    opacity: 0.5,
                  }}
                />
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  Tu carrito está vacío
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3, opacity: 0.7 }}
                >
                  Descubre nuestros productos y encuentra lo que necesitas
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleContinuarComprando}
                  sx={{
                    color: theme.palette.primary.contrastText,
                    backgroundColor: theme.palette.primary.main,
                    "&:hover": { backgroundColor: theme.palette.primary.dark },
                  }}
                >
                  Explorar Productos
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Stack spacing={2}>
              {loading
                ? [...Array(articulos.length)].map((_, index) => (
                    <CartItemSkeleton key={index} />
                  ))
                : articulos.map((producto) => (
                    <Card
                      key={producto.idProducto}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        backgroundColor: theme.palette.background.paper,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Badge
                          badgeContent={producto.cantidad}
                          color="error"
                          overlap="circular"
                        >
                          <Box
                            sx={{
                              width: 80,
                              height: 80,
                              borderRadius: 2,
                              backgroundColor: theme.palette.background.default,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              border: `2px solid ${theme.palette.primary.main}`,
                            }}
                          >
                            {/* SOLUCIÓN: Cambiar producto.imagen por producto.imagenes[0] */}
                            {producto.imagenes && producto.imagenes.length > 0 ? (
                              <img
                                src={producto.imagenes[0]}
                                alt={producto.nombre}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  borderRadius: 2,
                                }}
                              />
                            ) : (
                              <ShoppingBag
                                sx={{
                                  color: theme.palette.text.secondary,
                                  opacity: 0.5,
                                }}
                              />
                            )}
                          </Box>
                        </Badge>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="text.primary"
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              mb: 1,
                            }}
                          >
                            {producto.nombre}
                          </Typography>
                          <Typography
                            variant="h5"
                            fontWeight="bold"
                            color="secondary.main"
                          >
                            ${producto.precio?.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Subtotal: $
                            {(
                              producto.precio * producto.cantidad
                            ).toLocaleString()}
                          </Typography>
                        </Box>
                        <Stack spacing={1} alignItems="flex-end">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleDecrementar(producto)}
                              disabled={loading || producto.cantidad <= 1}
                              sx={{
                                border: `1px solid ${theme.palette.divider}`,
                                "&:hover": {
                                  backgroundColor: theme.palette.action.hover,
                                },
                                color: theme.palette.text.primary,
                              }}
                            >
                              <Remove fontSize="small" />
                            </IconButton>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{ minWidth: 30, textAlign: "center" }}
                              color="text.primary"
                            >
                              {producto.cantidad}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleIncrementar(producto)}
                              disabled={loading}
                              sx={{
                                border: `1px solid ${theme.palette.divider}`,
                                "&:hover": {
                                  backgroundColor: theme.palette.action.hover,
                                },
                                color: theme.palette.text.primary,
                              }}
                            >
                              <Add fontSize="small" />
                            </IconButton>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => handleEliminar(producto)}
                            disabled={loading}
                            sx={{
                              color: theme.palette.error.main,
                              "&:hover": {
                                backgroundColor:
                                  theme.palette.error.light + "20",
                              },
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                      </Box>
                    </Card>
                  ))}
            </Stack>
          )}
        </Box>

        {articulos.length > 0 && user && (
          <Box sx={{ width: { xs: "100%", md: 400 } }}>
            {loading ? (
              <OrderSummarySkeleton />
            ) : (
              <Card
                sx={{
                  position: "sticky",
                  top: 100,
                  borderRadius: 2,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  backgroundColor: theme.palette.background.paper,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    gutterBottom
                    color="text.primary"
                  >
                    Resumen del Pedido
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.primary">
                        Productos:
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color="text.primary"
                      >
                        {totalArticulos}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="h6" color="text.primary">
                        Total:
                      </Typography>
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        color="secondary.main"
                      >
                        ${precioTotal?.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>

                  {!user && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Inicia sesión para completar tu compra
                    </Alert>
                  )}

                  <Stack spacing={1}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={user ? <Payment /> : null}
                      disabled={loading || loadingPayment}
                      onClick={handleProcederPago}
                      sx={{
                        backgroundColor: theme.palette.secondary.main,
                        "&:hover": {
                          backgroundColor: theme.palette.secondary.dark,
                        },
                        py: 1.5,
                        fontWeight: "bold",
                        color: theme.palette.secondary.contrastText,
                      }}
                    >
                      {loadingPayment
                        ? "Procesando..."
                        : user
                        ? "Proceder al Pago"
                        : "Iniciar Sesión"}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={limpiarCarrito}
                      disabled={loading}
                      sx={{
                        borderColor: theme.palette.divider,
                        color: theme.palette.text.primary,
                        "&:hover": {
                          borderColor: theme.palette.secondary.main,
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      Vaciar Carrito
                    </Button>
                    <Button
                      variant="text"
                      onClick={handleContinuarComprando}
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: "bold",
                      }}
                    >
                      ← Continuar Comprando
                    </Button>
                  </Stack>
                  <Box
                    sx={{
                      textAlign: "center",
                      mt: 2,
                      p: 2,
                      backgroundColor: theme.palette.background.default,
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      <strong>Envío gratis</strong> en compras mayores a $50.000
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        )}
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="info"
          sx={{ width: "100%" }}
        >
          Redirigiendo a Mercado Pago... Se abrirá en una nueva pestaña
        </Alert>
      </Snackbar>

      <AuthModal
        show={showAuthModal}
        handleClose={() => setShowAuthModal(false)}
      />
    </Container>
  );
};

export default CarritoPage;