import React, { useState, useEffect } from "react";
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
import "../../css/crearPedidosModal.css";

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
    }
  }, [show]);

  const resetForm = () => {
    setInventario([]);
    setFormData({ usuarioId: "", direccionEnvio: "" });
    setErrores({ direccionEnvio: "" });
    setErrorUsuarios("");
    setErrorProductos("");
  };

  const cargarUsuarios = async () => {
    try {
      setCargandoUsuarios(true);
      setErrorUsuarios("");

      const authStorage = localStorage.getItem("auth-storage");
      if (!authStorage) throw new Error("No hay sesión activa");

      const parsedStorage = JSON.parse(authStorage);
      const userData = parsedStorage.state?.user;
      const token = parsedStorage.state?.token;

      if (!userData || !token) throw new Error("Datos de autenticación incompletos");

      const response = await fetch("http://localhost:5000/api/usuarios", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) throw new Error("Sesión expirada");
      if (response.status === 403) throw new Error("Sin permisos para ver usuarios");
      if (!response.ok) throw new Error(`Error ${response.status}`);

      const data = await response.json();
      const usuariosData = Array.isArray(data) ? data : data.usuarios || [];

      setUsuarios(usuariosData);
      if (usuariosData.length === 0) setErrorUsuarios("No se encontraron usuarios");
    } catch (error) {
      setErrorUsuarios(error.message);
    } finally {
      setCargandoUsuarios(false);
    }
  };

  const cargarProductos = async () => {
    try {
      setCargandoProductos(true);
      setErrorProductos("");

      const response = await fetch("http://localhost:5000/api/productos");
      if (!response.ok) throw new Error(`Error ${response.status}`);

      const data = await response.json();
      const productosData = Array.isArray(data) ? data : data.productos || data.data || [];

      setProductos(productosData);
    } catch (error) {
      setErrorProductos("No se pudieron cargar los productos reales");
    } finally {
      setCargandoProductos(false);
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

  const validarFormulario = () => {
    const erroresTemp = {
      direccionEnvio: validarDireccion(formData.direccionEnvio),
    };
    
    setErrores(erroresTemp);
    
    return !erroresTemp.direccionEnvio;
  };

  const agregarAlInventario = (producto) => {
    if (producto.stock <= 0) {
      alert("❌ Producto sin stock disponible");
      return;
    }

    const existe = inventario.find((item) => item.producto._id === producto._id);

    if (existe) {
      if (existe.cantidad >= producto.stock) {
        alert(`❌ Stock máximo: ${producto.stock}`);
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
          producto,
          cantidad: 1,
          precioUnitario: producto.precio,
        },
      ]);
    }
  };

  const removerDelInventario = (productoId) => {
    setInventario(inventario.filter((item) => item.producto._id !== productoId));
  };

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      removerDelInventario(productoId);
      return;
    }

    const item = inventario.find((item) => item.producto._id === productoId);
    if (item && nuevaCantidad > item.producto.stock) {
      alert(`❌ Stock máximo: ${item.producto.stock}`);
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
    if (!formData.usuarioId) return alert("❌ Selecciona un cliente");
    if (inventario.length === 0) return alert("❌ Agrega al menos un producto");
    
    if (!validarFormulario()) {
      alert("❌ Por favor corrige los errores en el formulario");
      return;
    }

    setCargando(true);
    try {
      const authStorage = localStorage.getItem("auth-storage");
      if (!authStorage) throw new Error("No hay sesión activa");

      const token = JSON.parse(authStorage).state?.token;
      if (!token) throw new Error("Token no encontrado");

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

      const response = await fetch("http://localhost:5000/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pedidoData),
      });

      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.error || responseData.message || "Error del servidor");

      onPedidoCreado(responseData.pedido || responseData);
      alert("✅ Pedido creado exitosamente");
      onHide();
    } catch (error) {
      alert(`Error al crear pedido: ${error.message}`);
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 2 }}>
                  <CircularProgress size={20} />
                  <Typography sx={{ color: theme.palette.text.primary }}>
                    Cargando clientes...
                  </Typography>
                </Box>
              ) : (
                <Select
                  value={formData.usuarioId}
                  onChange={(e) => setFormData({ ...formData, usuarioId: e.target.value })}
                  label="Cliente"
                  sx={{ color: theme.palette.text.primary }}
                >
                  <MenuItem value="">Selecciona un cliente</MenuItem>
                  {usuarios.map((usuario) => (
                    <MenuItem key={usuario._id} value={usuario._id} sx={{ color: theme.palette.text.primary }}>
                      {usuario.nombreUsuario} - {usuario.emailUsuario}
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
              helperText={errores.direccionEnvio || "Ej: Av. Corrientes 1234, Buenos Aires"}
              placeholder="Ingresa la dirección completa"
              multiline
              rows={2}
              inputProps={{ maxLength: 200 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              {formData.direccionEnvio.length}/200 caracteres
            </Typography>
          </Grid>
        </Grid>

        <Box className="seccion-productos">
          <Box className="contenedor-productos-inventario">
            <Card className="tarjeta-seccion">
              <Typography variant="h6" className="titulo-seccion" sx={{ color: theme.palette.text.primary }}>
                <StoreIcon />
                Productos Disponibles
              </Typography>

              {errorProductos && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  {errorProductos}
                </Alert>
              )}

              {cargandoProductos ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
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
                        cursor: producto.stock > 0 ? "pointer" : "not-allowed",
                        opacity: producto.stock > 0 ? 1 : 0.6,
                      }}
                    >
                      <CardContent className="contenido-producto">
                        <Typography className="nombre-producto" sx={{ color: "black" }}>
                          {producto.nombre}
                        </Typography>
                        <Typography className="descripcion-producto" sx={{ color: "black" }}>
                          {producto.descripcion}
                        </Typography>
                        <Box className="precio-stock">
                          <Typography className="precio-producto" sx={{ color: "black !important" }}>
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
              <Typography variant="h6" className="titulo-seccion" sx={{ color: theme.palette.text.primary }}>
                <ListIcon />
                Inventario del Pedido
              </Typography>

              <Box className="lista-inventario">
                {inventario.length === 0 ? (
                  <Box className="estado-vacio">
                    <ListIcon sx={{ fontSize: 48, mb: 2, color: theme.palette.text.secondary }} />
                    <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
                      No hay productos en el inventario
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Haz clic en los productos para agregarlos
                    </Typography>
                  </Box>
                ) : (
                  inventario.map((item) => (
                    <Card key={item.producto._id} className="tarjeta-inventario">
                      <CardContent className="contenido-inventario">
                        <Box className="info-producto-inventario">
                          <Typography variant="body1" fontWeight="600" sx={{ color: theme.palette.text.primary }}>
                            {item.producto.nombre}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "black !important" }}>
                            {formatCurrency(item.precioUnitario)} c/u
                          </Typography>
                        </Box>

                        <Box className="controles-cantidad">
                          <Box className="botones-cantidad">
                            <IconButton
                              size="small"
                              onClick={() => actualizarCantidad(item.producto._id, item.cantidad - 1)}
                              className="boton-cantidad"
                              sx={{ color: theme.palette.text.primary }}
                            >
                              <RemoveIcon />
                            </IconButton>

                            <TextField
                              value={item.cantidad}
                              onChange={(e) => actualizarCantidad(item.producto._id, parseInt(e.target.value) || 1)}
                              type="number"
                              size="small"
                              className="input-cantidad"
                            />

                            <IconButton
                              size="small"
                              onClick={() => actualizarCantidad(item.producto._id, item.cantidad + 1)}
                              className="boton-cantidad"
                              sx={{ color: theme.palette.text.primary }}
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>

                          <IconButton
                            size="small"
                            onClick={() => removerDelInventario(item.producto._id)}
                            className="boton-eliminar"
                            sx={{ color: theme.palette.error.main }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>

                        <Box sx={{ textAlign: "right", mt: 1 }}>
                          <Chip
                            label={`Subtotal: ${formatCurrency(item.precioUnitario * item.cantidad)}`}
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
                    background: "linear-gradient(135deg, #083628ff 0%, #08684aff 100%)",
                    color: "white",
                    borderRadius: "12px",
                    padding: "20px",
                    marginTop: "16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontWeight: "700", fontSize: "1.1rem", display: "flex", alignItems: "center" }}>
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

      <DialogActions className="contenedor-botones-crear" sx={{ backgroundColor: theme.palette.background.default }}>
        <Button
          onClick={onHide}
          className="boton-cancelar-crear"
          variant="outlined"
          disabled={cargando}
          sx={{ color: theme.palette.text.primary, backgroundColor: 'red' }}
        >
          Cancelar
        </Button>
        <Button
          onClick={crearPedido}
          className="boton-crear"
          variant="contained"
          disabled={cargando || inventario.length === 0 || !formData.usuarioId}
          startIcon={cargando ? <CircularProgress size={16} /> : <AddCircleIcon />}
        >
          {cargando ? "Creando Pedido..." : "Crear Pedido"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CrearPedidosModal;