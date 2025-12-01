import React, { useState, useCallback } from "react";
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
  TextField,
  CircularProgress,
} from "@mui/material";
import {
  Delete,
  ShoppingBag,
  Payment,
  ArrowBack,
  ShoppingCart,
  Add,
  Remove,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import useCart from "../../hooks/useCart";
import { useMercadoPago } from "../../hooks/useMercadoPago";
import { useStore } from "../../hooks/useStore";
import AuthModal from "../../components/auth/AuthModal";
import clientAxios from "../../utils/clientAxios";
import { usePageTitle } from "../../hooks/usePageTitle";

const MAX_STOCK_QUANTITY_GLOBAL = 2000;
const LOW_STOCK_THRESHOLD = 5;

const CartItemSkeleton = () => (
  <Card sx={{ mb: 2, p: 2 }}>
    <Box sx={{ display: "flex", gap: 2 }}>
      <Skeleton
        variant="rectangular"
        width={80}
        height={80}
        sx={{ borderRadius: 2 }}
      />
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="60%" height={32} />
        <Skeleton variant="text" width="30%" height={24} />
      </Box>
    </Box>
  </Card>
);

const OrderSummarySkeleton = () => (
  <Card sx={{ p: 2 }}>
    <Skeleton variant="text" width="50%" height={40} sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" height={48} />
  </Card>
);

const CarritoPage = () => {
  usePageTitle("Carrito de Compras");
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
  const [direccion, setDireccion] = useState("");
  const [errorDireccion, setErrorDireccion] = useState("");
  const [tempQuantities, setTempQuantities] = useState({});
  const [actualizandoId, setActualizandoId] = useState(null);

  const handleStepChange = useCallback(
    async (idProducto, delta, stockReal) => {
      const productoActual = articulos.find((p) => p.idProducto === idProducto);
      if (!productoActual || loading) return;

      let nuevaCantidad = productoActual.cantidad + delta;
      const limiteMaximo = Math.min(stockReal, MAX_STOCK_QUANTITY_GLOBAL);

      if (delta === -1 && nuevaCantidad < 1) {
        nuevaCantidad = 1;
      } else if (delta === 1 && nuevaCantidad > limiteMaximo) {
        nuevaCantidad = limiteMaximo;
      }

      if (nuevaCantidad >= 1 && productoActual.cantidad !== nuevaCantidad) {
        setActualizandoId(idProducto);

        await actualizarCantidad(idProducto, nuevaCantidad);

        setActualizandoId(null);
        setTempQuantities((prev) => ({
          ...prev,
          [idProducto]: nuevaCantidad.toString(),
        }));
      }
    },
    [articulos, loading, actualizarCantidad]
  );

  const handleManualChange = useCallback((idProducto, e) => {
    setTempQuantities((prev) => ({ ...prev, [idProducto]: e.target.value }));
  }, []);

  const handleBlur = useCallback(
    async (idProducto, e, stockReal, productoActual) => {
      let valorInput = e.target.value;
      let nuevaCantidad = Number(valorInput);

      if (!productoActual) return;

      if (
        valorInput === "" ||
        isNaN(nuevaCantidad) ||
        !Number.isInteger(nuevaCantidad) ||
        nuevaCantidad <= 0
      ) {
        if (productoActual.cantidad !== 1) {
          setActualizandoId(idProducto);
          await actualizarCantidad(idProducto, 1);
          setActualizandoId(null);
        }
        setTempQuantities((prev) => ({ ...prev, [idProducto]: "1" }));
        return;
      }

      let cantidadAEnviar = nuevaCantidad;
      const limiteMaximo = Math.min(stockReal, MAX_STOCK_QUANTITY_GLOBAL);

      if (cantidadAEnviar > limiteMaximo) {
        cantidadAEnviar = limiteMaximo;
      }

      if (productoActual.cantidad !== cantidadAEnviar) {
        setActualizandoId(idProducto);
        await actualizarCantidad(idProducto, cantidadAEnviar);
        setActualizandoId(null);
      }

      setTempQuantities((prev) => ({
        ...prev,
        [idProducto]: cantidadAEnviar.toString(),
      }));
    },
    [actualizarCantidad]
  );

  const renderQuantityControl = (producto) => {
    const { idProducto, cantidad } = producto;
    const stockReal = producto.stock || 0;
    const limiteMaximo = Math.min(stockReal, MAX_STOCK_QUANTITY_GLOBAL);
    const hayErrorStock = cantidad > limiteMaximo || stockReal === 0;
    const inputValue =
      tempQuantities[idProducto] !== undefined
        ? tempQuantities[idProducto]
        : cantidad.toString();

    const estaActualizando = actualizandoId === idProducto;

    if (stockReal === 0) {
      return (
        <TextField
          value={0}
          disabled
          size="small"
          error
          sx={{ minWidth: 90 }}
        />
      );
    }

    return (
      <Stack
        direction="row"
        spacing={0}
        alignItems="center"
        sx={{ minWidth: 120, position: "relative" }}
      >
        <IconButton
          size="small"
          onClick={() => handleStepChange(idProducto, -1, stockReal)}
          disabled={loading || cantidad <= 1 || estaActualizando}
          sx={{
            p: 0.5,
            borderRadius: 1,
          }}
        >
          <Remove fontSize="small" />
        </IconButton>
        <Box sx={{ position: "relative", mx: 0.5 }}>
          <TextField
            type="number"
            value={inputValue}
            onChange={(e) => handleManualChange(idProducto, e)}
            onBlur={(e) => handleBlur(idProducto, e, stockReal, producto)}
            inputProps={{
              min: 1,
              max: limiteMaximo,
              style: {
                textAlign: "center",
                padding: "8px 4px",
              },
            }}
            disabled={loading || estaActualizando}
            size="small"
            error={hayErrorStock}
            sx={{
              width: 50,
              "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                {
                  WebkitAppearance: "none",
                  margin: 0,
                },
              "& input[type=number]": {
                MozAppearance: "textfield",
              },
            }}
          />
          {estaActualizando && (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
              }}
            >
              <CircularProgress
                size={24}
                sx={{
                  color: theme.palette.primary.main,
                }}
              />
            </Box>
          )}
        </Box>
        <IconButton
          size="small"
          onClick={() => handleStepChange(idProducto, 1, stockReal)}
          disabled={loading || cantidad >= limiteMaximo || estaActualizando}
          sx={{
            p: 0.5,
            borderRadius: 1,
          }}
        >
          <Add fontSize="small" />
        </IconButton>
      </Stack>
    );
  };

  const handleEliminar = async (producto) => {
    await quitarDelCarrito(producto.idProducto);
  };

  const handleContinuarComprando = () => {
    navigate("/");
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleFinalizarCompra = async () => {
    if (articulos.length === 0) return;

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!direccion.trim()) {
      setErrorDireccion("Por favor ingresa una dirección de envío");
      return;
    }
    setErrorDireccion("");

    try {
      const pedidoData = {
        usuario: user._id || user.id,
        productos: articulos.map((item) => ({
          producto: item.idProducto,
          cantidad: item.cantidad,
          precioUnitario: item.precio,
        })),
        total: precioTotal,
        direccion: direccion.trim(),
        estado: "pendiente",
      };

      const { data } = await clientAxios.post("/pedidos", pedidoData);

      const pedidoId = data.pedido?._id || data._id;

      if (pedidoId) {
        const result = await crearPreferencia(articulos, user.correo, pedidoId);

        if (!result.success) {
          alert(
            "Pedido creado pero hubo un error al iniciar el pago: " +
              result.error
          );
          limpiarCarrito();
          navigate("/mis-pedidos");
        }
      } else {
        limpiarCarrito();
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate("/mis-pedidos");
        }, 2000);
      }
    } catch (error) {
      console.error("Error al crear pedido:", error);
      alert(
        "Hubo un error al procesar tu pedido. Por favor intenta nuevamente."
      );
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
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          component={Link}
          to="/"
          sx={{ mb: 2, color: theme.palette.text.secondary }}
        >
          Volver a Inicio
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
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  Inicia sesión para ver tu carrito
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
                : articulos.map((producto) => {
                    const stockReal = producto.stock || 0;
                    const limiteMaximo = Math.min(
                      stockReal,
                      MAX_STOCK_QUANTITY_GLOBAL
                    );
                    const hayErrorStock =
                      producto.cantidad > limiteMaximo || stockReal === 0;
                    const stockDisponible = stockReal;
                    let stockText;
                    let stockColor;

                    if (stockDisponible === 0) {
                      stockText = "¡AGOTADO!";
                      stockColor = theme.palette.error.main;
                    } else if (stockDisponible <= LOW_STOCK_THRESHOLD) {
                      stockText = `¡Poco Stock! (${stockDisponible} u.)`;
                      stockColor = theme.palette.warning.dark;
                    } else {
                      stockText = `Stock disponible: ${stockDisponible}`;
                      stockColor = theme.palette.success.main;
                    }

                    return (
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
                            color={hayErrorStock ? "warning" : "error"}
                            overlap="circular"
                          >
                            <Box
                              sx={{
                                width: 80,
                                height: 80,
                                borderRadius: 2,
                                backgroundColor:
                                  theme.palette.background.default,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: `2px solid ${theme.palette.primary.main}`,
                              }}
                            >
                              {producto.imagenes &&
                              producto.imagenes.length > 0 ? (
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
                              sx={{ mb: 0.5 }}
                            >
                              ${producto.precio?.toLocaleString()}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 0.5 }}
                            >
                              Subtotal: $
                              {(
                                producto.precio * producto.cantidad
                              ).toLocaleString()}
                            </Typography>
                            <Typography
                              variant="caption"
                              fontWeight="bold"
                              color={stockColor}
                              sx={{ lineHeight: 1.2, display: "block" }}
                            >
                              {stockText}
                            </Typography>
                          </Box>
                          <Stack spacing={1} alignItems="flex-end">
                            <Box sx={{ minWidth: 120, maxWidth: 140 }}>
                              {renderQuantityControl(producto)}
                            </Box>
                            {stockReal > 0 &&
                              producto.cantidad >= limiteMaximo && (
                                <Typography
                                  variant="caption"
                                  color={"error"}
                                  sx={{
                                    mt: 0.5,
                                    lineHeight: 1.2,
                                    fontWeight: "bold",
                                  }}
                                >
                                  Máximo alcanzado ({limiteMaximo} uds.)
                                </Typography>
                              )}
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
                    );
                  })}
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

                  <Box sx={{ mb: 3 }}>
                    <TextField
                      label="Dirección de envío"
                      fullWidth
                      variant="outlined"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      error={!!errorDireccion}
                      helperText={errorDireccion}
                      placeholder="Calle 123, Ciudad"
                      size="small"
                    />
                  </Box>

                  <Stack spacing={1}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<Payment />}
                      disabled={loading || loadingPayment}
                      onClick={handleFinalizarCompra}
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
                      {loadingPayment ? "Procesando..." : "Finalizar Compra"}
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
          severity="success"
          sx={{ width: "100%" }}
        >
          ¡Pedido creado con éxito! Redirigiendo a tus pedidos...
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
