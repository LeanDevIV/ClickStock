import { useState, useEffect } from "react";
import clientAxios from "../utils/clientAxios";
import Swal from "sweetalert2";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Container,
  Box,
  Typography,
  CircularProgress,
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  AddCircle as AddCircleIcon,
} from "@mui/icons-material";

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState({
    nombre: "",
    correo: "",
    rol: "usuario",
    contrasenia: "",
  });

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      setCargando(true);
      const { data } = await clientAxios.get("/usuarios");
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      Swal.fire("Error", "No se pudieron cargar los usuarios.", "error");
    } finally {
      setCargando(false);
    }
  };

  const eliminarUsuario = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede revertir.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await clientAxios.delete(`/usuarios/${id}`);
          await obtenerUsuarios();
          Swal.fire("¡Eliminado!", "El usuario ha sido eliminado.", "success");
        } catch (error) {
          console.error("Error al eliminar usuario:", error);
          Swal.fire("Error", "No se pudo eliminar el usuario.", "error");
        }
      }
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditando(false);
    setUsuarioActual({
      nombre: "",
      correo: "",
      rol: "usuario",
      contrasenia: "",
    });
  };

  const handleShowModal = (usuario = null) => {
    if (usuario) {
      setUsuarioActual(usuario);
      setEditando(true);
    }
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUsuarioActual((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        const payload = { ...usuarioActual };
        if (!payload.contrasenia) delete payload.contrasenia;
        await clientAxios.put(`/usuarios/${usuarioActual._id}`, payload);
        Swal.fire("¡Éxito!", "Usuario actualizado correctamente", "success");
      } else {
        await clientAxios.post(`/usuarios/registro`, usuarioActual);
        Swal.fire("¡Éxito!", "Usuario creado correctamente", "success");
      }
      handleCloseModal();
      await obtenerUsuarios();
    } catch (error) {
      console.error("Error:", error);
      const message =
        error.response?.data?.message ||
        "Hubo un problema al procesar la solicitud";
      Swal.fire("Error", message, "error");
    }
  };

  const cambiarRol = async (usuario) => {
    const nuevoRol = usuario.rol === "admin" ? "usuario" : "admin";
    try {
      const { data } = await clientAxios.put(`/usuarios/${usuario._id}/rol`, {
        rol: nuevoRol,
      });
      Swal.fire("¡Listo!", data.message || "Rol actualizado", "success");
      await obtenerUsuarios();
    } catch (error) {
      console.error("Error al cambiar rol:", error);
      const message =
        error.response?.data?.message || "No se pudo cambiar el rol";
      Swal.fire("Error", message, "error");
    }
  };

  return (
    <Container sx={{ my: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h2"
            color="primary"
            fontWeight="bold"
          >
            Gestión de Usuarios
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Administra usuarios y roles
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddCircleIcon />}
          onClick={() => handleShowModal()}
        >
          Agregar Usuario
        </Button>
      </Box>

      <Dialog
        open={showModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editando ? "Editar Usuario" : "Crear Nuevo Usuario"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Nombre de Usuario"
              name="nombre"
              value={usuarioActual.nombre}
              onChange={handleInputChange}
              required
              margin="normal"
            />

            <TextField
              fullWidth
              label="Email"
              name="correo"
              type="email"
              value={usuarioActual.correo}
              onChange={handleInputChange}
              required
              margin="normal"
            />

            <TextField
              fullWidth
              select
              label="Rol"
              name="rol"
              value={usuarioActual.rol}
              onChange={handleInputChange}
              margin="normal"
            >
              <MenuItem value="usuario">usuario</MenuItem>
              <MenuItem value="admin">admin</MenuItem>
            </TextField>

            <TextField
              fullWidth
              label={`Contraseña ${
                editando ? "(dejar en blanco para mantener)" : ""
              }`}
              name="contrasenia"
              type="password"
              value={usuarioActual.contrasenia}
              onChange={handleInputChange}
              required={!editando}
              margin="normal"
              inputProps={{ minLength: 6 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editando ? "Guardar Cambios" : "Crear Usuario"}
          </Button>
        </DialogActions>
      </Dialog>

      {cargando ? (
        <Box sx={{ textAlign: "center", py: 5 }}>
          <CircularProgress />
          <Typography sx={{ mt: 3 }} color="text.secondary">
            Cargando usuarios...
          </Typography>
        </Box>
      ) : usuarios.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 5 }}>
          <Typography color="text.secondary">
            No hay usuarios cargados aún.
          </Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "primary.light" }}>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map((usuario) => (
                <TableRow key={usuario._id} hover>
                  <TableCell>{usuario.nombre}</TableCell>
                  <TableCell>{usuario.correo}</TableCell>
                  <TableCell>{usuario.rol}</TableCell>
                  <TableCell align="center">
                    <ButtonGroup variant="contained" size="small">
                      <Button
                        color="warning"
                        startIcon={<EditIcon />}
                        onClick={() => handleShowModal(usuario)}
                      >
                        Editar
                      </Button>
                      <Button
                        color={usuario.rol === "admin" ? "inherit" : "info"}
                        onClick={() => cambiarRol(usuario)}
                        title={
                          usuario.rol === "admin"
                            ? "Hacer usuario"
                            : "Hacer admin"
                        }
                      >
                        {usuario.rol === "admin"
                          ? "Quitar admin"
                          : "Hacer admin"}
                      </Button>
                      <Button
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => eliminarUsuario(usuario._id)}
                      >
                        Eliminar
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default AdminUsuarios;
