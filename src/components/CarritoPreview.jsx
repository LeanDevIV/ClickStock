import { useEffect, useState } from "react";
import { Offcanvas, ListGroup, Button, Badge } from "react-bootstrap";
import { obtenerCarrito } from "../services/carritoService";
import { Link } from "react-router-dom";

const CarritoPreview = ({ show, handleClose }) => {
  const [carrito, setCarrito] = useState({ productos: [], total: 0 });

  useEffect(() => {
    if (show) {
      cargarCarrito();
    }
  }, [show]);

  const cargarCarrito = async () => {
    try {
      const data = await obtenerCarrito();
      setCarrito(data);
    } catch (error) {
      console.error("Error al cargar carrito:", error);
    }
  };

  const ultimosCinco = carrito.productos.slice(-5).reverse();

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Carrito (últimos 5)</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body>
        {ultimosCinco.length === 0 ? (
          <p className="text-center text-muted">El carrito está vacío.</p>
        ) : (
          <ListGroup>
            {ultimosCinco.map((item, idx) => (
              <ListGroup.Item key={idx} className="d-flex justify-content-between">
                <span>{item.producto?.nombre || "Producto"}</span>
                <Badge bg="primary">x{item.cantidad}</Badge>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}

        <hr />

        <div className="d-flex justify-content-between fw-bold fs-5">
          <span>Total:</span>
          <span>${carrito.total}</span>
        </div>

        <Button
          as={Link}
          to="/carrito"
          className="mt-3 w-100"
          variant="success"
          onClick={handleClose}
        >
          Ir al carrito completo
        </Button>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default CarritoPreview;
