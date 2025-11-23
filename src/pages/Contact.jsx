import { Container, Form, Button, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import axios from "axios";
import "../pages/Contact.css";
import Swal from "sweetalert2";

const Contacto = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();

  const mensajeValor = watch("mensaje", "");

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:5000/api/contacto", {
        ...data,
        estado: "pendiente",
      });

      Swal.fire({
        title: "Enviado con éxito",
        text: "Tu mensaje fue enviado correctamente",
        icon: "success",
        confirmButtonText: "Aceptar",
      });

      reset();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al enviar el mensaje ❌",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-overlay"></div>

      <Container className="contact-wrapper">
        <div className="contact-grid">
          {/* INFO IZQUIERDA */}
          <div className="contact-info-box">
            <h2 className="contact-title">
              CONTÁCTATE CON
              <br />
              NOSOTROS
            </h2>

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
              <span>Gral. Paz 234 - Tucumán, Argentina</span>
            </div>
          </div>

          {/* FORMULARIO */}
          <div className="contact-form-box">
            <Form onSubmit={handleSubmit(onSubmit)}>
              {/* Nombre */}
              <Form.Group className="mb-3">
                <div className="input-with-icon">
                  <Form.Control
                    type="text"
                    placeholder="Nombre"
                    maxLength={40}
                    minLength={4}
                    {...register("nombre", {
                      required: "El nombre es obligatorio",
                      pattern: {
                        value: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$/,
                        message: "Solo se permiten letras y espacios",
                      },
                    })}
                    isInvalid={!!errors.nombre}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nombre?.message}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>

              {/* Email */}
              <Form.Group className="mb-3">
                <div className="input-with-icon">
                  <Form.Control
                    type="email"
                    placeholder="Correo electrónico"
                    {...register("email", {
                      required: "El correo es obligatorio",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Correo inválido",
                      },
                    })}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email?.message}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>

              {/* Asunto */}
              <Form.Group className="mb-3">
                <div className="input-with-icon">
                  <Form.Control
                    type="text"
                    placeholder="Asunto"
                    maxLength={80}
                    {...register("asunto", {
                      required: "El asunto es obligatorio",
                      minLength: {
                        value: 4,
                        message: "Debe tener mínimo 4 caracteres",
                      },
                    })}
                    isInvalid={!!errors.asunto}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.asunto?.message}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>

              {/* Mensaje */}
              <Form.Group className="mb-3">
                <div className="input-with-icon textarea">
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Mensaje..."
                    {...register("mensaje", {
                      required: "El mensaje es obligatorio",
                      maxLength: {
                        value: 20,
                        message: "Debe tener máximo 20 caracteres",
                      },
                      minLength: {
                        value: 10,
                        message: "Debe tener mínimo 10 caracteres",
                      },
                      validate: (value) =>
                        value.trim().split(/\s+/).length <= 300 ||
                        "Máximo 300 palabras",
                    })}
                    isInvalid={!!errors.mensaje}
                  />

                  <div className="word-counter">
                    {mensajeValor.split(/\s+/).filter(Boolean).length}/300
                    palabras
                  </div>

                  <Form.Control.Feedback type="invalid">
                    {errors.mensaje?.message}
                  </Form.Control.Feedback>
                </div>
              </Form.Group>

              <Button
                className="send-btn"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar mensaje"}
              </Button>
            </Form>
          </div>

          {/* Mapa */}
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.6624139487996!2d-65.20670382466937!3d-26.83668829001595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94225c1eaa92d1d3%3A0x8d1f5b9e0ee1d3e2!2sGral.%20Paz%20234%2C%20San%20Miguel%20de%20Tucum%C3%A1n%2C%20Tucum%C3%A1n!5e0!3m2!1ses!2sar!4v1732400000000!5m2!1ses!2sar"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Contacto;
