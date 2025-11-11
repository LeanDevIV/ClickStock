import { useState, useEffect } from "react";
import clientAxios from "../utils/clientAxios";
import Swal from "sweetalert2";
import {
  Table,
  Button,
  Container,
  Row,
  Col,
  Spinner,
  ButtonGroup,
  Modal,
  Form,
} from "react-bootstrap";
import { PencilSquare, TrashFill, PlusCircle } from "react-bootstrap-icons";

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState({
    nombreUsuario: "",
    emailUsuario: "",
    rolUsuario: "usuario",
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
      nombreUsuario: "",
      emailUsuario: "",
      rolUsuario: "usuario",
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
        // Si se está editando, si se modificó rol se puede usar endpoint /:id/rol
        const payload = { ...usuarioActual };
        // No enviar contrasenia vacía en edición
        if (!payload.contrasenia) delete payload.contrasenia;
        await clientAxios.put(`/usuarios/${usuarioActual._id}`, payload);
        Swal.fire("¡Éxito!", "Usuario actualizado correctamente", "success");
      } else {
        // Para creación usa el endpoint de registro
        await clientAxios.post(`/usuarios/registro`, usuarioActual);
        Swal.fire("¡Éxito!", "Usuario creado correctamente", "success");
      }
      handleCloseModal();
      await obtenerUsuarios();
    } catch (error) {
      console.error("Error:", error);
      const message = error.response?.data?.message || "Hubo un problema al procesar la solicitud";
      Swal.fire("Error", message, "error");
    }
  };

  const cambiarRol = async (usuario) => {
    const nuevoRol = usuario.rolUsuario === "admin" ? "usuario" : "admin";
    try {
      const { data } = await clientAxios.put(`/usuarios/${usuario._id}/rol`, { rolUsuario: nuevoRol });
      Swal.fire("¡Listo!", data.message || "Rol actualizado", "success");
      await obtenerUsuarios();
    } catch (error) {
      console.error("Error al cambiar rol:", error);
      const message = error.response?.data?.message || "No se pudo cambiar el rol";
      Swal.fire("Error", message, "error");
    }
  };

  return (
    <Container className="my-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h2 className="fw-bold text-primary mb-0">Gestión de Usuarios</h2>
          <small className="text-muted">Administra usuarios y roles</small>
        </Col>
        <Col className="text-end">
          <Button
            variant="success"
            className="d-flex align-items-center gap-2"
            onClick={() => handleShowModal()}
          >
            <PlusCircle /> Agregar Usuario
          </Button>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editando ? "Editar Usuario" : "Crear Nuevo Usuario"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de Usuario</Form.Label>
              <Form.Control
                type="text"
                name="nombreUsuario"
                value={usuarioActual.nombreUsuario}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="emailUsuario"
                value={usuarioActual.emailUsuario}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select name="rolUsuario" value={usuarioActual.rolUsuario} onChange={handleInputChange}>
                <option value="usuario">usuario</option>
                <option value="admin">admin</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña {editando ? "(dejar en blanco para mantener)" : ""}</Form.Label>
              <Form.Control
                type="password"
                name="contrasenia"
                value={usuarioActual.contrasenia}
                onChange={handleInputChange}
                minLength={6}
                {...(editando ? {} : { required: true })}
              />
            </Form.Group>

            <div className="text-end">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                {editando ? "Guardar Cambios" : "Crear Usuario"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {cargando ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Cargando usuarios...</p>
        </div>
      ) : usuarios.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p>No hay usuarios cargados aún.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <Table bordered hover striped className="align-middle shadow-sm">
            <thead className="table-primary">
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario._id}>
                  <td>{usuario.nombreUsuario}</td>
                  <td>{usuario.emailUsuario}</td>
                  <td>{usuario.rolUsuario}</td>
                  <td className="text-center">
                    <ButtonGroup>
                      <Button
                        variant="warning"
                        size="sm"
                        className="d-flex align-items-center gap-1"
                        onClick={() => handleShowModal(usuario)}
                      >
                        <PencilSquare /> Editar
                      </Button>
                      <Button
                        variant={usuario.rolUsuario === "admin" ? "secondary" : "info"}
                        size="sm"
                        onClick={() => cambiarRol(usuario)}
                        title={usuario.rolUsuario === "admin" ? "Hacer usuario" : "Hacer admin"}
                      >
                        {usuario.rolUsuario === "admin" ? "Quitar admin" : "Hacer admin"}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="d-flex align-items-center gap-1"
                        onClick={() => eliminarUsuario(usuario._id)}
                      >
                        <TrashFill /> Eliminar
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default AdminUsuarios;
