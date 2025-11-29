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
  IconButton,

  DialogContentText,
} from "@mui/material";
import {
  Edit as EditIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Warning as WarningIcon, 
} from "@mui/icons-material";
import { toast } from "react-hot-toast";
import clientaxios from "../../utils/clientAxios.js";
import "../../styles/editarPedidosModal.css";

const EditarPedidosModal = ({
  show,
  onHide,
  pedido,
  onPedidoEditado,
  setPedidos,
}) => {
  const [formData, setFormData] = useState({
    direccionEnvio: "",
    estado: "pendiente",
    productos: [],
  });
  const [cargando, setCargando] = useState(false);
  const [cargandoProductos, setCargandoProductos] = useState(false);
  const [error, setError] = useState("");
  const [errores, setErrores] = useState({
    direccionEnvio: "",
  });
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
      setErrores({ direccionEnvio: "" });
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

  const iniciarEliminarPedido = () => {
      setConfirmarBorrado(true);
  };

  const manejarEliminarPedido = async () => {
    setConfirmarBorrado(false);

    setCargando(true);
    const toastId = toast.loading("Eliminando pedido y restaurando stock...");

    try {
      await clientaxios.delete(`/pedidos/${pedido._id}`);
      
      setPedidos((prev) => prev.filter((p) => p._id !== pedido._id));
      
      toast.success("Pedido eliminado correctamente y stock restaurado", { id: toastId });
      onHide();
    } catch (error) {
      console.error("Error al eliminar pedido:", error);
      toast.error("Error al eliminar pedido o restaurar stock", { id: toastId });
    } finally {
      setCargando(false);
    }
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

  const actualizarCantidad = (index, nuevaCantidad) => {
    const cantidadAjustada = Math.max(1, parseInt(nuevaCantidad) || 1);
    
    const productoItem = formData.productos[index];
    const productoId = productoItem.producto?._id || productoItem.producto;
    const stockDisponible = calcularStockDisponible(productoId);
    
    const cantidadFinal = Math.min(cantidadAjustada, stockDisponible);

    if (cantidadAjustada === 0) return; 
    
    const productosActualizados = [...formData.productos];
    productosActualizados[index] = {
      ...productosActualizados[index],
      cantidad: cantidadFinal,
    };

    setFormData({
      ...formData,
      productos: productosActualizados,
    });
    
    setError(null);
  };
  
  const eliminarProducto = (index) => {
    if (formData.productos.length <= 1) {
      toast.error("El pedido debe tener al menos un producto");
      return;
    }

    const productosActualizados = formData.productos.filter(
      (_, i) => i !== index
    );
        
    setFormData({
      ...formData,
      productos: productosActualizados,
    });
    
    toast.success("Producto eliminado del pedido");
    setError(null);
  };

  const calcularTotal = useCallback(() => {
    return formData.productos.reduce((total, item) => {
      const productoId = item.producto?._id || item.producto;
      const producto = obtenerProductoInfo(productoId);
      const precio = item.precioUnitario || producto?.precio || 0; 
      return total + precio * item.cantidad;
    }, 0);
  }, [formData.productos, obtenerProductoInfo]);

  const validarStockProductos = () => {
    for (const item of formData.productos) {
      const productoId = item.producto?._id || item.producto;
      const producto = obtenerProductoInfo(productoId);

      if (!producto) {
        return `El producto "${
          item.producto?.nombre || "Producto"
        }" ya no existe. Por favor, elimínalo del pedido.`;
      }
      
      const stockDisponible = calcularStockDisponible(productoId);
      
      if (item.cantidad < 1 || !Number.isInteger(item.cantidad)) {
        return `Cantidad inválida (${item.cantidad}) para el producto "${producto.nombre}".`;
      }
      
      if (item.cantidad > stockDisponible) {
        return `Stock insuficiente para "${producto.nombre}". Disponible: ${stockDisponible}, Solicitado: ${item.cantidad}`;
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pedido) return;

    if (cargando) {
      toast.error("Ya se está procesando una actualización");
      return;
    }

    const errorDireccion = validarDireccion(formData.direccionEnvio);
    if (errorDireccion) {
      setErrores({ ...errores, direccionEnvio: errorDireccion });
      setError("Por favor, corrige los errores en el formulario");
      return;
    }

    if (formData.productos.length === 0) {
      setError("El pedido debe tener al menos un producto");
      return;
    }

    const errorStock = validarStockProductos();
    if (errorStock) {
      setError(errorStock);
      return;
    }
    
    setErrores({ ...errores, direccionEnvio: "" });
    setError("");

    setCargando(true);
    const toastId = toast.loading("Actualizando pedido...");

    try {
      const updateData = {
        direccion: formData.direccionEnvio.trim(),
        estado: formData.estado,
        productos: formData.productos.map((item) => ({
          producto: item.producto?._id || item.producto,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario || obtenerProductoInfo(item.producto?._id || item.producto)?.precio,
        })),
        total: calcularTotal(),
      };

      const { data: responseData } = await clientaxios.put(
        `/pedidos/${pedido._id}`,
        updateData
      );

      onPedidoEditado(responseData.pedido || responseData);
      toast.success("Pedido actualizado exitosamente", { id: toastId });
      onHide();
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || "Problema de conexión.";
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
      {/* MODAL PRINCIPAL DE EDICIÓN */}
      <Dialog
        open={show}
        onClose={onHide}
        maxWidth="md"
        fullWidth
        className="modal-editar-pedido"
      >
        <DialogTitle className="header-modal">
          <Box className="titulo-modal">
            <EditIcon />
            <Typography variant="h5" component="div">
              Editar Pedido #{pedido._id?.slice(-6)}
            </Typography>
          </Box>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent className="contenido-modal">
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {cargandoProductos && (
              <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                Cargando información de productos...
              </Alert>
            )}

            {/* ... (Contenido del formulario) ... */}
            <Grid container spacing={3} className="seccion-datos">
              <Grid xs={12} md={7}>
                <Box className="tarjeta-dato">
                  <Typography variant="body2" className="etiqueta-dato">
                    <PersonIcon sx={{ fontSize: 18, mr: 1 }} />
                    Información del Cliente
                  </Typography>
                  <Typography
                    variant="h6"
                    className="valor-dato valor-dato-cliente"
                  >
                    {pedido.usuario?.nombre || "Cliente no especificado"}
                  </Typography>
                  <Typography variant="body2" className="texto-email">
                    {pedido.usuario?.correo || "Email no disponible"}
                  </Typography>
                </Box>
              </Grid>

              <Grid xs={12} md={5}>
                <Box className="tarjeta-dato">
                  <Typography variant="body2" className="etiqueta-dato">
                    <MoneyIcon sx={{ fontSize: 18, mr: 1 }} />
                    Total del Pedido
                  </Typography>
                  <Typography
                    variant="h4"
                    className="valor-dato valor-dato-total"
                  >
                    {formatCurrency(totalCalculado)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formData.productos.length} producto(s)
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box className="campo-direccion">
              <TextField
                fullWidth
                label="Dirección de Envío"
                value={formData.direccionEnvio}
                onChange={manejarCambioDireccion}
                placeholder="Ingresa la dirección completa de envío (ej: Av. Corrientes 1234, CABA)"
                multiline
                rows={3}
                error={!!errores.direccionEnvio}
                helperText={errores.direccionEnvio}
                inputProps={{ maxLength: 200 }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 0.5 }}
              >
                {formData.direccionEnvio.length}/200 caracteres
              </Typography>
            </Box>

            <Box className="campo-estado">
              <FormControl fullWidth>
                <InputLabel>Estado del Pedido</InputLabel>
                <Select
                  value={formData.estado}
                  onChange={(e) =>
                    setFormData({ ...formData, estado: e.target.value })
                  }
                  label="Estado del Pedido"
                >
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                  <MenuItem value="procesando">Procesando</MenuItem>
                  <MenuItem value="enviado">Enviado</MenuItem>
                  <MenuItem value="entregado">Entregado</MenuItem>
                  <MenuItem value="cancelado">Cancelado</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box className="seccion-productos">
              <Box className="titulo-productos">
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <InventoryIcon />
                  Productos del Pedido
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Stock disponible se actualiza en tiempo real
                </Typography>
              </Box>

              <Box className="contenedor-productos">
                {formData.productos.map((item, index) => {
                  const productoId = item.producto?._id || item.producto;
                  const producto = obtenerProductoInfo(productoId);
                  const stockDisponible = calcularStockDisponible(productoId);
                  const precio = item.precioUnitario || producto?.precio || 0;
                  const nombreProducto =
                    producto?.nombre ||
                    item.producto?.nombre ||
                    "Producto no disponible";
                  const stockBaseParaChip = stockDisponible; 

                  return (
                    <Card
                      key={index}
                      className="tarjeta-producto"
                      variant="outlined"
                    >
                      <CardContent className="contenido-producto">
                        <Box className="info-producto">
                          <Typography className="nombre-producto" variant="body1">
                            {nombreProducto}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              alignItems: "center",
                              flexWrap: "wrap",
                              mt: 1,
                            }}
                          >
                            <Typography
                              className="precio-producto"
                              variant="body2"
                            >
                              {formatCurrency(precio)} c/u
                            </Typography>
                            <Chip
                              label={`Stock disponible: ${stockBaseParaChip}`} 
                              sx={{ backgroundColor: stockBaseParaChip > 0 ? "green" : "red" }}
                              size="small"
                              color="default"
                              variant="filled"
                            />
                          </Box>
                        </Box>

                        <Box className="controles-cantidad">
                          <IconButton
                            size="small"
                            onClick={() =>
                              actualizarCantidad(index, item.cantidad - 1)
                            }
                            disabled={item.cantidad <= 1}
                            sx={{ color: "#000000" }}
                          >
                            <RemoveIcon />
                          </IconButton>

                          <TextField
                            value={item.cantidad ?? 1}
                            onChange={(e) => {
                              const valor = parseInt(e.target.value) || 1;
                              actualizarCantidad(index, valor);
                            }}
                            type="number"
                            size="small"
                            className="input-cantidad"
                            inputProps={{
                              min: 1,
                              max: stockDisponible, 
                            }}
                          />

                          <IconButton
                            size="small"
                            onClick={() => {
                              if (item.cantidad >= stockDisponible) {
                                toast.error(
                                  "Ya alcanzaste el stock máximo disponible"
                                );
                                return;
                              }
                              actualizarCantidad(index, item.cantidad + 1);
                            }}
                            disabled={item.cantidad >= stockDisponible}
                            sx={{ color: "#000000" }}
                          >
                            <AddIcon />
                          </IconButton>

                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => eliminarProducto(index)} 
                            disabled={formData.productos.length <= 1}
                          >
                            <DeleteIcon />
                          </Button>
                        </Box>

                        {stockDisponible === 0 && (
                          <Alert severity="error" sx={{ mt: 1, py: 0 }}>
                            Sin stock disponible
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>

              <Card className="resumen-total">
                <CardContent>
                  <Box className="fila-total">
                    <Typography variant="body1" fontWeight="600">
                      Subtotal:
                    </Typography>
                    <Typography variant="body1">
                      {formatCurrency(totalCalculado)}
                    </Typography>
                  </Box>
                  <Box className="fila-total">
                    <Typography variant="body2" color="text.secondary">
                      Productos: {formData.productos.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Items totales:{" "}
                      {formData.productos.reduce(
                        (sum, item) => sum + item.cantidad,
                        0
                      )}
                    </Typography>
                  </Box>
                  <Box
                    className="fila-total total-final"
                    sx={{
                      padding: "5px 15px",
                      borderRadius: "5px",
                      borderTopColor: "black",
                    }}
                  >
                    <Typography variant="h6" fontWeight="700">
                      Total Final:
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight="700"
                      color="success.main"
                    >
                      {formatCurrency(totalCalculado)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </DialogContent>

          <DialogActions className="contenedor-botones">
            <Button
              onClick={iniciarEliminarPedido} 
              className="boton-eliminar-pedido"
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              disabled={cargando}
              sx={{ mr: 2 }} 
            >
              Eliminar Pedido
            </Button>
            
            <Button
              onClick={onHide}
              className="boton-cancelar"
              variant="outlined"
              sx={{ color: "black!important", backgroundColor: "white !important" }}
              disabled={cargando}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="boton-guardar"
              variant="contained"
              disabled={cargando || !!errores.direccionEnvio || formData.productos.length === 0}
              startIcon={cargando ? <CircularProgress size={16} /> : <EditIcon />}
            >
              {cargando ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* 🆕 MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      <Dialog
        open={confirmarBorrado}
        onClose={() => setConfirmarBorrado(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', alignItems: 'center', color: 'red' }}>
          <WarningIcon sx={{ mr: 1, fontSize: 30 }} />
          {"Confirmar Eliminación"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Estás a punto de **eliminar permanentemente el Pedido # {pedido?._id?.slice(-6)}**. 
            
            Esta acción no se puede deshacer y el stock de los productos será restaurado. ¿Estás seguro de que deseas proceder?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmarBorrado(false)} 
            color="primary"
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button 
            onClick={manejarEliminarPedido} 
            color="error" 
            variant="contained"
            autoFocus
            startIcon={cargando ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}
            disabled={cargando}
          >
            {cargando ? "Eliminando..." : "Sí, Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditarPedidosModal;