import React, { useState } from "react";
import {
  TableRow,
  TableCell,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Box,
  useTheme,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Restore as RestoreIcon,
  LocationOn as LocationIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { toast } from "react-hot-toast";
import clientaxios from "../../utils/clientAxios.js";

const FilaTablaPedidos = ({
  pedido,
  index,
  onEliminar,
  onEstadoActualizado,
  onRestaurar,
}) => {
  const theme = useTheme();
  const [editandoEstado, setEditandoEstado] = useState(false);
  const [estadoTemporal, setEstadoTemporal] = useState(pedido.estado);
  const [cargando, setCargando] = useState(false);
  const [cargandoRestaurar, setCargandoRestaurar] = useState(false);

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

  const iniciarEdicionEstado = () => {
    setEstadoTemporal(pedido.estado);
    setEditandoEstado(true);
  };

  const cancelarEdicion = () => {
    setEditandoEstado(false);
    setEstadoTemporal(pedido.estado);
  };

  const guardarEstado = async () => {
    if (estadoTemporal === pedido.estado) {
      setEditandoEstado(false);
      return;
    }

    setCargando(true);
    const toastId = toast.loading("Actualizando estado del pedido...");

    try {
      const updateData = {
        estado: estadoTemporal,
      };

      const { data: responseData } = await clientaxios.put(
        `/pedidos/${pedido._id}`,
        updateData
      );
      if (onEstadoActualizado) {
        onEstadoActualizado(responseData.pedido || responseData);
      }

      toast.success("Estado del pedido actualizado exitosamente", {
        id: toastId,
      });
      setEditandoEstado(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Problema de conexión.";
      toast.error(`Error al actualizar estado: ${errorMessage}`, {
        id: toastId,
      });
      setEstadoTemporal(pedido.estado);
    } finally {
      setCargando(false);
    }
  };

  const manejarRestaurar = async () => {
    if (!pedido.isDeleted) {
      toast.error("Este pedido no está eliminado");
      return;
    }

    setCargandoRestaurar(true);
    const toastId = toast.loading("Restaurando pedido...");

    try {
      const { data } = await clientaxios.patch(
        `/pedidos/restore/${pedido._id}`
      );

      if (onRestaurar) {
        onRestaurar(data.pedido);
      }

      toast.success("Pedido restaurado exitosamente", { id: toastId });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Problema de conexión.";
      toast.error(`Error al restaurar pedido: ${errorMessage}`, {
        id: toastId,
      });
    } finally {
      setCargandoRestaurar(false);
    }
  };

  const manejarCambioEstado = (event) => {
    setEstadoTemporal(event.target.value);
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
        backgroundColor: pedido.isDeleted ? "rgba(255, 0, 0, 0.05)" : "inherit",
      }}
    >
      <TableCell sx={{ fontWeight: "bold", width: 50 }}>{index + 1}</TableCell>

      <TableCell>
        <Typography variant="body2" fontWeight="600">
          {pedido.usuario?.nombre || "Cliente"}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {pedido.usuario?.correo || "N/A"}
        </Typography>
      </TableCell>

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
              label={`${item.producto?.nombre || "Producto"} (x${
                item.cantidad
              })`}
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

      <TableCell sx={{ fontWeight: "bold", color: theme.palette.primary.main }}>
        {formatCurrency(pedido.total)}
      </TableCell>

      <TableCell>
        {editandoEstado ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Select
              value={estadoTemporal}
              onChange={manejarCambioEstado}
              size="small"
              disabled={cargando}
              sx={{
                minWidth: 130,
                height: 32,
              }}
            >
              <MenuItem value="pendiente">Pendiente</MenuItem>
              <MenuItem value="procesando">Procesando</MenuItem>
              <MenuItem value="enviado">Enviado</MenuItem>
              <MenuItem value="entregado">Entregado</MenuItem>
              <MenuItem value="cancelado">Cancelado</MenuItem>
            </Select>

            {cargando ? <CircularProgress size={20} /> : <></>}
          </Box>
        ) : (
          <Chip
            label={getEstadoText(pedido.estado)}
            color={getEstadoColor(pedido.estado)}
            size="small"
            sx={{
              fontWeight: "bold",
              cursor: pedido.isDeleted ? "default" : "pointer",
              opacity: pedido.isDeleted ? 0.6 : 1,
            }}
          />
        )}
      </TableCell>

      <TableCell align="center">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {pedido.isDeleted ? (
            <Tooltip title="Pedido eliminado">
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CancelIcon fontSize="small" color="error" />
                <Typography variant="body2" color="error" fontWeight="bold">
                  Sí
                </Typography>
              </Box>
            </Tooltip>
          ) : (
            <Tooltip title="Pedido activo">
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CheckCircleIcon fontSize="small" color="success" />
                <Typography variant="body2" color="success" fontWeight="bold">
                  No
                </Typography>
              </Box>
            </Tooltip>
          )}
        </Box>
      </TableCell>

      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {formatDate(pedido.fechaCreacion)}
        </Typography>
      </TableCell>

      <TableCell sx={{ width: 200 }}>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {!pedido.isDeleted && !editandoEstado && (
            <Tooltip title="Editar estado">
              <IconButton
                color="primary"
                size="small"
                onClick={iniciarEdicionEstado}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {editandoEstado && (
            <>
              <Tooltip title="Guardar cambios">
                <IconButton
                  size="small"
                  color="success"
                  onClick={guardarEstado}
                  disabled={cargando}
                >
                  {cargando ? (
                    <CircularProgress size={16} />
                  ) : (
                    <CheckIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip title="Cancelar edición">
                <IconButton
                  size="small"
                  color="error"
                  onClick={cancelarEdicion}
                  disabled={cargando}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}

          {pedido.isDeleted && (
            <Tooltip title="Restaurar pedido">
              <IconButton
                color="success"
                size="small"
                onClick={manejarRestaurar}
                disabled={cargandoRestaurar}
              >
                {cargandoRestaurar ? (
                  <CircularProgress size={16} />
                ) : (
                  <RestoreIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          )}

          {!pedido.isDeleted && (
            <Tooltip title="Eliminar pedido">
              <IconButton
                color="error"
                size="small"
                onClick={() => onEliminar(pedido)}
                disabled={editandoEstado || cargando}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default FilaTablaPedidos;