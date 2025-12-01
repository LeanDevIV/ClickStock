import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Avatar,
  Tooltip,
  Card,
  CardHeader,
  CardContent,
  CircularProgress,
  Grid,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { usePromocionStore } from "../../hooks/usePromocionStore";
import {
  formatearRangoFechas,
  diasRestantes,
} from "../../utils/promocionUtils";
import { THEME } from "../../config/adminConfig";

const TablaPromociones = ({ onEdit }) => {
  const { promociones, obtenerPromociones, eliminarPromocion } =
    usePromocionStore();
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("todos");

  useEffect(() => {
    const cargar = async () => {
      try {
        await obtenerPromociones();
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [obtenerPromociones]);

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta promoción?")) {
      await eliminarPromocion(id);
    }
  };

  const obtenerEstadoPromocion = (promocion) => {
    const dias = diasRestantes(promocion);
    if (!promocion.activa) return { label: "Inactiva", color: "default" };
    if (dias < 0) return { label: "Expirada", color: "error" };
    if (dias === 0) return { label: "Último día", color: "warning" };
    if (dias <= 3) return { label: `${dias} días`, color: "warning" };
    return { label: "Activa", color: "success" };
  };

  const promocionesFiltradas =
    filtroEstado === "todos"
      ? promociones
      : filtroEstado === "activas"
      ? promociones.filter((p) => p.activa && diasRestantes(p) >= 0)
      : filtroEstado === "expiradas"
      ? promociones.filter((p) => diasRestantes(p) < 0)
      : promociones.filter((p) => !p.activa);

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={10}>
        <CircularProgress size={60} />
        <Typography sx={{ mt: 2 }}>Cargando promociones...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Grid>
          <Typography variant="h4" fontWeight="bold" color="primary">
            <LocalOfferIcon sx={{ mr: 1 }} />
            Gestión de Promociones
          </Typography>
          <Typography color="text.secondary">
            Administra las promociones activas
          </Typography>
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
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  size="small"
                  sx={{ minWidth: 150 }}
                >
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="activas">Activas</MenuItem>
                  <MenuItem value="expiradas">Expiradas</MenuItem>
                  <MenuItem value="inactivas">Inactivas</MenuItem>
                </Select>
              </Box>
              <Box display="flex" gap={1} flexWrap="wrap">
                <Chip
                  label={`Total: ${promociones.length}`}
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  label={`Activas: ${
                    promociones.filter((p) => p.activa && diasRestantes(p) >= 0)
                      .length
                  }`}
                  color="success"
                  variant="outlined"
                />
                <Chip
                  label={`Expiradas: ${
                    promociones.filter((p) => diasRestantes(p) < 0).length
                  }`}
                  color="error"
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
                  <TableCell
                    sx={{
                      color: THEME.primaryColor,
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      borderBottom: `1px solid ${THEME.primaryColor}`,
                    }}
                  >
                    Promoción
                  </TableCell>
                  <TableCell
                    sx={{
                      color: THEME.primaryColor,
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      borderBottom: `1px solid ${THEME.primaryColor}`,
                    }}
                  >
                    Descuento
                  </TableCell>
                  <TableCell
                    sx={{
                      color: THEME.primaryColor,
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      borderBottom: `1px solid ${THEME.primaryColor}`,
                    }}
                  >
                    Productos
                  </TableCell>
                  <TableCell
                    sx={{
                      color: THEME.primaryColor,
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      borderBottom: `1px solid ${THEME.primaryColor}`,
                    }}
                  >
                    Vigencia
                  </TableCell>
                  <TableCell
                    sx={{
                      color: THEME.primaryColor,
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      borderBottom: `1px solid ${THEME.primaryColor}`,
                    }}
                  >
                    Estado
                  </TableCell>
                  <TableCell
                    sx={{
                      color: THEME.primaryColor,
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      borderBottom: `1px solid ${THEME.primaryColor}`,
                    }}
                  >
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {promocionesFiltradas.map((promocion) => {
                  const estado = obtenerEstadoPromocion(promocion);
                  return (
                    <TableRow key={promocion._id} hover>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          {promocion.imagen ? (
                            <Avatar
                              src={`${import.meta.env.VITE_API_URL}${
                                promocion.imagen
                              }`}
                              variant="rounded"
                              sx={{ width: 50, height: 50 }}
                            />
                          ) : (
                            <Avatar
                              variant="rounded"
                              sx={{ width: 50, height: 50 }}
                            >
                              🏷️
                            </Avatar>
                          )}
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              {promocion.titulo}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                display: "-webkit-box",
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {promocion.descripcion}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={`${promocion.descuento}% OFF`}
                          color="error"
                          size="small"
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">
                          {promocion.productos?.length || 0} productos
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="caption" display="block">
                          {formatearRangoFechas(
                            promocion.fechaInicio,
                            promocion.fechaFin
                          )}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={estado.label}
                          color={estado.color}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>

                      <TableCell>
                        <Tooltip title="Ver productos">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => window.open(`/promos`, "_blank")}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onEdit(promocion)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleEliminar(promocion._id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {promocionesFiltradas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                      <Typography variant="h6" color="text.secondary">
                        No hay promociones para mostrar
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TablaPromociones;
