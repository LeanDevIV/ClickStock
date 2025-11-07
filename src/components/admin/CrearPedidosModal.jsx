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
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
  Store as StoreIcon,
  AttachMoney as MoneyIcon,
  AddCircle as AddCircleIcon,
} from "@mui/icons-material";
import "../../css/crearPedidosModal.css";

const CrearPedidosModal = ({ show, onHide, onPedidoCreado }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [formData, setFormData] = useState({
    usuarioId: '',
    direccionEnvio: ''
  });
  const [cargando, setCargando] = useState(false);
  const [errorUsuarios, setErrorUsuarios] = useState('');
  const [errorProductos, setErrorProductos] = useState('');
  const [cargandoUsuarios, setCargandoUsuarios] = useState(false);
  const [cargandoProductos, setCargandoProductos] = useState(false);

  useEffect(() => {
    if (show) {
      cargarUsuarios();
      cargarProductos();
      resetForm();
      probarConexionBackend();
    }
  }, [show]);

  const resetForm = () => {
    setCarrito([]);
    setFormData({ usuarioId: '', direccionEnvio: '' });
    setErrorUsuarios('');
    setErrorProductos('');
  };

  const probarConexionBackend = async () => {
    try {
      console.log('Probando conexión con el backend...');
      
      const response = await fetch('http://localhost:5000/api/pedidos', {
        method: 'GET'
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Conexión exitosa. Pedidos existentes:', data);
      } else {
        console.error('❌ Error en la conexión:', response.status);
      }
    } catch (error) {
      console.error('❌ No se pudo conectar al backend:', error);
    }
  };

 const cargarUsuarios = async () => {
  try {
    setCargandoUsuarios(true);
    setErrorUsuarios('');
    
    const response = await fetch('http://localhost:5000/api/usuarios');
    
    if (response.status === 401) {
      throw new Error('No autorizado. Usando datos de demostración.');
    }
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: No se pudieron cargar los usuarios`);
    }
    
    const data = await response.json();
    
    let usuariosData = [];
    if (Array.isArray(data)) {
      usuariosData = data;
    } else if (data.usuarios && Array.isArray(data.usuarios)) {
      usuariosData = data.usuarios;
    } else if (data.data && Array.isArray(data.data)) {
      usuariosData = data.data;
    } else {
      throw new Error('Formato de respuesta no válido');
    }
    
    console.log('✅ Usuarios REALES cargados:', usuariosData);
    setUsuarios(usuariosData);
    
  } catch (error) {
    console.error('Error cargando usuarios reales:', error);
    setErrorUsuarios(error.message);
    
    // Mock data con IDs que probablemente existan en tu BD
    const usuariosMock = [
      { _id: '6993e0beba8b631c1cedc99', nombreUsuario: 'admin', email: 'admin@clickstock.com' },
      { _id: '6993e0beba8b631c1cedc9a', nombreUsuario: 'cliente1', email: 'cliente1@example.com' },
      { _id: '6993e0beba8b631c1cedc9b', nombreUsuario: 'cliente2', email: 'cliente2@example.com' }
    ];
    setUsuarios(usuariosMock);
  } finally {
    setCargandoUsuarios(false);
  }
};

const cargarProductos = async () => {
  try {
    setCargandoProductos(true);
    setErrorProductos('');
    
    const response = await fetch('http://localhost:5000/api/productos');
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: No se pudieron cargar los productos`);
    }
    
    const data = await response.json();
    
    let productosData = [];
    if (Array.isArray(data)) {
      productosData = data;
    } else if (data.productos && Array.isArray(data.productos)) {
      productosData = data.productos;
    } else if (data.data && Array.isArray(data.data)) {
      productosData = data.data;
    } else {
      throw new Error('Formato de respuesta no válido');
    }
    
    console.log('✅ Productos REALES cargados:', productosData);
    setProductos(productosData);
    
  } catch (error) {
    console.error('Error cargando productos reales:', error);
    setErrorProductos('No se pudieron cargar los productos reales: ' + error.message);
    
    // Si falla, usa productos mock con IDs que coincidan con tu BD
    const productosMock = [
      { 
        _id: '6993e0beba8b631c1cedc97', 
        nombre: 'Mouse Gamer 8600 DPI', 
        precio: 25999, 
        stock: 36, 
        descripcion: 'Mouse ergonómico con 7 botones programables.' 
      },
      { 
        _id: '6993e0beba8b631c1cedc98', 
        nombre: "Monitor 24' 144Hz", 
        precio: 189999, 
        stock: 3, 
        descripcion: "Monitor Full HD con tasa de refresco de 144Hz." 
      }
    ];
    setProductos(productosMock);
    setErrorProductos('Usando datos de demostración con IDs reales');
  } finally {
    setCargandoProductos(false);
  }
};

  const agregarAlCarrito = (producto) => {
    if (producto.stock <= 0) {
      alert('❌ Producto sin stock disponible');
      return;
    }

    const existe = carrito.find(item => item.producto._id === producto._id);
    
    if (existe) {
      if (existe.cantidad >= producto.stock) {
        alert(`❌ No hay suficiente stock. Máximo: ${producto.stock}`);
        return;
      }
      setCarrito(carrito.map(item =>
        item.producto._id === producto._id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setCarrito([...carrito, {
        producto,
        cantidad: 1,
        precioUnitario: producto.precio
      }]);
    }
  };

  const removerDelCarrito = (productoId) => {
    setCarrito(carrito.filter(item => item.producto._id !== productoId));
  };

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      removerDelCarrito(productoId);
      return;
    }

    const item = carrito.find(item => item.producto._id === productoId);
    if (item && nuevaCantidad > item.producto.stock) {
      alert(`❌ No hay suficiente stock. Máximo: ${item.producto.stock}`);
      return;
    }

    setCarrito(carrito.map(item =>
      item.producto._id === productoId
        ? { ...item, cantidad: nuevaCantidad }
        : item
    ));
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.precioUnitario * item.cantidad), 0);
  };

  const crearPedido = async () => {
    if (!formData.usuarioId) {
      alert('❌ Selecciona un cliente');
      return;
    }

    if (carrito.length === 0) {
      alert('❌ Agrega al menos un producto al carrito');
      return;
    }

    if (!formData.direccionEnvio?.trim()) {
      alert('❌ La dirección de envío es requerida');
      return;
    }

    setCargando(true);
    try {
      const pedidoData = {
        usuario: formData.usuarioId,
        productos: carrito.map(item => ({
          producto: item.producto._id,
          cantidad: item.cantidad
        })),
        total: calcularTotal(),
        direccion: formData.direccionEnvio.trim(),
        estado: 'pendiente'
      };

      console.log('Enviando pedido al backend:', pedidoData);

      const response = await fetch('http://localhost:5000/api/pedidos', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pedidoData)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || `Error ${response.status}: ${response.statusText}`);
      }

      console.log('Pedido creado exitosamente:', responseData);
      
      onPedidoCreado(responseData.pedido || responseData);
      alert('✅ Pedido creado exitosamente');
      onHide();
      
    } catch (error) {
      console.error('Error creando pedido:', error);
      alert(`❌ Error al crear pedido: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
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
          <Typography variant="h5" component="div">
            Cargar un pedido manualmente
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent className="contenido-modal-crear">
        {errorUsuarios && (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
            <strong>Aviso:</strong> {errorUsuarios}
          </Alert>
        )}

        {/* Cliente y Dirección */}
        <Grid container spacing={3} className="seccion-cliente-direccion">
          <Grid item size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Cliente</InputLabel>
              {cargandoUsuarios ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2 }}>
                  <CircularProgress size={20} />
                  <Typography>Cargando clientes...</Typography>
                </Box>
              ) : (
                <Select
                  value={formData.usuarioId}
                  onChange={(e) => setFormData({...formData, usuarioId: e.target.value})}
                  label="Cliente"
                >
                  <MenuItem value="">Selecciona un cliente</MenuItem>
                  {usuarios && usuarios.length > 0 ? (
                    usuarios.map(usuario => (
                      <MenuItem key={usuario._id} value={usuario._id}>
                        {usuario.nombreUsuario} - {usuario.email}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>No hay clientes</MenuItem>
                  )}
                </Select>
              )}
            </FormControl>
          </Grid>
          
          <Grid item size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Dirección de Envío"
              value={formData.direccionEnvio}
              onChange={(e) => setFormData({...formData, direccionEnvio: e.target.value})}
              placeholder="Ingresa la dirección completa"
            />
          </Grid>
        </Grid>

        {/* Productos y Carrito */}
        <Box className="seccion-productos">
          <Box className="contenedor-productos-carrito">
            {/* Productos Disponibles */}
            <Card className="tarjeta-seccion" variant="outlined">
              <Typography variant="h6" className="titulo-seccion">
                <StoreIcon />
                Productos Disponibles
              </Typography>
              
              {errorProductos && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  {errorProductos}
                </Alert>
              )}
              
              {cargandoProductos ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box className="lista-productos">
                  {productos && productos.length > 0 ? (
                    productos.map(producto => (
                      <Card 
                        key={producto._id}
                        className="tarjeta-producto"
                        onClick={() => agregarAlCarrito(producto)}
                        sx={{
                          cursor: producto.stock > 0 ? 'pointer' : 'not-allowed',
                          opacity: producto.stock > 0 ? 1 : 0.6
                        }}
                      >
                        <CardContent className="contenido-producto">
                          <Typography className="nombre-producto" variant="body1">
                            {producto.nombre}
                          </Typography>
                          <Typography className="descripcion-producto" variant="body2">
                            {producto.descripcion}
                          </Typography>
                          <Box className="precio-stock">
                            <Typography className="precio-producto">
                              {formatCurrency(producto.precio)}
                            </Typography>
                            <Chip
                              label={`Stock: ${producto.stock}`}
                              color={producto.stock > 0 ? 'success' : 'error'}
                              size="small"
                              className="badge-stock"
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Box className="estado-vacio">
                      <StoreIcon sx={{ fontSize: 48, mb: 2, color: 'text.secondary' }} />
                      <Typography variant="h6" color="text.secondary">
                        No hay productos disponibles
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Card>

            {/* Carrito de Compra */}
            <Card className="tarjeta-seccion" variant="outlined">
              <Typography variant="h6" className="titulo-seccion">
                <CartIcon />
                Carrito de Compra
              </Typography>
              
              <Box className="lista-carrito">
                {carrito.length === 0 ? (
                  <Box className="estado-vacio">
                    <CartIcon sx={{ fontSize: 48, mb: 2, color: 'text.secondary' }} />
                    <Typography variant="h6" color="text.secondary">
                      No hay productos en el carrito
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Haz clic en los productos para agregarlos
                    </Typography>
                  </Box>
                ) : (
                  carrito.map(item => (
                    <Card key={item.producto._id} className="tarjeta-carrito">
                      <CardContent className="contenido-carrito">
                        <Box className="info-producto-carrito">
                          <Typography variant="body1" fontWeight="600">
                            {item.producto.nombre}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatCurrency(item.precioUnitario)} c/u
                          </Typography>
                        </Box>
                        
                        <Box className="controles-cantidad">
                          <Box className="botones-cantidad">
                            <IconButton
                              size="small"
                              onClick={() => actualizarCantidad(item.producto._id, item.cantidad - 1)}
                              className="boton-cantidad"
                            >
                              <RemoveIcon />
                            </IconButton>
                            
                            <TextField
                              value={item.cantidad}
                              onChange={(e) => {
                                const valor = parseInt(e.target.value) || 1;
                                actualizarCantidad(item.producto._id, valor);
                              }}
                              type="number"
                              inputProps={{ min: 1 }}
                              size="small"
                              className="input-cantidad"
                            />
                            
                            <IconButton
                              size="small"
                              onClick={() => actualizarCantidad(item.producto._id, item.cantidad + 1)}
                              className="boton-cantidad"
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>
                          
                          <IconButton
                            size="small"
                            onClick={() => removerDelCarrito(item.producto._id)}
                            className="boton-eliminar"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                        
                        <Box sx={{ textAlign: 'right', mt: 1 }}>
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
              
              {carrito.length > 0 && (
                <Card className="resumen-total">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography className="texto-total" variant="h6">
                        <MoneyIcon sx={{ mr: 1 }} />
                        Total:
                      </Typography>
                      <Typography className="valor-total">
                        {formatCurrency(calcularTotal())}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Card>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions className="contenedor-botones-crear">
        <Button
          onClick={onHide}
          className="boton-cancelar-crear"
          variant="outlined"
          disabled={cargando}
        >
          Cancelar
        </Button>
        <Button
          onClick={crearPedido}
          className="boton-crear"
          variant="contained"
          disabled={cargando || carrito.length === 0 || !formData.usuarioId}
          startIcon={cargando ? <CircularProgress size={16} /> : <AddCircleIcon />}
        >
          {cargando ? 'Creando Pedido...' : 'Crear Pedido'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CrearPedidosModal;