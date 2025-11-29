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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  AddCircle as AddCircleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalShipping as LocalShippingIcon,
  Warning as WarningIcon, 
} from "@mui/icons-material";
import CrearPedidosModal from "./CrearPedidosModal.jsx";
import EditarPedidosModal from "./EditarPedidosModal.jsx";
import "../../styles/tablaPedidos.css";
import clientaxios from "../../utils/clientAxios.js";
import { Toaster, toast } from "react-hot-toast";

const TablaPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [pedidoEditando, setPedidoEditando] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("todos");

  const [confirmarBorrado, setConfirmarBorrado] = useState(false);
  const [pedidoAEliminar, setPedidoAEliminar] = useState(null);
  const [cargandoEliminar, setCargandoEliminar] = useState(false);

  const obtenerPedidos = async () => {
    try {
      setCargando(true);
      const { data } = await clientaxios.get("/pedidos");
      setPedidos(data.pedidos || data);
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
      if (error.response && error.response.status === 401) {
        toast.error(
          "No autorizado. Necesitas iniciar sesión como administrador."
        );
      } else {
        toast.error("Error al cargar los pedidos.");
      }
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerPedidos();
  }, []);

  const manejarPedidoCreado = (nuevoPedido) => {
    setPedidos([nuevoPedido, ...pedidos]);
    setModalCrearAbierto(false);
  };

  const manejarPedidoEditado = (pedidoActualizado) => {
    setPedidos((prev) =>
      prev.map((p) => (p._id === pedidoActualizado._id ? pedidoActualizado : p))
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
    const toastId = toast.loading("Eliminando pedido y restaurando stock...");

    try {
      await clientaxios.delete(`/pedidos/${pedidoAEliminar._id}`);
      setPedidos((prev) => prev.filter((p) => p._id !== pedidoAEliminar._id));

      toast.success("Pedido eliminado correctamente y stock restaurado", {
        id: toastId,
      });
      setConfirmarBorrado(false);
      setPedidoAEliminar(null);
    } catch (err) {
      console.error("Error al eliminar pedido:", err);
      toast.error(
        "Error al eliminar pedido: " +
          (err.response?.data?.error || err.message),
        { id: toastId }
      );
    } finally {
      setCargandoEliminar(false);
    }
  };

  const getEstadoClass = (estado) => `estado-${estado}`;

  const pedidosFiltrados =
    filtroEstado === "todos"
      ? pedidos
      : pedidos.filter((p) => p.estado === filtroEstado);

  const pedidosPendientes = pedidos.filter(
    (p) => p.estado === "pendiente"
  ).length;
  const pedidosEntregados = pedidos.filter(
    (p) => p.estado === "entregado"
  ).length;

  if (cargando) {
    return (
      <Box className="contenedor-cargando">
        <CircularProgress size={60} />
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          Cargando pedidos...
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="contenedor-principal">
      <Toaster />
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Grid>
          <Typography variant="h4" color="primary" fontWeight="bold">
            <LocalShippingIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Gestión de Pedidos
          </Typography>
          <Typography color="text.secondary">
            Administra y crea nuevos pedidos del sistema
          </Typography>
        </Grid>

        <Grid>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddCircleIcon />}
            onClick={() => setModalCrearAbierto(true)}
            sx={{ px: 3, py: 1.2, fontWeight: "bold", fontSize: "1rem" }}
          >
            Cargar pedido
          </Button>
        </Grid>
      </Grid>

      <Card sx={{ borderRadius: 2, boxShadow: 3, overflow: "hidden" }}>
        <CardHeader
          title={
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={2}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Typography fontWeight="bold" color="text.primary">
                  Filtrar por estado:
                </Typography>
                <Select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  size="small"
                  sx={{
                    minWidth: 150,
                    backgroundColor: "#1a1919ff ",
                    color: "white",
                  }}
                >
                  <MenuItem value="todos">Todos los estados</MenuItem>
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                  <MenuItem value="procesando">Procesando</MenuItem>
                  <MenuItem value="enviado">Enviado</MenuItem>
                  <MenuItem value="entregado">Entregado</MenuItem>
                  <MenuItem value="cancelado">Cancelado</MenuItem>
                </Select>
              </Box>

              <Box display="flex" gap={1} flexWrap="wrap">
                <Chip
                  label={`Total: ${pedidos.length}`}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={`Pendiente: ${pedidosPendientes}`}
                  color="warning"
                  variant="outlined"
                />
                <Chip
                  label={`Entregado: ${pedidosEntregados}`}
                  color="success"
                  variant="outlined"
                />
              </Box>
            </Box>
          }
          sx={{ backgroundColor: "#f8f9fa", borderBottom: "1px solid #e0e0e0" }}
        />

        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} className="tabla-contenedor">
            <Table stickyHeader sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow className="tabla-cabecera">
                  <TableCell className="tabla-celda-cabecera" width="60">
                    #
                  </TableCell>
                  <TableCell className="tabla-celda-cabecera tabla-celda-cliente">
                    Cliente
                  </TableCell>
                  <TableCell
                    className="tabla-celda-cabecera tabla-celda-productos"
                    sx={{ width: "30%" }}
                  >
                    Productos
                  </TableCell>
                  <TableCell
                    className="tabla-celda-cabecera tabla-celda-productos"
                    sx={{ width: "20%" }}
                  >
                    Dirección de Envío
                  </TableCell>
                  <TableCell
                    className="tabla-celda-cabecera tabla-celda-total"
                    sx={{ width: "10%" }}
                  >
                    Total
                  </TableCell>
                  <TableCell
                    className="tabla-celda-cabecera tabla-celda-estado"
                    sx={{ width: "10%" }}
                  >
                    Estado
                  </TableCell>
                  <TableCell
                    className="tabla-celda-cabecera tabla-celda-fecha"
                    sx={{ width: "15%" }}
                  >
                    Fecha
                  </TableCell>
                  <TableCell
                    className="tabla-celda-cabecera tabla-celda-acciones"
                    sx={{ width: "5%" }}
                  >
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {pedidosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="estado-vacio">
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        gutterBottom
                      >
                        No hay pedidos
                      </Typography>
                      <Typography color="text.secondary" sx={{ mb: 2 }}>
                        {filtroEstado !== "todos"
                          ? `No se encontraron pedidos con estado "${filtroEstado}"`
                          : "No hay pedidos registrados en el sistema"}
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddCircleIcon />}
                        onClick={() => setModalCrearAbierto(true)}
                        size="small"
                      >
                        Crear primer pedido
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  pedidosFiltrados.map((pedido, index) => (
                    <TableRow key={pedido._id} hover>
                      <TableCell className="tabla-celda">{index + 1}</TableCell>

                      <TableCell className="tabla-celda tabla-celda-cliente">
                        <Typography className="texto-cliente">
                          {pedido.usuario?.nombre || "Cliente no disponible"}
                        </Typography>
                        <Typography
                          className="texto-email"
                          title={
                            pedido.usuario?.correo || "Email no disponible"
                          }
                          variant="caption"
                          color="text.secondary"
                        >
                          {pedido.usuario?.correo || "Email no disponible"}
                        </Typography>
                      </TableCell>

                      <TableCell
                        className="tabla-celda tabla-celda-productos"
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                          py: 1,
                          alignItems: "center",
                        }}
                      >
                        <Box
                          className="contenedor-chips"
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.5,
                          }}
                        >
                          {pedido.productos.map((item, idx) => (
                            <Chip
                              key={idx}
                              label={`${
                                item.producto?.nombre ||
                                "Producto no disponible"
                              } (x${item.cantidad})`}
                              size="small"
                              className="chip-producto"
                              variant="outlined"
                              title={`${
                                item.producto?.nombre ||
                                "Producto no disponible"
                              } - Cantidad: ${item.cantidad}`}
                            />
                          ))}
                        </Box>
                      </TableCell>

                      <TableCell className="tabla-celda">
                        <Typography variant="body2" className="texto-cliente">
                          {pedido.direccion || "Dirección no disponible"}
                        </Typography>
                      </TableCell>

                      <TableCell className="tabla-celda tabla-celda-total">
                        <Typography
                          className="texto-total"
                          variant="subtitle1"
                          fontWeight="bold"
                          color="primary"
                        >
                          ${pedido.total || 0}
                        </Typography>
                      </TableCell>

                      <TableCell className="tabla-celda tabla-celda-estado">
                        <Chip
                          label={pedido.estado || "pendiente"}
                          className={getEstadoClass(
                            pedido.estado || "pendiente"
                          )}
                          size="small"
                        />
                      </TableCell>

                      <TableCell className="tabla-celda tabla-celda-fecha">
                        <Typography variant="body2">
                          {pedido.fechaCreacion
                            ? new Date(
                                pedido.fechaCreacion
                              ).toLocaleDateString()
                            : "Fecha no disponible"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {pedido.fechaCreacion
                            ? new Date(
                                pedido.fechaCreacion
                              ).toLocaleTimeString()
                            : ""}
                        </Typography>
                      </TableCell>

                      <TableCell className="tabla-celda tabla-celda-acciones">
                        <Box className="contenedor-acciones">
                          <Tooltip title="Editar pedido">
                            <IconButton
                              size="small"
                              onClick={() => setPedidoEditando(pedido)}
                              className="boton-accion"
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Eliminar pedido">
                            <IconButton
                              size="small"
                              onClick={() => iniciarEliminarPedido(pedido)}
                              className="boton-accion"
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>

        {pedidosFiltrados.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 3,
              py: 1.5,
              backgroundColor: "#fafafa",
              borderTop: "1px solid #e0e0e0",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Mostrando {pedidosFiltrados.length} de {pedidos.length} pedidos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Última actualización: {new Date().toLocaleTimeString()}
            </Typography>
          </Box>
        )}
      </Card>

      <CrearPedidosModal
        show={modalCrearAbierto}
        onHide={() => setModalCrearAbierto(false)}
        onPedidoCreado={manejarPedidoCreado}
      />

      <EditarPedidosModal
        show={!!pedidoEditando}
        onHide={() => setPedidoEditando(null)}
        pedido={pedidoEditando}
        onPedidoEditado={manejarPedidoEditado}
        setPedidos={setPedidos}
      />
      
      {/* 🆕 MODAL DE CONFIRMACIÓN DE ELIMINACIÓN (MUI Dialog) */}
      <Dialog
        open={confirmarBorrado}
        onClose={() => setConfirmarBorrado(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', alignItems: 'center', color: 'red' }}>
          <WarningIcon sx={{ mr: 1, fontSize: 30 }} />
          {"Confirmar Eliminación de Pedido"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Estás a punto de **eliminar permanentemente el Pedido # {pedidoAEliminar?._id?.slice(-6)}**. 
            
            Esta acción no se puede deshacer y el stock de los productos será restaurado. ¿Estás seguro de que deseas proceder?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
                setConfirmarBorrado(false);
                setPedidoAEliminar(null);
            }} 
            color="primary"
            variant="outlined"
            disabled={cargandoEliminar}
          >
            Cancelar
          </Button>
          <Button 
            onClick={ejecutarEliminarPedido} 
            color="error" 
            variant="contained"
            autoFocus
            startIcon={cargandoEliminar ? <CircularProgress size={16} color="inherit" /> : <DeleteIcon />}
            disabled={cargandoEliminar}
          >
            {cargandoEliminar ? "Eliminando..." : "Sí, Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TablaPedidos;