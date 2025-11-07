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
  Edit as EditIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
} from "@mui/icons-material";
import "../../css/editarPedidosModal.css";

const EditarPedidosModal = ({ show, onHide, pedido, onPedidoEditado }) => {
  const [formData, setFormData] = useState({
    direccionEnvio: '',
    estado: 'pendiente',
    productos: []
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (pedido) {
      setFormData({
        direccionEnvio: pedido.direccionEnvio || pedido.direccion || '',
        estado: pedido.estado || 'pendiente',
        productos: pedido.productos ? [...pedido.productos] : []
      });
      setError('');
    }
  }, [pedido]);

  const actualizarCantidad = (index, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    
    const productosActualizados = [...formData.productos];
    productosActualizados[index] = {
      ...productosActualizados[index],
      cantidad: nuevaCantidad
    };
    
    setFormData({
      ...formData,
      productos: productosActualizados
    });
  };

  const eliminarProducto = (index) => {
    if (formData.productos.length <= 1) {
      setError('El pedido debe tener al menos un producto');
      return;
    }

    const productosActualizados = formData.productos.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      productos: productosActualizados
    });
  };

  const calcularTotal = () => {
    return formData.productos.reduce((total, item) => {
      const precio = item.precioUnitario || item.producto?.precio || 0;
      return total + (precio * item.cantidad);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pedido) return;

    if (!formData.direccionEnvio.trim()) {
      setError('La dirección de envío es requerida');
      return;
    }

    if (formData.productos.length === 0) {
      setError('El pedido debe tener al menos un producto');
      return;
    }

    const productoInvalido = formData.productos.find(item => item.cantidad < 1);
    if (productoInvalido) {
      setError('Todas las cantidades deben ser al menos 1');
      return;
    }

    setCargando(true);
    setError('');

    try {
      const updateData = {
        direccion: formData.direccionEnvio.trim(),
        estado: formData.estado,
        productos: formData.productos.map(item => ({
          producto: item.producto?._id || item.producto,
          cantidad: item.cantidad
        })),
        total: calcularTotal()
      };

 

      const response = await fetch(`http://localhost:5000/api/pedidos/${pedido._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Error al actualizar pedido');
      }

      onPedidoEditado(responseData.pedido || responseData);
      onHide();
      
    } catch (error) {
      console.error('Error actualizando pedido:', error);
      setError('Error al actualizar pedido: ' + error.message);
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

  if (!pedido) return null;

  const totalCalculado = calcularTotal();

  return (
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

          <Grid container spacing={3} className="seccion-datos">
            <Grid item size={{ xs: 12, md: 7 }}>
              <Box className="tarjeta-dato">
                <Typography variant="body2" className="etiqueta-dato">
                  <PersonIcon sx={{ fontSize: 18, mr: 1 }} />
                  Información del Cliente
                </Typography>
                <Typography variant="h6" className="valor-dato valor-dato-cliente">
                  {pedido.usuario?.nombreUsuario || 'Cliente no especificado'}
                </Typography>
                <Typography variant="body2" className="texto-email">
                  {pedido.usuario?.email || 'Email no disponible'}
                </Typography>
              </Box>
            </Grid>

            <Grid item size={{ xs: 12, md: 5 }}>
              <Box className="tarjeta-dato">
                <Typography variant="body2" className="etiqueta-dato">
                  <MoneyIcon sx={{ fontSize: 18, mr: 1 }} />
                  Total del Pedido
                </Typography>
                <Typography variant="h4" className="valor-dato valor-dato-total">
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
              onChange={(e) => setFormData({...formData, direccionEnvio: e.target.value})}
              placeholder="Ingresa la dirección completa de envío"
              multiline
              rows={3}
              InputProps={{
                startAdornment: <LocationIcon color="action" sx={{ mr: 1 }} />
              }}
            />
          </Box>

          <Box className="campo-estado">
            <FormControl fullWidth>
              <InputLabel>Estado del Pedido</InputLabel>
              <Select
                value={formData.estado}
                onChange={(e) => setFormData({...formData, estado: e.target.value})}
                label="Estado del Pedido"
              >
                <MenuItem value="pendiente" className="estado-option estado-pendiente">
                  ⏳ Pendiente
                </MenuItem>
                <MenuItem value="procesando" className="estado-option estado-procesando">
                  🔄 Procesando
                </MenuItem>
                <MenuItem value="enviado" className="estado-option estado-enviado">
                  🚚 Enviado
                </MenuItem>
                <MenuItem value="entregado" className="estado-option estado-entregado">
                  📦 Entregado
                </MenuItem>
                <MenuItem value="cancelado" className="estado-option estado-cancelado">
                  ❌ Cancelado
                </MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box className="seccion-productos">
            <Box className="titulo-productos">
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InventoryIcon />
                Productos del Pedido
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Edita las cantidades según sea necesario
              </Typography>
            </Box>
            
            <Box className="contenedor-productos">
              {formData.productos.map((item, index) => (
                <Card key={index} className="tarjeta-producto" variant="outlined">
                  <CardContent className="contenido-producto">
                    <Box className="info-producto">
                      <Typography className="nombre-producto" variant="body1">
                        {item.producto?.nombre || 'Producto no especificado'}
                      </Typography>
                      <Typography className="precio-producto" variant="body2">
                        {formatCurrency(item.precioUnitario || item.producto?.precio || 0)} c/u
                      </Typography>
                    </Box>

                    <Box className="controles-cantidad">
                      <IconButton
                        size="small"
                        onClick={() => actualizarCantidad(index, item.cantidad - 1)}
                        disabled={item.cantidad <= 1}
                        color="primary"
                      >
                        <RemoveIcon />
                      </IconButton>

                      <TextField
                        value={item.cantidad}
                        onChange={(e) => {
                          const valor = parseInt(e.target.value) || 1;
                          actualizarCantidad(index, valor);
                        }}
                        type="number"
                        inputProps={{ 
                          min: 1, 
                          style: { textAlign: 'center' } 
                        }}
                        size="small"
                        className="input-cantidad"
                      />

                      <IconButton
                        size="small"
                        onClick={() => actualizarCantidad(index, item.cantidad + 1)}
                        color="primary"
                      >
                        <AddIcon />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={() => eliminarProducto(index)}
                        className="boton-eliminar-producto"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
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
                    Items totales: {formData.productos.reduce((sum, item) => sum + item.cantidad, 0)}
                  </Typography>
                </Box>
                <Box className="fila-total total-final">
                  <Typography variant="h6" fontWeight="700">
                    Total Final:
                  </Typography>
                  <Typography variant="h6" fontWeight="700" color="success.main">
                    {formatCurrency(totalCalculado)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </DialogContent>

        <DialogActions className="contenedor-botones">
          <Button
            onClick={onHide}
            className="boton-cancelar"
            variant="outlined"
            disabled={cargando}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="boton-guardar"
            variant="contained"
            disabled={cargando}
            startIcon={cargando ? <CircularProgress size={16} /> : <EditIcon />}
          >
            {cargando ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditarPedidosModal;