import React from "react";
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
} from "@mui/material";
import {
  Add,
  Remove,
  Delete,
  ShoppingBag,
  LocalOffer,
  Payment,
  ArrowBack,
  ShoppingCart,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart";

const colors = {
  primary: "#000000",
  background: "#F5F5F5",
  accent: "#B91C1C",
  secondary: "#D4AF37",
  neutral: "#404040",
};
const CartItemSkeleton = () => (
  <Card sx={{ p: 2, borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
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
const OrderSummarySkeleton = () => (
  <Card sx={{ borderRadius: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
    <CardContent>
      <Skeleton variant="text" width="60%" height={32} sx={{ mb: 2 }} />
      
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Skeleton variant="text" width="30%" height={20} />
          <Skeleton variant="text" width="20%" height={20} />
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Skeleton variant="text" width="20%" height={28} />
          <Skeleton variant="text" width="40%" height={36} />
        </Box>
      </Box>


      <Box sx={{ p: 2, backgroundColor: "#FEF3C7", borderRadius: 2, mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width="70%" height={20} />
          <Skeleton variant="text" width="20%" height={20} />
        </Box>
      </Box>

      <Stack spacing={1}>
        <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
        <Skeleton variant="text" width="50%" height={32} />
      </Stack>

      <Box sx={{ mt: 2, p: 2, backgroundColor: colors.background, borderRadius: 2 }}>
        <Skeleton variant="text" width="100%" height={20} />
      </Box>
    </CardContent>
  </Card>
);

const CarritoPage = () => {
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
  const navigate = useNavigate();

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

  const handleProcederPago = () => {
    console.log("Proceder al pago");
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
        
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          component={Link}
          to="/productos"
          sx={{ mb: 2, color: colors.neutral }}
        >
          Volver a productos
        </Button>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <ShoppingCart sx={{ fontSize: 40, color: colors.primary }} />
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Tu Carrito de Compras
            </Typography>
            <Typography variant="h6" color={colors.neutral}>
              {totalArticulos} {totalArticulos === 1 ? "producto" : "productos"}{" "}
              en tu carrito
            </Typography>
          </Box>
          {articulos.length > 0 && (
            <Chip
              label={`${totalArticulos} items`}
              sx={{
                backgroundColor: colors.accent,
                color: "white",
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
          {articulos.length === 0 ? (
            <Card
              sx={{
                textAlign: "center",
                py: 8,
                backgroundColor: colors.background,
              }}
            >
              <CardContent>
                <ShoppingBag
                  sx={{
                    fontSize: 80,
                    color: colors.neutral,
                    mb: 2,
                    opacity: 0.5,
                  }}
                />
                <Typography variant="h5" color={colors.neutral} gutterBottom>
                  Tu carrito está vacío
                </Typography>
                <Typography
                  variant="body1"
                  color={colors.neutral}
                  sx={{ mb: 3, opacity: 0.7 }}
                >
                  Descubre nuestros productos y encuentra lo que necesitas
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleContinuarComprando}
                  sx={{
                    backgroundColor: colors.primary,
                    "&:hover": { backgroundColor: colors.neutral },
                  }}
                >
                  Explorar Productos
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Stack spacing={2}>
              {loading ? (
                [...Array(articulos.length)].map((_, index) => (
                  <CartItemSkeleton key={index} />
                ))
              ) : (
                articulos.map((producto) => (
                  <Card
                    key={producto.idProducto}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                            backgroundColor: colors.background,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: `2px solid ${colors.secondary}`,
                          }}
                        >
                          {producto.imagen ? (
                            <img 
                              src={producto.imagen} 
                              alt={producto.nombre}
                              style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover',
                                borderRadius: 2
                              }}
                            />
                          ) : (
                            <ShoppingBag sx={{ color: colors.neutral, opacity: 0.5 }} />
                          )}
                        </Box>
                      </Badge>

                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color={colors.primary}
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
                          color={colors.accent}
                        >
                          ${producto.precio?.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color={colors.neutral}>
                          Subtotal: $
                          {(producto.precio * producto.cantidad).toLocaleString()}
                        </Typography>
                      </Box>

                      <Stack spacing={1} alignItems="flex-end">
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleDecrementar(producto)}
                            disabled={loading || producto.cantidad <= 1}
                            sx={{
                              border: `1px solid ${colors.neutral}`,
                              "&:hover": { backgroundColor: colors.background },
                            }}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            sx={{ minWidth: 30, textAlign: "center" }}
                          >
                            {producto.cantidad}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleIncrementar(producto)}
                            disabled={loading}
                            sx={{
                              border: `1px solid ${colors.neutral}`,
                              "&:hover": { backgroundColor: colors.background },
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
                            color: colors.accent,
                            "&:hover": { backgroundColor: "#FEE2E2" },
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Stack>
                    </Box>
                  </Card>
                ))
              )}
            </Stack>
          )}
        </Box>
        
        {articulos.length > 0 && (
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
                }}
              >
                <CardContent>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
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
                      <Typography variant="body2">Productos:</Typography>
                      <Typography variant="body2" fontWeight="bold">
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
                      <Typography variant="h6">Total:</Typography>
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{ color: colors.accent }}
                      >
                        ${precioTotal?.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      p: 2,
                      backgroundColor: "#FEF3C7",
                      borderRadius: 2,
                      border: `1px dashed ${colors.secondary}`,
                      mb: 2,
                    }}
                  >
                    <LocalOffer sx={{ color: colors.secondary }} />
                    <Typography
                      variant="body2"
                      sx={{ color: colors.neutral, flex: 1 }}
                    >
                      ¿Tienes un cupón de descuento?
                    </Typography>
                    <Button
                      size="small"
                      sx={{
                        color: colors.secondary,
                        fontWeight: "bold",
                        textTransform: "none",
                      }}
                    >
                      Aplicar
                    </Button>
                  </Box>

                  <Stack spacing={1}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<Payment />}
                      disabled={loading}
                      onClick={handleProcederPago}
                      sx={{
                        backgroundColor: colors.accent,
                        "&:hover": { backgroundColor: "#991B1B" },
                        py: 1.5,
                        fontWeight: "bold",
                      }}
                    >
                      Proceder al Pago
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={limpiarCarrito}
                      disabled={loading}
                      sx={{
                        borderColor: colors.neutral,
                        color: colors.neutral,
                        "&:hover": {
                          borderColor: colors.accent,
                          backgroundColor: "#FEE2E2",
                        },
                      }}
                    >
                      Vaciar Carrito
                    </Button>
                    <Button
                      variant="text"
                      onClick={handleContinuarComprando}
                      sx={{ color: colors.primary, fontWeight: "bold" }}
                    >
                      ← Continuar Comprando
                    </Button>
                  </Stack>

                  <Box
                    sx={{
                      textAlign: "center",
                      mt: 2,
                      p: 2,
                      backgroundColor: colors.background,
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2" color={colors.neutral}>
                      🚚 <strong>Envío gratis</strong> en compras mayores a
                      $50.000
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default CarritoPage;