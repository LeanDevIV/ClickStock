import React, { useState, useEffect, useCallback } from "react";
import clientAxios from "../../utils/clientAxios";
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
  IconButton,
  useTheme,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  List as ListIcon,
  Store as StoreIcon,
  AttachMoney as MoneyIcon,
  AddCircle as AddCircleIcon,
} from "@mui/icons-material";
import { Toaster, toast } from "react-hot-toast";
import "../../styles/crearPedidosModal.css";

const CrearPedidosModal = ({ show, onHide, onPedidoCreado }) => {
  const theme = useTheme();
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [formData, setFormData] = useState({
    usuarioId: "",
    direccionEnvio: "",
  });
  const [errores, setErrores] = useState({
    direccionEnvio: "",
  });
  const [cargando, setCargando] = useState(false);
  const [errorUsuarios, setErrorUsuarios] = useState("");
  const [errorProductos, setErrorProductos] = useState("");
  const [cargandoUsuarios, setCargandoUsuarios] = useState(false);
  const [cargandoProductos, setCargandoProductos] = useState(false);

  useEffect(() => {
    if (show) {
      cargarUsuarios();
      cargarProductos();
      resetForm();
      const interval = setInterval(cargarProductos, 30000);
      return () => clearInterval(interval);
    }
  }, [show, cargarUsuarios, cargarProductos, resetForm]);

  const resetForm = useCallback(() => {
    setInventario([]);
    setFormData({ usuarioId: "", direccionEnvio: "" });
    setErrores({ direccionEnvio: "" });
    setErrorUsuarios("");
    setErrorProductos("");
    setCargando(false);
    setCargandoUsuarios(false);
    setCargandoProductos(false);
  }, []);

  const cargarUsuarios = useCallback(async () => {
    try {
      setCargandoUsuarios(true);
      setErrorUsuarios("");

      const { data } = await clientAxios.get("/usuarios");
      const usuariosData = Array.isArray(data) ? data : data.usuarios || [];
      setUsuarios(usuariosData);
      if (usuariosData.length === 0)
        setErrorUsuarios("No se encontraron usuarios");
    } catch (error) {
      setErrorUsuarios(error.message || "Error al cargar usuarios");
    } finally {
      setCargandoUsuarios(false);
    }
  }, []);

  const cargarProductos = useCallback(async () => {
    try {
      setCargandoProductos(true);
      setErrorProductos("");
      const { data } = await clientAxios.get("/productos");
      const productosData = Array.isArray(data)
        ? data
        : data.productos || data.data || [];
      setProductos(productosData);

      setInventario((prevInventario) => {
        const inventarioActualizado = prevInventario
          .map((item) => {
            const productoActual = productosData.find(
              (p) => p._id === item.producto._id
            );
            return productoActual
              ? { ...item, producto: productoActual }
              : item;
          })
          .filter((item) => item.producto.stock > 0);
        return inventarioActualizado;
      });
    } catch (error) {
      console.error(error);
      setErrorProductos("No se pudieron cargar los productos reales");
    } finally {
      setCargandoProductos(false);
    }
  }, []);

  const verificarStockDisponible = async (productoId) => {
    try {
      const { data } = await clientAxios.get(`/productos/${productoId}`);
      return data.stock || 0;
    } catch (error) {
      console.error("Error al verificar stock:", error);
      return 0;
    }
  };

  const validarDireccion = (direccion) => {
    if (!direccion || direccion.trim() === "") {
      return "La dirección es obligatoria";
    }
    if (direccion.trim().length < 10) {
      return "La dirección debe tener al menos 10 caracteres";
    }
    if (direccion.trim().length > 200) {
      return "La dirección no puede exceder los 200 caracteres";
    }
    const tieneNumero = /\d/.test(direccion);
    const tieneTexto = /[a-zA-Z]/.test(direccion);
    if (!tieneNumero || !tieneTexto) {
      return "La dirección debe incluir número y nombre de calle";
    }
    return "";
  };

  const manejarCambioDireccion = (e) => {
    const nuevaDireccion = e.target.value;
    setFormData({ ...formData, direccionEnvio: nuevaDireccion });
    if (nuevaDireccion.length > 0) {
      const error = validarDireccion(nuevaDireccion);
      setErrores({ ...errores, direccionEnvio: error });
    } else {
      setErrores({ ...errores, direccionEnvio: "" });
    }
  };

  const validarPedidoCompleto = () => {
    if (!formData.usuarioId) return "Selecciona un cliente";
    if (inventario.length === 0) return "Agrega al menos un producto";
    for (const item of inventario) {
      if (item.cantidad > item.producto.stock) {
        return `Stock insuficiente para ${item.producto.nombre}`;
      }
      if (item.cantidad < 1) {
        return `Cantidad inválida para ${item.producto.nombre}`;
      }
    }
    const errorDireccion = validarDireccion(formData.direccionEnvio);
    if (errorDireccion) return errorDireccion;
    return null;
  };

  const agregarAlInventario = async (producto) => {
    if (producto.stock <= 0) {
      toast.error("Producto sin stock disponible");
      return;
    }
    const stockActual = await verificarStockDisponible(producto._id);
    if (stockActual <= 0) {
      toast.error("Producto sin stock disponible");
      cargarProductos();
      return;
    }
    const existe = inventario.find(
      (item) => item.producto._id === producto._id
    );
    if (existe) {
      if (existe.cantidad >= stockActual) {
        toast.error(`Stock máximo: ${stockActual}`);
        return;
      }
      setInventario(
        inventario.map((item) =>
          item.producto._id === producto._id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      setInventario([
        ...inventario,
        {
          producto: { ...producto, stock: stockActual },
          cantidad: 1,
          precioUnitario: producto.precio,
        },
      ]);
    }
  };

  const removerDelInventario = (productoId) => {
    setInventario(
      inventario.filter((item) => item.producto._id !== productoId)
    );
  };

  const actualizarCantidad = async (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      removerDelInventario(productoId);
      return;
    }
    const stockActual = await verificarStockDisponible(productoId);
    if (nuevaCantidad > stockActual) {
      toast.error(`Stock máximo: ${stockActual}`);
      cargarProductos();
      return;
    }
    setInventario(
      inventario.map((item) =>
        item.producto._id === productoId
          ? { ...item, cantidad: nuevaCantidad }
          : item
      )
    );
  };

  const calcularTotal = () => {
    return inventario.reduce(
      (total, item) => total + item.precioUnitario * item.cantidad,
      0
    );
  };

  const crearPedido = async () => {
    if (cargando) {
      toast.error("Ya se está creando un pedido");
      return;
    }
    const errorValidacion = validarPedidoCompleto();
    if (errorValidacion) {
      toast.error(errorValidacion);
      return;
    }
    setCargando(true);
    const toastId = toast.loading("Creando pedido...");
    try {
      for (const item of inventario) {
        const stockActual = await verificarStockDisponible(item.producto._id);
        if (item.cantidad > stockActual) {
          throw new Error(
            `Stock insuficiente para ${item.producto.nombre}. Disponible: ${stockActual}`
          );
        }
      }
      const pedidoData = {
        usuario: formData.usuarioId,
        productos: inventario.map((item) => ({
          producto: item.producto._id,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
        })),
        total: calcularTotal(),
        direccion: formData.direccionEnvio.trim(),
        estado: "pendiente",
      };
      const { data } = await clientAxios.post("/pedidos", pedidoData);
      onPedidoCreado(data.pedido || data);
      toast.success("Pedido creado exitosamente", { id: toastId });
      onHide();
    } catch (error) {
      toast.error(`Error al crear pedido: ${error.message}`, { id: toastId });
      cargarProductos();
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

  return (
    <>
      <Dialog
        open={show}
        onClose={onHide}
        maxWidth="lg"
        fullWidth
        className="modal-crear-pedido"
      >
        <DialogTitle className="header-modal-crear">
          <Box className="titulo-modal-crear">
            <AddCircleIcon />
            <Typography variant="h5">Cargar un pedido manualmente</Typography>
          </Box>
        </DialogTitle>
        <DialogContent
          className="contenido-modal-crear"
          sx={{ backgroundColor: theme.palette.background.default }}
        >
          {errorUsuarios && (
            <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
              <strong>Aviso:</strong> {errorUsuarios}
            </Alert>
          )}

          <Grid container spacing={3} className="seccion-cliente-direccion">
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: theme.palette.text.primary }}>
                  Cliente
                </InputLabel>
                {cargandoUsuarios ? (
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: 1, p: 2 }}
                  >
                    <CircularProgress size={20} />
                    <Typography sx={{ color: theme.palette.text.primary }}>
                      Cargando clientes...
                    </Typography>
                  </Box>
                ) : (
                  <Select
                    value={formData.usuarioId}
                    onChange={(e) =>
                      setFormData({ ...formData, usuarioId: e.target.value })
                    }
                    label="Cliente"
                    sx={{ color: theme.palette.text.primary }}
                  >
                    <MenuItem value="">Selecciona un cliente</MenuItem>
                    {usuarios.map((usuario) => (
                      <MenuItem
                        key={usuario._id}
                        value={usuario._id}
                        sx={{ color: theme.palette.text.primary }}
                      >
                        {usuario.nombre} - {usuario.correo}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Dirección de Envío"
                value={formData.direccionEnvio}
                onChange={manejarCambioDireccion}
                onBlur={() => {
                  const error = validarDireccion(formData.direccionEnvio);
                  setErrores({ ...errores, direccionEnvio: error });
                }}
                error={!!errores.direccionEnvio}
                helperText={
                  errores.direccionEnvio ||
                  "Ej: Av. Corrientes 1234, Buenos Aires"
                }
                placeholder="Ingresa la dirección completa"
                multiline
                rows={2}
                inputProps={{ maxLength: 200 }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 0.5 }}
              >
                {formData.direccionEnvio.length}/200 caracteres
              </Typography>
            </Grid>
          </Grid>

          <Box className="seccion-productos">
            <Box className="contenedor-productos-inventario">
              <Card className="tarjeta-seccion">
                <Typography
                  variant="h6"
                  className="titulo-seccion"
                  sx={{ color: theme.palette.text.primary }}
                >
                  <StoreIcon />
                  Productos Disponibles
                </Typography>

                {errorProductos && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    {errorProductos}
                  </Alert>
                )}

                {cargandoProductos ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <Box className="lista-productos">
                    {productos.map((producto) => (
                      <Card
                        key={producto._id}
                        className="tarjeta-producto"
                        onClick={() => agregarAlInventario(producto)}
                        sx={{
                          cursor:
                            producto.stock > 0 ? "pointer" : "not-allowed",
                          opacity: producto.stock > 0 ? 1 : 0.6,
                        }}
                      >
                        <CardContent className="contenido-producto">
                          <Typography
                            className="nombre-producto"
                            sx={{ color: "black" }}
                          >
                            {producto.nombre}
                          </Typography>
                          <Typography
                            className="descripcion-producto"
                            sx={{ color: "black" }}
                          >
                            {producto.descripcion}
                          </Typography>
                          <Box className="precio-stock">
                            <Typography
                              className="precio-producto"
                              sx={{ color: "black !important" }}
                            >
                              {formatCurrency(producto.precio)}
                            </Typography>
                            <Chip
                              label={`Stock: ${producto.stock}`}
                              color={producto.stock > 0 ? "success" : "error"}
                              size="small"
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </Card>

              <Card className="tarjeta-seccion">
                <Typography
                  variant="h6"
                  className="titulo-seccion"
                  sx={{ color: theme.palette.text.primary }}
                >
                  <ListIcon />
                  Inventario del Pedido
                </Typography>

                <Box className="lista-inventario">
                  {inventario.length === 0 ? (
                    <Box className="estado-vacio">
                      <ListIcon
                        sx={{
                          fontSize: 48,
                          mb: 2,
                          color: theme.palette.text.secondary,
                        }}
                      />
                      <Typography
                        variant="h6"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        No hay productos en el inventario
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        Haz clic en los productos para agregarlos
                      </Typography>
                    </Box>
                  ) : (
                    inventario.map((item) => (
                      <Card
                        key={item.producto._id}
                        className="tarjeta-inventario"
                      >
                        <CardContent className="contenido-inventario">
                          <Box className="info-producto-inventario">
                            <Typography
                              variant="body1"
                              fontWeight="600"
                              sx={{ color: theme.palette.text.primary }}
                            >
                              {item.producto.nombre}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "black !important" }}
                            >
                              {formatCurrency(item.precioUnitario)} c/u
                            </Typography>
                          </Box>

                          <Box className="controles-cantidad">
                            <Box className="botones-cantidad">
                              <IconButton
                                size="small"
                                onClick={() =>
                                  actualizarCantidad(
                                    item.producto._id,
                                    item.cantidad - 1
                                  )
                                }
                                className="boton-cantidad"
                                sx={{ color: theme.palette.text.primary }}
                              >
                                <RemoveIcon />
                              </IconButton>

                              <TextField
                                value={item.cantidad}
                                onChange={(e) =>
                                  actualizarCantidad(
                                    item.producto._id,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                type="number"
                                size="small"
                                className="input-cantidad"
                              />

                              <IconButton
                                size="small"
                                onClick={() =>
                                  actualizarCantidad(
                                    item.producto._id,
                                    item.cantidad + 1
                                  )
                                }
                                className="boton-cantidad"
                                sx={{ color: theme.palette.text.primary }}
                              >
                                <AddIcon />
                              </IconButton>
                            </Box>

                            <IconButton
                              size="small"
                              onClick={() =>
                                removerDelInventario(item.producto._id)
                              }
                              className="boton-eliminar"
                              sx={{ color: theme.palette.error.main }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>

                          <Box sx={{ textAlign: "right", mt: 1 }}>
                            <Chip
                              label={`Subtotal: ${formatCurrency(
                                item.precioUnitario * item.cantidad
                              )}`}
                              color="primary"
                              size="small"
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </Box>

                {inventario.length > 0 && (
                  <Box
                    sx={{
                      background:
                        "linear-gradient(135deg, #083628ff 0%, #08684aff 100%)",
                      color: "white",
                      borderRadius: "12px",
                      padding: "20px",
                      marginTop: "16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: "700",
                        fontSize: "1.1rem",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <MoneyIcon sx={{ mr: 1 }} />
                      Total:
                    </Typography>
                    <Typography sx={{ fontSize: "1.5rem", fontWeight: "700" }}>
                      {formatCurrency(calcularTotal())}
                    </Typography>
                  </Box>
                )}
              </Card>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions
          className="contenedor-botones-crear"
          sx={{ backgroundColor: theme.palette.background.default }}
        >
          <Button
            onClick={onHide}
            className="boton-cancelar-crear"
            variant="outlined"
            disabled={cargando}
            sx={{ color: theme.palette.text.primary, backgroundColor: "red" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={crearPedido}
            className="boton-crear"
            variant="contained"
            disabled={
              cargando || inventario.length === 0 || !formData.usuarioId
            }
            startIcon={
              cargando ? <CircularProgress size={16} /> : <AddCircleIcon />
            }
          >
            {cargando ? "Creando Pedido..." : "Crear Pedido"}
          </Button>
        </DialogActions>
      </Dialog>

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
          loading: {
            duration: Infinity,
          },
        }}
      />
    </>
  );
};

export default CrearPedidosModal;
