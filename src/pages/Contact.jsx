import { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert } from "react-bootstrap";

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });

  const [alert, setAlert] = useState({ show: false, variant: "", message: "" });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/contacto", {
        ...formData,
        estado: "pendiente",
      });

      setAlert({
        show: true,
        variant: "success",
        message: "✅ Tu mensaje fue enviado correctamente.",
      });

      setFormData({ nombre: "", email: "", asunto: "", mensaje: "" });
    } catch (error) {
      console.error(error);
      setAlert({
        show: true,
        variant: "danger",
        message: "❌ Ocurrió un error al enviar el mensaje.",
      });
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: "600px" }}>
      <h2 className="text-center mb-4 fw-bold text-uppercase">Contacto</h2>

      {alert.show && (
        <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
          {alert.message}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formNombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            placeholder="Tu nombre..."
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="tuemail@mail.com"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formAsunto">
          <Form.Label>Asunto</Form.Label>
          <Form.Control
            type="text"
            placeholder="Motivo del mensaje"
            name="asunto"
            value={formData.asunto}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="formMensaje">
          <Form.Label>Mensaje</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Escribí tu mensaje..."
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <div className="text-center">
          <Button variant="dark" type="submit" className="px-4">
            Enviar
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default Contacto;
