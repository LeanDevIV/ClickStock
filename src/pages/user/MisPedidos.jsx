import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";

import { LocationOn } from "@mui/icons-material";
import clientAxios from "../../utils/clientAxios.js";

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const getEstadoColor = (estado) => {
    const colors = {
      pendiente: "warning",
      procesando: "info",
      enviado: "primary",
      entregado: "success",
      cancelado: "error",
    };
    return colors[estado] || "default";
  };

  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        const response = await clientAxios.get("/pedidos/mis-pedidos");
        setPedidos(response.data);
      } catch (err) {
        setError("Error al obtener los pedidos");
      } finally {
        setCargando(false);
      }
    };

    obtenerPedidos();
  }, []);

  if (cargando)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Alert severity="error" sx={{ mt: 5, width: "90%", mx: "auto" }}>
        {error}
      </Alert>
    );

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 5, px: 2 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Mis pedidos
      </Typography>

      {pedidos.length === 0 && (
        <Alert severity="info">No tenés pedidos todavía.</Alert>
      )}

      {pedidos.map((pedido) => (
        <Card key={pedido._id} sx={{ mb: 3, borderRadius: 3, boxShadow: 3, p: 2 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h6" fontWeight="bold">
                Pedido #{pedido._id.slice(-6)}
              </Typography>

              <Chip label={pedido.estado.toUpperCase()} color={getEstadoColor(pedido.estado)} />
            </Box>

            <Typography variant="body2" color="text.secondary" mb={1}>
              Fecha: {formatDate(pedido.fechaCreacion)}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Productos:
            </Typography>

            {pedido.productos.map((item) => (
              <Box key={item._id} display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">
                  {item.producto?.nombre} (x{item.cantidad})
                </Typography>

                <Typography variant="body2" fontWeight="bold">
                  {formatCurrency(item.producto?.precio * item.cantidad)}
                </Typography>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />

            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <LocationOn fontSize="small" color="action" />
              <Typography variant="body2">{pedido.direccion}</Typography>
            </Box>

            <Typography variant="h6" fontWeight="bold" textAlign="right" color="primary">
              Total: {formatCurrency(pedido.total)}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default MisPedidos;
