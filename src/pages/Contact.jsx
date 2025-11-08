import { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert } from "react-bootstrap";
import "../pages/Contact.css";

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });

  const [alert, setAlert] = useState({ show: false, variant: "", message: "" });
  const [validated, setValidated] = useState(false);

  // handleChange con validaciones
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validación de máximo 300 palabras (solo para "mensaje")
    if (name === "mensaje") {
      const words = value.trim().split(/\s+/);
      if (words.length > 300) return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

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
      setValidated(false);
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
    <Container className="py-5 contact-container" style={{ maxWidth: "600px" }}>
      <h2 className="text-center mb-4 fw-bold text-uppercase">
        Formulario de contacto
      </h2>

      {alert.show && (
        <Alert
          variant={alert.variant}
          onClose={() => setAlert({ show: false })}
          dismissible
        >
          {alert.message}
        </Alert>
      )}

      {/*Activamos las validaciones de Bootstrap */}
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        {/*Nombre */}
        <Form.Group className="mb-3" controlId="formNombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            placeholder="Tu nombre..."
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            maxLength={40}
            pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$"
          />
          <Form.Control.Feedback type="invalid">
            El nombre solo puede contener letras y hasta 40 caracteres.
          </Form.Control.Feedback>
        </Form.Group>

        {/*Email */}
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="tuemail@mail.com"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            // pattern="^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
          />
          <Form.Control.Feedback type="invalid">
            Ingresá un correo electrónico válido.
          </Form.Control.Feedback>
        </Form.Group>

        {/* Asunto */}
        <Form.Group className="mb-3" controlId="formAsunto">
          <Form.Label>Asunto</Form.Label>
          <Form.Control
            type="text"
            placeholder="Motivo del mensaje"
            name="asunto"
            value={formData.asunto}
            onChange={handleChange}
            required
            maxLength={80}
          />
          <Form.Control.Feedback type="invalid">
            El asunto no puede superar los 80 caracteres.
          </Form.Control.Feedback>
        </Form.Group>

        {/*Mensaje */}
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
          <small className="text-muted"></small>
          <Form.Control.Feedback type="invalid">
            El mensaje no puede exceder las 300 palabras.
          </Form.Control.Feedback>
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
