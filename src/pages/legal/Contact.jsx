import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useTheme } from "@mui/material/styles";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import clientAxios from "../../utils/clientAxios";
import Swal from "sweetalert2";
import { showValidationErrors } from "../../utils/validationErrors";

const Contacto = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

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
      const res = await clientAxios.post("/contacto/enviar-correo", data);

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
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        py: 8,
        background: isDark
          ? "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)"
          : "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={6}>
          {/* Grid de información y formulario */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 6,
            }}
          >
            {/* Caja de información */}
            <Paper
              elevation={0}
              sx={{
                p: 5,
                background: isDark
                  ? "rgba(30, 30, 30, 0.8)"
                  : "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(16px)",
                borderRadius: 3,
                border: `1px solid ${
                  isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
                }`,
                boxShadow: isDark
                  ? "0 8px 32px rgba(0, 0, 0, 0.3)"
                  : "0 8px 32px rgba(0, 0, 0, 0.1)",
                animation: "fadeInUp 0.8s ease-out",
                "@keyframes fadeInUp": {
                  from: { opacity: 0, transform: "translateY(30px)" },
                  to: { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                  fontWeight: 800,
                  mb: 5,
                  letterSpacing: 3,
                  background:
                    "linear-gradient(135deg, #D4AF37 0%, #B91C1C 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1.2,
                }}
              >
                CONTÁCTATE CON
                <br />
                NOSOTROS
              </Typography>

              <Stack spacing={3}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 1.5,
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: isDark
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.03)",
                      transform: "translateX(8px)",
                    },
                  }}
                >
                  <PhoneIcon sx={{ fontSize: 28, color: "primary.main" }} />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    +54 381 234 5678
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 1.5,
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: isDark
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.03)",
                      transform: "translateX(8px)",
                    },
                  }}
                >
                  <EmailIcon sx={{ fontSize: 28, color: "primary.main" }} />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    contacto@mail.com
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 1.5,
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      background: isDark
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.03)",
                      transform: "translateX(8px)",
                    },
                  }}
                >
                  <LocationOnIcon
                    sx={{ fontSize: 28, color: "primary.main" }}
                  />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Gral. Paz 576 - Tucumán, Argentina
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Caja del formulario */}
            <Paper
              elevation={0}
              component="form"
              onSubmit={handleSubmit(onSubmit, showValidationErrors)}
              sx={{
                p: 5,
                background: isDark
                  ? "rgba(30, 30, 30, 0.8)"
                  : "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(16px)",
                borderRadius: 3,
                border: `1px solid ${
                  isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
                }`,
                boxShadow: isDark
                  ? "0 8px 32px rgba(0, 0, 0, 0.3)"
                  : "0 8px 32px rgba(0, 0, 0, 0.1)",
                animation: "fadeInUp 0.8s ease-out 0.2s backwards",
                "@keyframes fadeInUp": {
                  from: { opacity: 0, transform: "translateY(30px)" },
                  to: { opacity: 1, transform: "translateY(0)" },
                },
              }}
            >
              <Stack spacing={2.5}>
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
                      placeholder="Nombre"
                      inputProps={{ maxLength: 40, minLength: 4 }}
                      error={!!errors.nombre}
                      helperText={errors.nombre?.message}
                      sx={{
                        "& .MuiInputBase-root": {
                          background: isDark
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 0, 0, 0.02)",
                          transition: "all 0.3s ease",
                        },
                        "& .MuiInputBase-root:hover": {
                          background: isDark
                            ? "rgba(255, 255, 255, 0.08)"
                            : "rgba(0, 0, 0, 0.04)",
                        },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: isDark
                              ? "rgba(255, 255, 255, 0.2)"
                              : "rgba(0, 0, 0, 0.2)",
                          },
                          "&:hover fieldset": {
                            borderColor: "primary.main",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "primary.main",
                          },
                        },
                      }}
                    />
                  )}
                />

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
                      type="email"
                      placeholder="Correo electrónico"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      sx={{
                        "& .MuiInputBase-root": {
                          background: isDark
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 0, 0, 0.02)",
                          transition: "all 0.3s ease",
                        },
                        "& .MuiInputBase-root:hover": {
                          background: isDark
                            ? "rgba(255, 255, 255, 0.08)"
                            : "rgba(0, 0, 0, 0.04)",
                        },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: isDark
                              ? "rgba(255, 255, 255, 0.2)"
                              : "rgba(0, 0, 0, 0.2)",
                          },
                          "&:hover fieldset": {
                            borderColor: "primary.main",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "primary.main",
                          },
                        },
                      }}
                    />
                  )}
                />

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
                      placeholder="Asunto"
                      inputProps={{ maxLength: 80 }}
                      error={!!errors.asunto}
                      helperText={errors.asunto?.message}
                      sx={{
                        "& .MuiInputBase-root": {
                          background: isDark
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(0, 0, 0, 0.02)",
                          transition: "all 0.3s ease",
                        },
                        "& .MuiInputBase-root:hover": {
                          background: isDark
                            ? "rgba(255, 255, 255, 0.08)"
                            : "rgba(0, 0, 0, 0.04)",
                        },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: isDark
                              ? "rgba(255, 255, 255, 0.2)"
                              : "rgba(0, 0, 0, 0.2)",
                          },
                          "&:hover fieldset": {
                            borderColor: "primary.main",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "primary.main",
                          },
                        },
                      }}
                    />
                  )}
                />

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
                        multiline
                        rows={4}
                        placeholder="Mensaje..."
                        error={!!errors.mensaje}
                        helperText={errors.mensaje?.message}
                        sx={{
                          "& .MuiInputBase-root": {
                            background: isDark
                              ? "rgba(255, 255, 255, 0.05)"
                              : "rgba(0, 0, 0, 0.02)",
                            transition: "all 0.3s ease",
                          },
                          "& .MuiInputBase-root:hover": {
                            background: isDark
                              ? "rgba(255, 255, 255, 0.08)"
                              : "rgba(0, 0, 0, 0.04)",
                          },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: isDark
                                ? "rgba(255, 255, 255, 0.2)"
                                : "rgba(0, 0, 0, 0.2)",
                            },
                            "&:hover fieldset": {
                              borderColor: "primary.main",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "primary.main",
                            },
                          },
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          position: "absolute",
                          bottom: 8,
                          right: 12,
                          color: "text.secondary",
                          fontSize: "0.85rem",
                          fontWeight: 500,
                        }}
                      >
                        {mensajeValor.split(/\s+/).filter(Boolean).length}/300
                        palabras
                      </Typography>
                    </Box>
                  )}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSubmitting}
                  sx={{
                    mt: 2,
                    py: 2,
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    background:
                      "linear-gradient(135deg, #D4AF37 0%, #B91C1C 100%)",
                    boxShadow: "0 4px 15px rgba(212, 175, 55, 0.4)",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
                      transition: "left 0.5s ease",
                    },
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #FFD700 0%, #FF0000 100%)",
                      boxShadow: "0 6px 20px rgba(255, 215, 0, 0.5)",
                      transform: "translateY(-2px)",
                    },
                    "&:hover::before": {
                      left: "100%",
                    },
                    "&:active": {
                      transform: "translateY(0)",
                    },
                    "&:disabled": {
                      opacity: 0.6,
                    },
                  }}
                >
                  {isSubmitting ? "Enviando..." : "Enviar mensaje"}
                </Button>
              </Stack>
            </Paper>
          </Box>

          {/* Contenedor del mapa */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              border: `1px solid ${
                isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
              }`,
              boxShadow: isDark
                ? "0 8px 32px rgba(0, 0, 0, 0.4)"
                : "0 8px 32px rgba(0, 0, 0, 0.15)",
              animation: "fadeInUp 0.8s ease-out 0.4s backwards",
              "@keyframes fadeInUp": {
                from: { opacity: 0, transform: "translateY(30px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
              "& iframe": {
                width: "100%",
                height: { xs: 300, sm: 350, md: 400 },
                border: 0,
                filter: "grayscale(20%) contrast(1.1)",
                transition: "filter 0.3s ease",
              },
              "&:hover iframe": {
                filter: "grayscale(0%) contrast(1.2)",
              },
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d890.0297242200568!2d-65.2070578!3d-26.8361704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94225d3ad7f30f1d%3A0xf8606cd659b8e3e4!2sRollingCode%20School!5e0!3m2!1ses!2sar!4v1764575851863!5m2!1ses!2sar"
              width="600"
              height="450"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};

export default Contacto;
