import { useState, useEffect } from "react";
import clientAxios from "../utils/clientAxios";
import Swal from "sweetalert2";
import { Container, Row, Col } from "react-bootstrap";
import {
  Button, 
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ModalProducto from "../components/ModalProductos";
import TablaProductos from "../components/TablaProductos";
import { CircularProgress } from "@mui/material";
import { subirMultiplesArchivos } from "../services/uploadService";

const ProductosAdmin = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(false);
  const [cargandoImagen, setCargandoImagen] = useState(false);
  const [imagenesPreview, setImagenesPreview] = useState([]);
  const [productoActual, setProductoActual] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria: "",
    imagenes: [],
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
    setCargandoImagen(false);
    setImagenesPreview([]);
    setProductoActual({
      nombre: "",
      descripcion: "",
      precio: "",
      stock: "",
      categoria: "",
      imagenes: [],
    });
  };

  const handleShowModal = (producto = null) => {
    if (producto) {
      // Asegurarse de que las imágenes sean un array
      setProductoActual({
        ...producto,
        imagenes: producto.imagenes || (producto.imagen ? [producto.imagen] : []),
      });
      setEditando(true);
    } else {
      setProductoActual({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        categoria: "",
        imagenes: [],
      });
      setEditando(false);
    }
    setImagenesPreview([]);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductoActual((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar subida de archivos
  const handleFileUpload = async (files) => {
    try {
      setCargandoImagen(true);
      setImagenesPreview([]);

      // Crear previews temporales
      const previews = Array.from(files).map((file) => URL.createObjectURL(file));
      setImagenesPreview(previews);

      // Subir archivos
      const urls = await subirMultiplesArchivos(files, "productos");

      // Agregar URLs al producto actual
      setProductoActual((prev) => ({
        ...prev,
        imagenes: [...(prev.imagenes || []), ...urls],
      }));

      // Limpiar previews
      setImagenesPreview([]);
      
      // Liberar URLs de preview
      previews.forEach((url) => URL.revokeObjectURL(url));

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: `${urls.length} imagen(es) subida(s) correctamente`,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error al subir imágenes:", error);
      setImagenesPreview([]);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudieron subir las imágenes",
      });
    } finally {
      setCargandoImagen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que haya al menos una imagen
    if (!productoActual.imagenes || productoActual.imagenes.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Imagen requerida",
        text: "Debes agregar al menos una imagen al producto",
      });
      return;
    }

    try {
      // Preparar datos del producto
      const datosProducto = {
        nombre: productoActual.nombre,
        descripcion: productoActual.descripcion,
        precio: parseFloat(productoActual.precio),
        stock: parseInt(productoActual.stock),
        categoria: productoActual.categoria,
        imagenes: productoActual.imagenes,
      };

      if (editando) {
        await clientAxios.put(
          `/productos/${productoActual._id}`,
          datosProducto
        );
        Swal.fire("¡Éxito!", "Producto actualizado correctamente", "success");
      } else {
        await clientAxios.post("/productos", datosProducto);
        Swal.fire("¡Éxito!", "Producto creado correctamente", "success");
      }
      handleCloseModal();
      await obtenerProductos();
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.error || "Hubo un problema al procesar la solicitud",
      });
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
            variant="contained"
            color="success"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => handleShowModal()}
          >
            Agregar Producto
          </Button>
        </Col>
      </Row>

      {/* MODAL MUI */}
      <ModalProducto
        open={showModal}
        handleClose={handleCloseModal}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        productoActual={productoActual}
        editando={editando}
        handleFileUpload={handleFileUpload}
        imagenesPreview={imagenesPreview}
        cargandoImagen={cargandoImagen}
      />

      {/* Tabla de productos */}
      {cargando ? (
        <div className="text-center py-5">
          <CircularProgress color="primary" />
          <p className="mt-3 text-muted">Cargando productos...</p>
        </div>
      ) : productos.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p>No hay productos cargados aún.</p>
        </div>
      ) : (
        <TablaProductos
        productos={productos}
        handleShowModal={handleShowModal}
        eliminarProducto={eliminarProducto}
      />
        
      )}
    </Container>
  );
};

export default ProductosAdmin;
