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
  IconButton,
  Tooltip,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
} from "@mui/material";
import {
  AddCircle as AddCircleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalShipping as LocalShippingIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";

import { Toaster, toast } from "react-hot-toast";
import clientaxios from "../../utils/clientAxios.js";

const CrearPedidosModal = React.lazy(() => import("./CrearPedidosModal.jsx"));
const EditarPedidosModal = React.lazy(() => import("./EditarPedidosModal.jsx"));

const TablaPedidos = () => {
  const theme = useTheme();

  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [pedidoEditando, setPedidoEditando] = useState(null);

  const [filtroEstado, setFiltroEstado] = useState("todos");

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

  const manejarPedidoCreado = (nuevo) => {
    setPedidos([nuevo, ...pedidos]);
    setModalCrearAbierto(false);
  };

  const manejarPedidoEditado = (actualizado) => {
    setPedidos((prev) =>
      prev.map((p) => (p._id === actualizado._id ? actualizado : p))
    );
    setPedidoEditando(null);
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
      await clientaxios.delete(`/pedidos/permanent/${pedidoAEliminar._id}`);
      setPedidos((prev) => prev.filter((p) => p._id !== pedidoAEliminar._id));

      toast.success("Pedido eliminado correctamente.", { id: toastId });
      setConfirmarBorrado(false);
    } catch (error) {
      toast.error("Error al eliminar el pedido.", { id: toastId });
      console.error("Error al eliminar el pedido:", error);
    } finally {
      setCargandoEliminar(false);
    }
  };
  const pedidosFiltrados =
    filtroEstado === "todos"
      ? pedidos
      : pedidos.filter((p) => p.estado === filtroEstado);

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

      {/* HEADER */}
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

          <Typography color="text.secondary">
            Administra y crea nuevos pedidos
          </Typography>
        </Grid>

        <Grid>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddCircleIcon />}
            onClick={() => setModalCrearAbierto(true)}
            sx={{ px: 3, py: 1.2, fontWeight: "bold" }}
          >
            Cargar pedido
          </Button>
        </Grid>
      </Grid>

      {/* TABLA */}
      <Card>
        <CardHeader
          title={
            <Box
              display="flex"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={2}
            >
              {/* FILTRO */}
              <Box display="flex" alignItems="center" gap={2}>
                <Typography fontWeight="bold">Filtrar por estado:</Typography>
                <Select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
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
              </Box>

              {/* RESUMEN */}
              <Box display="flex" gap={1} flexWrap="wrap">
                <Chip
                  label={`Total: ${pedidos.length}`}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={`Pendientes: ${
                    pedidos.filter((p) => p.estado === "pendiente").length
                  }`}
                  color="warning"
                  variant="outlined"
                />
                <Chip
                  label={`Entregados: ${
                    pedidos.filter((p) => p.estado === "entregado").length
                  }`}
                  color="success"
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
                  <TableCell>Fecha</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {pedidosPaginados.map((pedido, index) => (
                  <TableRow key={pedido._id} hover>
                    <TableCell>{index + 1}</TableCell>

                    <TableCell>
                      <Typography fontWeight="bold">
                        {pedido.usuario?.nombre}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {pedido.usuario?.correo}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {pedido.productos.map((p, i) => (
                        <Chip
                          key={i}
                          size="small"
                          label={`${p.producto?.nombre} (x${p.cantidad})`}
                          variant="outlined"
                          sx={{ m: 0.3 }}
                        />
                      ))}
                    </TableCell>

                    <TableCell>{pedido.direccion || "N/A"}</TableCell>

                    <TableCell>
                      <Typography fontWeight="bold" color="primary">
                        ${pedido.total}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={pedido.estado}
                        color={
                          pedido.estado === "pendiente"
                            ? "warning"
                            : pedido.estado === "entregado"
                            ? "success"
                            : "default"
                        }
                        size="small"
                      />
                    </TableCell>

                    <TableCell>
                      {new Date(pedido.fechaCreacion).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      <Tooltip title="Editar">
                        <IconButton
                          onClick={() => setPedidoEditando(pedido)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Eliminar">
                        <IconButton
                          color="error"
                          onClick={() => iniciarEliminarPedido(pedido)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}

                {pedidosPaginados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
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

      {/* PAGINACIÓN */}
      {pedidosFiltrados.length > 0 && (
        <Box display="flex" justifyContent="center" my={3}>
          <Pagination
            count={totalPaginas}
            page={pagina}
            onChange={(e, v) => setPagina(v)}
            color="primary"
          />
        </Box>
      )}

      {/* MODALES */}
      <React.Suspense fallback={null}>
        {modalCrearAbierto && (
          <CrearPedidosModal
            show={modalCrearAbierto}
            onHide={() => setModalCrearAbierto(false)}
            onPedidoCreado={manejarPedidoCreado}
          />
        )}

        {pedidoEditando && (
          <EditarPedidosModal
            show={!!pedidoEditando}
            onHide={() => setPedidoEditando(null)}
            pedido={pedidoEditando}
            onPedidoEditado={manejarPedidoEditado}
            setPedidos={setPedidos}
            pedidos={pedidos}
          />
        )}
      </React.Suspense>

      {/* DIALOG ELIMINAR */}
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
            ¿Deseas eliminar el pedido? Esta acción no se puede deshacer.
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
            disabled={cargandoEliminar}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TablaPedidos;
