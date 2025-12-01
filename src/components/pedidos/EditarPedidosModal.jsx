import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Alert,
  DialogContentText,
  useTheme,
} from "@mui/material";
import {
  Edit as EditIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { toast } from "react-hot-toast";
import clientaxios from "../../utils/clientAxios.js";

const EditarPedidosModal = ({
  show,
  onHide,
  pedido,
  onPedidoEditado,
  setPedidos,
}) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    direccionEnvio: "",
    estado: "pendiente",
    productos: [],
  });
  const [cargando, setCargando] = useState(false);
  const [cargandoProductos, setCargandoProductos] = useState(false);
  const [error, setError] = useState("");
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [stockOriginal, setStockOriginal] = useState({});
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);

  useEffect(() => {
    if (show && pedido) {
      cargarProductosDisponibles();
      setFormData({
        direccionEnvio: pedido.direccionEnvio || pedido.direccion || "",
        estado: pedido.estado || "pendiente",
        productos: pedido.productos ? [...pedido.productos] : [],
      });
      setError("");
    }
  }, [show, pedido]);

  const cargarProductosDisponibles = async () => {
    try {
      setCargandoProductos(true);
      const { data } = await clientaxios.get("/productos");
      const productos = Array.isArray(data) ? data : data.productos || [];

      const stockInicial = {};
      productos.forEach((producto) => {
        stockInicial[producto._id] = producto.stock;
      });

      setStockOriginal(stockInicial);
      setProductosDisponibles(productos);
    } catch (error) {
      console.error("Error cargando productos:", error);
      toast.error("No se pudieron cargar los productos disponibles");
    } finally {
      setCargandoProductos(false);
    }
  };

  const calcularStockDisponible = useCallback(
    (productoId) => {
      const stockBase = stockOriginal[productoId] || 0;
      const cantidadOriginalEnPedido =
        pedido?.productos?.find(
          (item) => (item.producto?._id || item.producto) === productoId
        )?.cantidad || 0;

      const stockTotalDisponible = stockBase + cantidadOriginalEnPedido;

      return stockTotalDisponible;
    },
    [stockOriginal, pedido]
  );

  const obtenerProductoInfo = useCallback(
    (productoId) => {
      return productosDisponibles.find((p) => p._id === productoId);
    },
    [productosDisponibles]
  );

  const iniciarEliminarPedido = () => {
    setConfirmarBorrado(true);
  };

  const manejarEliminarPedido = async () => {
    setConfirmarBorrado(false);

    setCargando(true);
    const toastId = toast.loading("Eliminando pedido y restaurando stock...");

    try {
      await clientaxios.delete(`/pedidos/permanent/${pedido._id}`);

      setPedidos((prev) => prev.filter((p) => p._id !== pedido._id));

      toast.success("Pedido eliminado correctamente y stock restaurado", {
        id: toastId,
      });
      onHide();
    } catch (error) {
      console.error("Error al eliminar pedido:", error);
      toast.error("Error al eliminar pedido o restaurar stock", {
        id: toastId,
      });
    } finally {
      setCargando(false);
    }
  };

  const calcularTotal = useCallback(() => {
    return formData.productos.reduce((total, item) => {
      const productoId = item.producto?._id || item.producto;
      const producto = obtenerProductoInfo(productoId);
      const precio = item.precioUnitario || producto?.precio || 0;
      return total + precio * item.cantidad;
    }, 0);
  }, [formData.productos, obtenerProductoInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pedido) return;

    if (cargando) {
      toast.error("Ya se está procesando una actualización");
      return;
    }

    setCargando(true);
    const toastId = toast.loading("Actualizando pedido...");

    try {
      const updateData = {
        estado: formData.estado,
      };

      const { data: responseData } = await clientaxios.put(
        `/pedidos/${pedido._id}`,
        updateData
      );

      onPedidoEditado(responseData.pedido || responseData);
      toast.success("Estado del pedido actualizado exitosamente", {
        id: toastId,
      });
      onHide();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Problema de conexión.";
      toast.error(`Error al actualizar pedido: ${errorMessage}`, {
        id: toastId,
      });
      setError(`Error al actualizar pedido: ${errorMessage}`);
    } finally {
      setCargando(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  if (!pedido) return null;

  const totalCalculado = calcularTotal();

  return (
    <>
      <Dialog
        open={show}
        onClose={onHide}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: theme.palette.background.paper,
            backgroundImage: "none",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 8px 40px rgba(212, 175, 55, 0.15)"
                : "0 8px 40px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: theme.palette.primary.contrastText,
            padding: "24px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <EditIcon sx={{ fontSize: 28 }} />
            <Typography
              variant="h5"
              component="div"
              fontFamily="'Orbitron', sans-serif"
              fontWeight="700"
            >
              Editar Pedido #{pedido._id?.slice(-6)}
            </Typography>
          </Box>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent
            sx={{
              padding: 3,
              backgroundColor: theme.palette.background.default,
            }}
          >
            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(185, 28, 28, 0.15)"
                      : "rgba(239, 68, 68, 0.1)",
                  borderLeft: `4px solid ${theme.palette.error.main}`,
                }}
              >
                {error}
              </Alert>
            )}

            {cargandoProductos && (
              <Alert
                severity="info"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(59, 130, 246, 0.15)"
                      : "rgba(59, 130, 246, 0.1)",
                  borderLeft: `4px solid ${theme.palette.info.main}`,
                }}
              >
                Cargando información de productos...
              </Alert>
            )}

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={7}>
                <Card
                  variant="outlined"
                  sx={{
                    padding: 2.5,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow:
                        theme.palette.mode === "dark"
                          ? "0 4px 20px rgba(212, 175, 55, 0.1)"
                          : "0 4px 20px rgba(0, 0, 0, 0.08)",
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1.5,
                      color: theme.palette.text.secondary,
                      fontWeight: 600,
                    }}
                  >
                    <PersonIcon
                      sx={{
                        fontSize: 20,
                        mr: 1,
                        color: theme.palette.primary.main,
                      }}
                    />
                    Información del Cliente
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      fontFamily: "'Orbitron', sans-serif",
                    }}
                  >
                    {pedido.usuario?.nombre || "Cliente no especificado"}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      mt: 0.5,
                      fontFamily: "'Exo 2', sans-serif",
                    }}
                  >
                    {pedido.usuario?.correo || "Email no disponible"}
                  </Typography>
                </Card>
              </Grid>

              <Grid item xs={12} md={5}>
                <Card
                  variant="outlined"
                  sx={{
                    padding: 2.5,
                    backgroundColor: theme.palette.background.paper,
                    border: `2px solid ${theme.palette.success.main}`,
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow:
                        theme.palette.mode === "dark"
                          ? "0 4px 20px rgba(34, 197, 94, 0.2)"
                          : "0 4px 20px rgba(34, 197, 94, 0.15)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1.5,
                      color: theme.palette.text.secondary,
                      fontWeight: 600,
                    }}
                  >
                    <MoneyIcon
                      sx={{
                        fontSize: 20,
                        mr: 1,
                        color: theme.palette.success.main,
                      }}
                    />
                    Total del Pedido
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.success.main,
                      fontFamily: "'Orbitron', sans-serif",
                    }}
                  >
                    {formatCurrency(totalCalculado)}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontFamily: "'Exo 2', sans-serif",
                    }}
                  >
                    {formData.productos.length} producto(s)
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Dirección de Envío"
                value={formData.direccionEnvio}
                disabled
                multiline
                rows={3}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: theme.palette.action.disabledBackground,
                    "& fieldset": {
                      borderColor: theme.palette.divider,
                    },
                  },
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: theme.palette.text.primary,
                    fontFamily: "'Exo 2', sans-serif",
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "'Exo 2', sans-serif",
                  },
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mt: 0.5,
                  color: theme.palette.text.secondary,
                  fontStyle: "italic",
                  fontFamily: "'Exo 2', sans-serif",
                }}
              >
                La dirección no se puede modificar una vez creado el pedido
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControl
                fullWidth
                sx={{
                  "& .MuiInputLabel-root": {
                    fontFamily: "'Exo 2', sans-serif",
                  },
                  "& .MuiSelect-select": {
                    fontFamily: "'Exo 2', sans-serif",
                  },
                }}
              >
                <InputLabel>Estado del Pedido</InputLabel>
                <Select
                  value={formData.estado}
                  onChange={(e) =>
                    setFormData({ ...formData, estado: e.target.value })
                  }
                  label="Estado del Pedido"
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.divider,
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.primary.main,
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: theme.palette.primary.main,
                      borderWidth: 2,
                    },
                  }}
                >
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                  <MenuItem value="procesando">Procesando</MenuItem>
                  <MenuItem value="enviado">Enviado</MenuItem>
                  <MenuItem value="entregado">Entregado</MenuItem>
                  <MenuItem value="cancelado">Cancelado</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 0.5,
                    fontFamily: "'Orbitron', sans-serif",
                    fontWeight: 700,
                  }}
                >
                  <InventoryIcon sx={{ color: theme.palette.primary.main }} />
                  Productos del Pedido
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontFamily: "'Exo 2', sans-serif",
                  }}
                >
                  Los productos no se pueden modificar una vez creado el pedido
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}
              >
                {formData.productos.map((item, index) => {
                  const productoId = item.producto?._id || item.producto;
                  const producto = obtenerProductoInfo(productoId);
                  const stockDisponible = calcularStockDisponible(productoId);
                  const precio = item.precioUnitario || producto?.precio || 0;
                  const nombreProducto =
                    producto?.nombre ||
                    item.producto?.nombre ||
                    "Producto no disponible";

                  return (
                    <Card
                      key={index}
                      variant="outlined"
                      sx={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderLeft: `4px solid ${theme.palette.primary.main}`,
                        borderRadius: 2,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow:
                            theme.palette.mode === "dark"
                              ? "0 4px 20px rgba(212, 175, 55, 0.15)"
                              : "0 4px 20px rgba(0, 0, 0, 0.1)",
                          transform: "translateX(8px)",
                        },
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                          }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="body1"
                              fontWeight="600"
                              sx={{
                                mb: 1,
                                fontFamily: "'Orbitron', sans-serif",
                                color: theme.palette.text.primary,
                              }}
                            >
                              {nombreProducto}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                alignItems: "center",
                                flexWrap: "wrap",
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  color: theme.palette.text.secondary,
                                  fontFamily: "'Exo 2', sans-serif",
                                  fontWeight: 600,
                                }}
                              >
                                {formatCurrency(precio)} c/u
                              </Typography>
                              <Chip
                                label={`Stock: ${stockDisponible}`}
                                sx={{
                                  backgroundColor:
                                    stockDisponible > 0
                                      ? theme.palette.success.main
                                      : theme.palette.error.main,
                                  color: "white",
                                  fontWeight: 600,
                                  fontFamily: "'Exo 2', sans-serif",
                                }}
                                size="small"
                                variant="filled"
                              />
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <TextField
                              value={item.cantidad ?? 1}
                              disabled
                              type="number"
                              size="small"
                              sx={{
                                width: 80,
                                "& .MuiInputBase-input.Mui-disabled": {
                                  WebkitTextFillColor:
                                    theme.palette.text.primary,
                                  fontWeight: 600,
                                  textAlign: "center",
                                  fontFamily: "'Exo 2', sans-serif",
                                },
                                "& .MuiOutlinedInput-root": {
                                  backgroundColor:
                                    theme.palette.action.disabledBackground,
                                },
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                color: theme.palette.text.secondary,
                                fontFamily: "'Exo 2', sans-serif",
                              }}
                            >
                              unidades
                            </Typography>
                          </Box>
                        </Box>

                        {stockDisponible === 0 && (
                          <Alert
                            severity="error"
                            sx={{
                              mt: 1,
                              py: 0,
                              backgroundColor:
                                theme.palette.mode === "dark"
                                  ? "rgba(185, 28, 28, 0.15)"
                                  : "rgba(239, 68, 68, 0.1)",
                            }}
                          >
                            Sin stock disponible
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>

              <Card
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  border: `2px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="body1"
                      fontWeight="600"
                      sx={{ fontFamily: "'Exo 2', sans-serif" }}
                    >
                      Subtotal:
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: "'Exo 2', sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      {formatCurrency(totalCalculado)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontFamily: "'Exo 2', sans-serif",
                      }}
                    >
                      Productos: {formData.productos.length}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        fontFamily: "'Exo 2', sans-serif",
                      }}
                    >
                      Items totales:{" "}
                      {formData.productos.reduce(
                        (sum, item) => sum + item.cantidad,
                        0
                      )}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 2,
                      pt: 2,
                      borderTop: `2px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="700"
                      sx={{ fontFamily: "'Orbitron', sans-serif" }}
                    >
                      Total Final:
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight="700"
                      color="success.main"
                      sx={{ fontFamily: "'Orbitron', sans-serif" }}
                    >
                      {formatCurrency(totalCalculado)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </DialogContent>

          <DialogActions
            sx={{
              padding: 3,
              gap: 1,
              backgroundColor: theme.palette.background.default,
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Button
              onClick={iniciarEliminarPedido}
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              disabled={cargando}
              sx={{
                fontFamily: "'Exo 2', sans-serif",
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
                "&:hover": {
                  boxShadow: "0 6px 20px rgba(239, 68, 68, 0.4)",
                },
              }}
            >
              Eliminar Pedido
            </Button>

            <Box sx={{ flex: 1 }} />

            <Button
              onClick={onHide}
              variant="outlined"
              disabled={cargando}
              sx={{
                color: theme.palette.text.primary,
                borderColor: theme.palette.divider,
                fontFamily: "'Exo 2', sans-serif",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={cargando}
              startIcon={
                cargando ? <CircularProgress size={16} /> : <EditIcon />
              }
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                fontFamily: "'Exo 2', sans-serif",
                fontWeight: 600,
                textTransform: "none",
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 4px 15px rgba(212, 175, 55, 0.3)"
                    : "0 4px 15px rgba(185, 28, 28, 0.3)",
                "&:hover": {
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 6px 20px rgba(212, 175, 55, 0.4)"
                      : "0 6px 20px rgba(185, 28, 28, 0.4)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              {cargando ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={confirmarBorrado}
        onClose={() => setConfirmarBorrado(false)}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: theme.palette.background.paper,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 8px 40px rgba(185, 28, 28, 0.3)"
                : "0 8px 40px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            color: theme.palette.error.main,
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 700,
          }}
        >
          <WarningIcon sx={{ mr: 1, fontSize: 30 }} />
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              color: theme.palette.text.primary,
              fontFamily: "'Exo 2', sans-serif",
            }}
          >
            Estás a punto de{" "}
            <strong>
              eliminar permanentemente el Pedido # {pedido?._id?.slice(-6)}
            </strong>
            . Esta acción no se puede deshacer y el stock de los productos será
            restaurado. ¿Estás seguro de que deseas proceder?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <Button
            onClick={() => setConfirmarBorrado(false)}
            color="primary"
            variant="outlined"
            sx={{
              fontFamily: "'Exo 2', sans-serif",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={manejarEliminarPedido}
            color="error"
            variant="contained"
            autoFocus
            startIcon={
              cargando ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <DeleteIcon />
              )
            }
            disabled={cargando}
            sx={{
              fontFamily: "'Exo 2', sans-serif",
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
              "&:hover": {
                boxShadow: "0 6px 20px rgba(239, 68, 68, 0.4)",
              },
            }}
          >
            {cargando ? "Eliminando..." : "Sí, Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditarPedidosModal;
