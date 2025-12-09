import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Chip,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Grid,
  Paper,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import {
  LocalShipping as LocalShippingIcon,
  Warning as WarningIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { Toaster, toast } from "react-hot-toast";
import clientaxios from "../../utils/clientAxios.js";
import FilaTablaPedidos from "./FilaTablaPedidos";

const TablaPedidos = () => {
  const theme = useTheme();

  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroEliminados, setFiltroEliminados] = useState("activos");
  const [pagina, setPagina] = useState(1);
  const itemsPorPagina = 6;
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);
  const [pedidoAEliminar, setPedidoAEliminar] = useState(null);
  const [cargandoEliminar, setCargandoEliminar] = useState(false);

  const obtenerPedidos = async () => {
    try {
      setCargando(true);
      const { data } = await clientaxios.get("/pedidos");
      setPedidos(data.pedidos || data);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
      toast.error("No se pudieron cargar los pedidos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerPedidos();
  }, []);

  const manejarEstadoActualizado = (pedidoActualizado) => {
    setPedidos((prev) =>
      prev.map((pedido) =>
        pedido._id === pedidoActualizado._id ? pedidoActualizado : pedido
      )
    );
  };

  const manejarRestauracion = (pedidoRestaurado) => {
    setPedidos((prev) =>
      prev.map((pedido) =>
        pedido._id === pedidoRestaurado._id ? pedidoRestaurado : pedido
      )
    );
  };

  const iniciarEliminarPedido = (pedido) => {
    setPedidoAEliminar(pedido);
    setConfirmarBorrado(true);
  };

  const ejecutarEliminarPedido = async () => {
    if (!pedidoAEliminar) return;

    setCargandoEliminar(true);
    const toastId = toast.loading("Eliminando pedido...");

    try {
      await clientaxios.delete(`/pedidos/${pedidoAEliminar._id}`);
      setPedidos((prev) =>
        prev.map((pedido) =>
          pedido._id === pedidoAEliminar._id 
            ? { ...pedido, isDeleted: true } 
            : pedido
        )
      );

      toast.success("Pedido eliminado correctamente.", { id: toastId });
      setConfirmarBorrado(false);
    } catch (error) {
      toast.error("Error al eliminar el pedido.", { id: toastId });
      console.error("Error al eliminar el pedido:", error);
    } finally {
      setCargandoEliminar(false);
    }
  };

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const cumpleEstado = filtroEstado === "todos" || pedido.estado === filtroEstado;
    const cumpleEliminado = 
      filtroEliminados === "todos" ||
      (filtroEliminados === "activos" && !pedido.isDeleted) ||
      (filtroEliminados === "eliminados" && pedido.isDeleted);
    
    return cumpleEstado && cumpleEliminado;
  });

  const totalPaginas = Math.ceil(pedidosFiltrados.length / itemsPorPagina);

  const pedidosPaginados = pedidosFiltrados.slice(
    (pagina - 1) * itemsPorPagina,
    pagina * itemsPorPagina
  );

  if (cargando) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={10}>
        <CircularProgress size={60} />
        <Typography sx={{ mt: 2 }}>Cargando pedidos...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Toaster />
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Grid>
          <Typography variant="h4" fontWeight="bold" color="primary">
            <LocalShippingIcon sx={{ mr: 1 }} />
            Gestión de Pedidos
          </Typography>

          <Typography color="text.secondary">Administra los pedidos</Typography>
        </Grid>
      </Grid>
      <Card>
        <CardHeader
          title={
            <Box
              display="flex"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={2}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Typography fontWeight="bold">Filtrar por estado:</Typography>
                <Select
                  value={filtroEstado}
                  onChange={(event) => setFiltroEstado(event.target.value)}
                  size="small"
                  sx={{
                    minWidth: 150,
                    bgcolor: theme.palette.background.paper,
                  }}
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                  <MenuItem value="procesando">Procesando</MenuItem>
                  <MenuItem value="enviado">Enviado</MenuItem>
                  <MenuItem value="entregado">Entregado</MenuItem>
                  <MenuItem value="cancelado">Cancelado</MenuItem>
                </Select>

                <Typography fontWeight="bold" sx={{ ml: 2 }}>
                  Mostrar:
                </Typography>
                <ToggleButtonGroup
                  value={filtroEliminados}
                  exclusive
                  onChange={(event, nuevoValor) => {
                    if (nuevoValor !== null) setFiltroEliminados(nuevoValor);
                  }}
                  size="small"
                >
                  <ToggleButton value="activos">Activos</ToggleButton>
                  <ToggleButton value="eliminados">Eliminados</ToggleButton>
                  <ToggleButton value="todos">Todos</ToggleButton>
                </ToggleButtonGroup>
              </Box>
              <Box display="flex" gap={1} flexWrap="wrap">
                <Chip
                  label={`Total: ${pedidos.length}`}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={`Pendientes: ${
                    pedidos.filter((pedido) => 
                      pedido.estado === "pendiente" && !pedido.isDeleted
                    ).length
                  }`}
                  color="warning"
                  variant="outlined"
                />
              </Box>
            </Box>
          }
        />

        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Productos</TableCell>
                  <TableCell>Dirección</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="center">Eliminado</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {pedidosPaginados.map((pedido, index) => (
                  <FilaTablaPedidos
                    key={pedido._id}
                    pedido={pedido}
                    index={index}
                    onEliminar={iniciarEliminarPedido}
                    onEstadoActualizado={manejarEstadoActualizado}
                    onRestaurar={manejarRestauracion}
                  />
                ))}

                {pedidosPaginados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 5 }}>
                      <Typography variant="h6" color="text.secondary">
                        No hay pedidos para mostrar
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {pedidosFiltrados.length > 0 && (
        <Box display="flex" justifyContent="center" my={3}>
          <Pagination
            count={totalPaginas}
            page={pagina}
            onChange={(event, value) => setPagina(value)}
            color="primary"
          />
        </Box>
      )}

      <Dialog
        open={confirmarBorrado}
        onClose={() => setConfirmarBorrado(false)}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
          <WarningIcon sx={{ mr: 1, color: "error.main" }} />
          Confirmar eliminación
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            ¿Deseas eliminar el pedido?
            {pedidoAEliminar?.isDeleted && (
              <Typography color="error" sx={{ mt: 1 }}>
                Este pedido ya está eliminado.
              </Typography>
            )}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setConfirmarBorrado(false)}>Cancelar</Button>

          <Button
            variant="contained"
            color="error"
            onClick={ejecutarEliminarPedido}
            startIcon={
              cargandoEliminar ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <DeleteIcon />
              )
            }
            disabled={cargandoEliminar || pedidoAEliminar?.isDeleted}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TablaPedidos;