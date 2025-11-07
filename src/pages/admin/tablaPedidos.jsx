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
} from "@mui/material";
import {
  AddCircle as AddCircleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalShipping as LocalShippingIcon,
} from "@mui/icons-material";
import CrearPedidosModal from "./CrearPedidosModal";
import EditarPedidosModal from "./editarPedidosModal";
import "../../css/tablaPedidos.css";

const TablaPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [pedidoEditando, setPedidoEditando] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("todos");

  const obtenerPedidos = async () => {
    try {
      setCargando(true);
      const response = await fetch("http://localhost:5000/api/pedidos");
      if (response.ok) {
        const data = await response.json();
        setPedidos(data.pedidos || data);
      }
    } catch (error) {
      // Error silencioso
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

  const manejarEditarPedido = async (pedidoActualizado) => {
    try {
      setPedidos(pedidos.map(p => p._id === pedidoActualizado._id ? pedidoActualizado : p));
      await fetch(`http://localhost:5000/api/pedidos/${pedidoActualizado._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedidoActualizado),
      });
      setPedidoEditando(null);
    } catch (err) {
      alert("Error al editar pedido: " + err.message);
    }
  };

  const manejarEliminarPedido = async (pedidoId) => {
    if (!window.confirm("¿Seguro que deseas eliminar este pedido?")) return;
    try {
      setPedidos(pedidos.filter(p => p._id !== pedidoId));
      await fetch(`http://localhost:5000/api/pedidos/${pedidoId}`, {
        method: "DELETE",
      });
    } catch (err) {
      alert("Error al eliminar pedido: " + err.message);
    }
  };

  const getEstadoClass = (estado) => `estado-${estado}`;

  const pedidosFiltrados = filtroEstado === "todos" 
    ? pedidos 
    : pedidos.filter(p => p.estado === filtroEstado);

  const pedidosPendientes = pedidos.filter(p => p.estado === "pendiente").length;
  const pedidosEntregados = pedidos.filter(p => p.estado === "entregado").length;

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
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
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
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography fontWeight="bold" color="text.primary">
                  Filtrar por estado:
                </Typography>
                <Select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  size="small"
                  sx={{ minWidth: 150 }}
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
                <Chip label={`Total: ${pedidos.length}`} color="primary" variant="outlined" />
                <Chip label={`Pendiente: ${pedidosPendientes}`} color="warning" variant="outlined" />
                <Chip label={`Entregado: ${pedidosEntregados}`} color="success" variant="outlined" />
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
                  <TableCell className="tabla-celda-cabecera" width="60">#</TableCell>
                  <TableCell className="tabla-celda-cabecera tabla-celda-cliente">Cliente</TableCell>
                  <TableCell className="tabla-celda-cabecera tabla-celda-productos">Productos</TableCell>
                  <TableCell className="tabla-celda-cabecera tabla-celda-productos">Dirección de Envío</TableCell>
                  <TableCell className="tabla-celda-cabecera tabla-celda-total">Total</TableCell>
                  <TableCell className="tabla-celda-cabecera tabla-celda-estado">Estado</TableCell>
                  <TableCell className="tabla-celda-cabecera tabla-celda-fecha">Fecha</TableCell>
                  <TableCell className="tabla-celda-cabecera tabla-celda-acciones">Acciones</TableCell>
                </TableRow>
              </TableHead>
              
              <TableBody>
                {pedidosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="estado-vacio">
                      <Typography variant="h6" color="text.secondary" gutterBottom>
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
                          {pedido.usuario.nombreUsuario}
                        </Typography>
                        <Typography className="texto-email" title={pedido.usuario.email}>
                          {pedido.usuario.email}
                        </Typography>
                      </TableCell>

                      <TableCell className="tabla-celda tabla-celda-productos">
                        <Box className="contenedor-chips">
                          {pedido.productos.map((item, idx) => (
                            <Chip
                              key={idx}
                              label={`${item.producto.nombre} (x${item.cantidad})`}
                              size="small"
                              className="chip-producto"
                              variant="outlined"
                              title={`${item.producto.nombre} - Cantidad: ${item.cantidad}`}
                            />
                          ))}
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Typography className="texto-cliente">
                          {pedido.direccion}
                        </Typography>
                      </TableCell>

                      <TableCell className="tabla-celda tabla-celda-total">
                        <Typography variant="subtitle1" fontWeight="bold" color="primary">
                          ${pedido.total}
                        </Typography>
                      </TableCell>

                      <TableCell className="tabla-celda tabla-celda-estado">
                        <Chip
                          label={pedido.estado}
                          className={getEstadoClass(pedido.estado)}
                          size="small"
                        />
                      </TableCell>

                      <TableCell className="tabla-celda tabla-celda-fecha">
                        <Typography variant="body2">
                          {new Date(pedido.fechaCreacion).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(pedido.fechaCreacion).toLocaleTimeString()}
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
                              onClick={() => manejarEliminarPedido(pedido._id)}
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
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 3, py: 1.5, backgroundColor: "#fafafa", borderTop: "1px solid #e0e0e0" }}>
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
        onPedidoEditado={manejarEditarPedido}
      />
    </Box>
  );
};

export default TablaPedidos;