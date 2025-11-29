import React from "react";
import {
  TableRow,
  TableCell,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Box,
  useTheme,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";

const FilaTablaPedidos = ({ pedido, index, onEditar, onEliminar }) => {
  const theme = useTheme();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getEstadoColor = (estado) => {
    const map = {
      pendiente: "warning",
      procesando: "info",
      enviado: "primary",
      entregado: "success",
      cancelado: "error",
    };
    return map[estado] || "default";
  };

  const getEstadoText = (estado) => {
    const estados = {
      pendiente: "Pendiente",
      procesando: "Procesando",
      enviado: "Enviado",
      entregado: "Entregado",
      cancelado: "Cancelado",
    };
    return estados[estado] || estado;
  };

  return (
    <TableRow
      hover
      sx={{
        transition: "0.2s ease",
        "&:hover": {
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.05)"
              : "rgba(0,0,0,0.04)",
        },
      }}
    >
      {/* Número */}
      <TableCell sx={{ fontWeight: "bold", width: 50 }}>{index + 1}</TableCell>

      {/* Cliente */}
      <TableCell>
        <Typography variant="body2" fontWeight="600">
          {pedido.usuario?.nombre || "Cliente"}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {pedido.usuario?.correo || "N/A"}
        </Typography>
      </TableCell>

      {/* Productos */}
      <TableCell sx={{ maxWidth: 250 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0.5,
          }}
        >
          {pedido.productos?.slice(0, 3).map((item, idx) => (
            <Chip
              key={idx}
              size="small"
              variant="outlined"
              label={`${item.producto?.nombre || "Producto"} (x${item.cantidad})`}
              sx={{
                maxWidth: "100%",
                fontSize: "0.7rem",
              }}
            />
          ))}

          {pedido.productos && pedido.productos.length > 3 && (
            <Chip
              label={`+${pedido.productos.length - 3} más...`}
              size="small"
              variant="outlined"
              sx={{
                fontSize: "0.7rem",
                opacity: 0.7,
              }}
            />
          )}
        </Box>
      </TableCell>

      {/* Dirección */}
      <TableCell sx={{ minWidth: 200 }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <LocationIcon fontSize="small" color="action" />
          <Typography
            variant="body2"
            sx={{
              wordBreak: "break-word",
            }}
          >
            {pedido.direccionEnvio ||
              pedido.direccion ||
              "Sin dirección especificada"}
          </Typography>
        </Box>
      </TableCell>

      {/* Total */}
      <TableCell sx={{ fontWeight: "bold", color: theme.palette.primary.main }}>
        {formatCurrency(pedido.total)}
      </TableCell>

      {/* Estado */}
      <TableCell>
        <Chip
          label={getEstadoText(pedido.estado)}
          color={getEstadoColor(pedido.estado)}
          size="small"
          sx={{ fontWeight: "bold" }}
        />
      </TableCell>

      {/* Fecha */}
      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {formatDate(pedido.fechaCreacion)}
        </Typography>
      </TableCell>

      {/* Acciones */}
      <TableCell sx={{ width: 110 }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Editar pedido">
            <IconButton color="primary" size="small" onClick={onEditar}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar pedido">
            <IconButton
              color="error"
              size="small"
              onClick={() => onEliminar(pedido._id)}
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
