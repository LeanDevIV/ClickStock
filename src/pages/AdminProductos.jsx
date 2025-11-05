import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

const ProductosAdmin = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(false);
  const [productoActual, setProductoActual] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria: "",
    imagen: "",
  });

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      setCargando(true);
      const { data } = await clientAxios.get("/productos");
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      Swal.fire("Error", "No se pudieron cargar los productos.", "error");
    } finally {
      setCargando(false);
    }
  };

  const eliminarProducto = async (id) => {
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
          await clientAxios.delete(`/productos/${id}`);
          await obtenerProductos();
          Swal.fire("¡Eliminado!", "El producto ha sido eliminado.", "success");
        } catch (error) {
          console.error("Error al eliminar producto:", error);
          Swal.fire("Error", "No se pudo eliminar el producto.", "error");
        }
      }
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditando(false);
    setProductoActual({
      nombre: "",
      descripcion: "",
      precio: "",
      stock: "",
      categoria: "",
      imagen: "",
    });
  };

  const handleShowModal = (producto = null) => {
    if (producto) {
      setProductoActual(producto);
      setEditando(true);
    }
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductoActual((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await clientAxios.put(`/productos/${productoActual._id}`, productoActual);
        Swal.fire("¡Éxito!", "Producto actualizado correctamente", "success");
      } else {
        await clientAxios.post("/productos", productoActual);
        Swal.fire("¡Éxito!", "Producto creado correctamente", "success");
      }
      handleCloseModal();
      await obtenerProductos();
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "Hubo un problema al procesar la solicitud", "error");
    }
  };

  return (
    <Container className="my-4">
      {/* Encabezado */}
      <Row className="align-items-center mb-4">
        <Col>
          <h2 className="fw-bold text-primary mb-0">Gestión de Productos</h2>
          <small className="text-muted">
            Administra tus productos fácilmente
          </small>
        </Col>
        <Col className="text-end">
          <Button
            variant="success"
            className="d-flex align-items-center gap-2"
            onClick={() => handleShowModal()}
          >
            <PlusCircle /> Agregar Producto
          </Button>
        </Col>
      </Row>

      {/* Modal para crear/editar producto */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editando ? "Editar Producto" : "Crear Nuevo Producto"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Producto</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={productoActual.nombre}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                value={productoActual.descripcion}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                name="precio"
                value={productoActual.precio}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                name="stock"
                value={productoActual.stock}
                onChange={handleInputChange}
                required
                min="0"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                type="text"
                name="categoria"
                value={productoActual.categoria}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>URL de la Imagen</Form.Label>
              <Form.Control
                type="url"
                name="imagen"
                value={productoActual.imagen}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <div className="text-end">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                {editando ? "Guardar Cambios" : "Crear Producto"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Tabla de productos */}
      {cargando ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Cargando productos...</p>
        </div>
      ) : productos.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p>No hay productos cargados aún.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <Table bordered hover striped className="align-middle shadow-sm">
            <thead className="table-primary">
              <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto._id}>
                  <td>{producto.nombre}</td>
                  <td>${producto.precio}</td>
                  <td>{producto.stock}</td>
                  <td className="text-center">
                    <ButtonGroup>
                      <Button
                        variant="warning"
                        size="sm"
                        className="d-flex align-items-center gap-1"
                        onClick={() => handleShowModal(producto)}
                      >
                        <PencilSquare /> Editar
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="d-flex align-items-center gap-1"
                        onClick={() => eliminarProducto(producto._id)}
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

export default ProductosAdmin;
