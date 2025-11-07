import React from "react";
import {
  TableRow,
  TableCell,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Box,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import "../../css/filaTablaPedidos.css";

const FilaTablaPedidos = ({
  pedido,
  index,
  onEditar,
  onEliminar,
}) => {
  // Función para formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Función para obtener la clase del estado
  const getEstadoClass = (estado) => {
    return `estado-chip estado-${estado}`;
  };

  // Función para obtener el texto del estado
  const getEstadoText = (estado) => {
    const estados = {
      pendiente: '⏳ Pendiente',
      procesando: '🔄 Procesando',
      enviado: '🚚 Enviado',
      entregado: '📦 Entregado',
      cancelado: '❌ Cancelado'
    };
    return estados[estado] || estado;
  };

  return (
    <TableRow className="fila-pedido">
      {/* Número */}
      <TableCell className="celda-numero">
        {index + 1}
      </TableCell>

      {/* Cliente */}
      <TableCell className="celda-cliente">
        <Box>
          <Typography className="texto-cliente" variant="body2">
            {pedido.usuario?.nombreUsuario || 'Cliente'}
          </Typography>
          <Typography className="texto-email" variant="caption">
            {pedido.usuario?.email || 'N/A'}
          </Typography>
        </Box>
      </TableCell>

      {/* Productos */}
      <TableCell className="celda-productos">
        <Box className="contenedor-productos">
          {pedido.productos?.slice(0, 3).map((item, idx) => (
            <Box key={idx} className="producto-item">
              <Typography 
                className="nombre-producto" 
                variant="body2"
                title={item.producto?.nombre || 'Producto'}
              >
                {item.producto?.nombre || 'Producto'}
              </Typography>
              <Typography className="cantidad-producto" variant="caption">
                x{item.cantidad}
              </Typography>
            </Box>
          ))}
          {pedido.productos && pedido.productos.length > 3 && (
            <Typography className="mas-productos" variant="caption">
              +{pedido.productos.length - 3} más...
            </Typography>
          )}
        </Box>
      </TableCell>

      {/* Dirección - NUEVA COLUMNA */}
      <TableCell className="celda-direccion">
        <Box display="flex" alignItems="flex-start" gap={1}>
          <LocationIcon 
            fontSize="small" 
            color="action" 
            sx={{ mt: 0.2, flexShrink: 0 }}
          />
          <Typography 
            className="texto-direccion" 
            variant="body2"
            title={pedido.direccionEnvio || pedido.direccion || 'Sin dirección'}
          >
            {pedido.direccionEnvio || pedido.direccion || 'Sin dirección especificada'}
          </Typography>
        </Box>
      </TableCell>

      {/* Total */}
      <TableCell className="celda-total">
        <Typography variant="body2" color="success.main" fontWeight="bold">
          {formatCurrency(pedido.total)}
        </Typography>
      </TableCell>

      {/* Estado - SOLO LECTURA */}
      <TableCell className="celda-estado">
        <Chip
          label={getEstadoText(pedido.estado)}
          className={getEstadoClass(pedido.estado)}
          size="small"
          variant="filled"
        />
      </TableCell>

      {/* Fecha */}
      <TableCell className="celda-fecha">
        <Typography variant="body2" color="text.secondary">
          {formatDate(pedido.fechaCreacion)}
        </Typography>
      </TableCell>

      {/* Acciones */}
      <TableCell className="celda-acciones">
        <Box className="contenedor-botones">
          <Tooltip title="Editar pedido">
            <IconButton
              size="small"
              onClick={onEditar}
              className="boton-accion"
              color="primary"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Eliminar pedido">
            <IconButton
              size="small"
              onClick={() => onEliminar(pedido._id)}
              className="boton-accion"
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default FilaTablaPedidos;