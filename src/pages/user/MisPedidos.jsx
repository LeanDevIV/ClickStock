import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Button,
} from "@mui/material";

import {
  LocationOn,
  ShoppingBag,
  Login as LoginIcon,
  Cancel,
} from "@mui/icons-material";
import clientAxios from "../../utils/clientAxios.js";
import { useStore } from "../../hooks/useStore.js";
import { useOutletContext, useNavigate } from "react-router-dom";

import { usePageTitle } from "../../hooks/usePageTitle";

const MisPedidos = () => {
  usePageTitle("Mis Pedidos");

  const { user } = useStore();
  const { handleOpenAuth } = useOutletContext() || {};
  const navigate = useNavigate();
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

  const cancelarPedido = async (pedidoId) => {
    try {
      const result = await Swal.fire({
        title: "¿Cancelar pedido?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, cancelar",
        cancelButtonText: "No, mantener",
      });

      if (result.isConfirmed) {
        await clientAxios.delete(`/pedidos/${pedidoId}`);

        setPedidos(pedidos.filter((p) => p._id !== pedidoId));

        Swal.fire({
          title: "¡Cancelado!",
          text: "Tu pedido ha sido cancelado",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error al cancelar pedido:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo cancelar el pedido. Por favor, intentá de nuevo.",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    const obtenerPedidos = async () => {
      try {
        const response = await clientAxios.get("/pedidos/mis-pedidos");
        setPedidos(response.data);
      } catch (error) {
        setError("Error al obtener los pedidos");
        console.error("Error al obtener los pedidos:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerPedidos();
  }, []);

  if (!user) {
    return (
      <Box sx={{ maxWidth: 900, mx: "auto", mt: 5, px: 2 }}>
        <Card
          sx={{
            textAlign: "center",
            py: 8,
            backgroundColor: "background.default",
          }}
        >
          <CardContent>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Inicia sesión para ver tus pedidos
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleOpenAuth}
              sx={{
                mt: 2,
              }}
            >
              Iniciar Sesión
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (cargando) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 5, width: "90%", mx: "auto" }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 5, px: 2 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Mis pedidos
      </Typography>

      {pedidos.length === 0 && (
        <Alert severity="info">No tenés pedidos todavía.</Alert>
      )}

      {pedidos.map((pedido) => (
        <Card
          key={pedido._id}
          sx={{ mb: 3, borderRadius: 3, boxShadow: 3, p: 2 }}
        >
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography variant="h6" fontWeight="bold">
                Pedido #{pedido._id.slice(-6)}
              </Typography>

              <Chip
                label={pedido.estado.toUpperCase()}
                color={getEstadoColor(pedido.estado)}
              />
            </Box>

            <Typography variant="body2" color="text.secondary" mb={1}>
              Fecha: {formatDate(pedido.fechaCreacion)}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Productos:
            </Typography>

            {pedido.productos.map((item) => (
              <Box
                key={item._id}
                display="flex"
                justifyContent="space-between"
                mb={1}
              >
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

            <Typography
              variant="h6"
              fontWeight="bold"
              textAlign="right"
              color="primary"
            >
              Total: {formatCurrency(pedido.total)}
            </Typography>

            {pedido.estado !== "entregado" && (
              <Box sx={{ mt: 2, textAlign: "right" }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Cancel />}
                  onClick={() => cancelarPedido(pedido._id)}
                  size="small"
                >
                  Cancelar Pedido
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default MisPedidos;
