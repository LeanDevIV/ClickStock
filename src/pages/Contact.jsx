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
  const [errors, setErrors] = useState({});

  // Validaciones personalizadas
  const validateFields = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    } else if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$/.test(formData.nombre)) {
      newErrors.nombre = "Solo se permiten letras y espacios";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Correo inválido";
    }

    if (!formData.asunto.trim()) {
      newErrors.asunto = "El asunto es obligatorio";
    } else if (formData.asunto.length < 3) {
      newErrors.asunto = "Debe tener al menos 3 caracteres";
    }

    if (!formData.mensaje.trim()) {
      newErrors.mensaje = "El mensaje es obligatorio";
    } else if (formData.mensaje.length < 10) {
      newErrors.mensaje = "Debe tener mínimo 10 caracteres";
    }

    return newErrors;
  };

  // Control de inputs + limite palabras
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mensaje") {
      const words = value.trim().split(/\s+/);
      if (words.length > 300) return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setValidated(true);
      return;
    }

    setErrors({});
    setValidated(false);

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
    <div className="contact-page">
      <div className="contact-overlay"></div>

      <Container className="contact-wrapper">
        <div className="contact-grid">

          {/* COLUMNA IZQUIERDA */}
          <div className="contact-info-box">
            <h2 className="contact-title">CONTÁCTATE CON<br />NOSOTROS</h2>

            <div className="info-item">
              <i className="bi bi-telephone-fill"></i>
              <span>+54 381 234 5678</span>
            </div>

            <div className="info-item">
              <i className="bi bi-envelope-fill"></i>
              <span>contacto@mail.com</span>
            </div>

            <div className="info-item">
              <i className="bi bi-geo-alt-fill"></i>
              <span>, Argentina</span>
            </div>
          </div>

          {/* FORMULARIO */}
          <div className="contact-form-box">
            {alert.show && (
              <Alert
                variant={alert.variant}
                onClose={() => setAlert({ show: false })}
                dismissible
              >
                {alert.message}
              </Alert>
            )}

            <Form noValidate validated={validated} onSubmit={handleSubmit}>

              {/* Nombre */}
              <Form.Group className="mb-3">
                <div className="input-with-icon">
                  {/* <i className="bi bi-person-fill"></i> */}
                  <Form.Control
                    type="text"
                    placeholder="Nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    maxLength={40}
                    isInvalid={!!errors.nombre}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nombre}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>

              {/* Email */}
              <Form.Group className="mb-3">
                <div className="input-with-icon">
                  {/* <i className="bi bi-envelope-fill"></i> */}
                  <Form.Control
                    type="email"
                    placeholder="Correo electrónico"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>

              {/* Asunto */}
              <Form.Group className="mb-3">
                <div className="input-with-icon">
                  {/* <i className="bi bi-pencil-fill"></i> */}
                  <Form.Control
                    type="text"
                    placeholder="Asunto"
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleChange}
                    required
                    maxLength={80}
                    isInvalid={!!errors.asunto}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.asunto}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>

              {/* Mensaje */}
              <Form.Group className="mb-3">
                <div className="input-with-icon textarea">
                  {/* <i className="bi bi-chat-left-dots-fill"></i> */}
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Mensaje..."
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                    isInvalid={!!errors.mensaje}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.mensaje}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>

              <Button className="send-btn" type="submit">
                Enviar mensaje
              </Button>
            </Form>
          </div>

        </div>
      </Container>
    </div>
  );
};

export default Contacto;
