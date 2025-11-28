import { Container, TextField, Button, Box, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import "../../styles/contact.css";
import Swal from "sweetalert2";
import { showValidationErrors } from "../../utils/validationErrors";

const Contacto = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();

  const mensajeValor = watch("mensaje", "");

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/contacto/enviar-correo",
        data
      );

      if (res.data.ok) {
        Swal.fire("Éxito", "Tu mensaje ha sido enviado", "success");
        reset();
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Hubo un problema al enviar el mensaje", "error");
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
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit, showValidationErrors)}
            >
              {/* Nombre */}
              <Controller
                name="nombre"
                control={control}
                defaultValue=""
                rules={{
                  required: "El nombre es obligatorio",
                  pattern: {
                    value: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$/,
                    message: "Solo se permiten letras y espacios",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    margin="normal"
                    placeholder="Nombre"
                    inputProps={{ maxLength: 40, minLength: 4 }}
                    error={!!errors.nombre}
                    helperText={errors.nombre?.message}
                  />
                )}
              />

              {/* Email */}
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{
                  required: "El correo es obligatorio",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Correo inválido",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    margin="normal"
                    type="email"
                    placeholder="Correo electrónico"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />

              {/* Asunto */}
              <Controller
                name="asunto"
                control={control}
                defaultValue=""
                rules={{
                  required: "El asunto es obligatorio",
                  minLength: {
                    value: 4,
                    message: "Debe tener mínimo 4 caracteres",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    margin="normal"
                    placeholder="Asunto"
                    inputProps={{ maxLength: 80 }}
                    error={!!errors.asunto}
                    helperText={errors.asunto?.message}
                  />
                )}
              />

              {/* Mensaje */}
              <Controller
                name="mensaje"
                control={control}
                defaultValue=""
                rules={{
                  required: "El mensaje es obligatorio",
                  maxLength: {
                    value: 2000,
                    message: "Debe tener máximo 2000 caracteres",
                  },
                  minLength: {
                    value: 10,
                    message: "Debe tener mínimo 10 caracteres",
                  },
                  validate: (value) =>
                    value.trim().split(/\s+/).length <= 300 ||
                    "Máximo 300 palabras",
                }}
                render={({ field }) => (
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      {...field}
                      fullWidth
                      margin="normal"
                      multiline
                      rows={4}
                      placeholder="Mensaje..."
                      error={!!errors.mensaje}
                      helperText={errors.mensaje?.message}
                    />
                    <Typography variant="caption" className="word-counter">
                      {mensajeValor.split(/\s+/).filter(Boolean).length}/300
                      palabras
                    </Typography>
                  </Box>
                )}
              />

              <Button
                className="send-btn"
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
                sx={{ mt: 2 }}
              >
                {isSubmitting ? "Enviando..." : "Enviar mensaje"}
              </Button>
            </Box>
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
