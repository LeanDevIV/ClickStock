import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useStore } from "../../hooks/useStore";
import { registroService } from "../../services/RegistroService";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { showValidationErrors } from "../../utils/validationErrors";

const registerSchema = z
  .object({
    nombre: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "El nombre no puede exceder los 50 caracteres"),
    apellido: z
      .string()
      .min(2, "El apellido debe tener al menos 2 caracteres")
      .max(50, "El apellido no puede exceder los 50 caracteres"),
    telefono: z
      .string()
      .min(10, "El teléfono debe tener al menos 10 caracteres")
      .max(15, "El teléfono no puede exceder los 15 caracteres")
      .optional()
      .or(z.literal("")),
    correo: z.string().email("Debe ser un correo electrónico válido"),
    contrasenia: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmarContrasenia: z.string(),
  })
  .refine((data) => data.contrasenia === data.confirmarContrasenia, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarContrasenia"],
  });

function RegistroForm({ setMensaje, onSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = async (data) => {
    try {
      setCargando(true);

      const response = await registroService({
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.correo,
        telefono: data.telefono,
        contrasenia: data.contrasenia,
      });

      setMensaje(response.msg || "Registro exitoso");

      if (response.usuario || response.token) {
        useStore.getState().setUser(response.usuario, response.token);
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      setMensaje(error.message || "Error en el registro.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit, showValidationErrors)}
      sx={{ mt: 1 }}
    >
      <TextField
        fullWidth
        label="Nombre"
        margin="dense"
        size="small"
        {...register("nombre")}
        error={!!errors.nombre}
        helperText={errors.nombre?.message}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person />
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            color: "#fff",
            "& fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" },
            "&:hover fieldset": { borderColor: "#fff" },
            "&.Mui-focused fieldset": { borderColor: "#d32f2f" },
          },
          "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
          "& .MuiInputLabel-root.Mui-focused": { color: "#d32f2f" },
          "& .MuiInputAdornment-root": { color: "rgba(255, 255, 255, 0.7)" },
        }}
      />
      <TextField
        fullWidth
        label="Apellido"
        margin="dense"
        size="small"
        {...register("apellido")}
        error={!!errors.apellido}
        helperText={errors.apellido?.message}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person />
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            color: "#fff",
            "& fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" },
            "&:hover fieldset": { borderColor: "#fff" },
            "&.Mui-focused fieldset": { borderColor: "#d32f2f" },
          },
          "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
          "& .MuiInputLabel-root.Mui-focused": { color: "#d32f2f" },
          "& .MuiInputAdornment-root": { color: "rgba(255, 255, 255, 0.7)" },
        }}
      />
      <TextField
        fullWidth
        label="Teléfono"
        margin="dense"
        size="small"
        {...register("telefono")}
        error={!!errors.telefono}
        helperText={errors.telefono?.message}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person />
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            color: "#fff",
            "& fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" },
            "&:hover fieldset": { borderColor: "#fff" },
            "&.Mui-focused fieldset": { borderColor: "#d32f2f" },
          },
          "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
          "& .MuiInputLabel-root.Mui-focused": { color: "#d32f2f" },
          "& .MuiInputAdornment-root": { color: "rgba(255, 255, 255, 0.7)" },
        }}
      />
      <TextField
        fullWidth
        label="Correo electrónico"
        type="email"
        margin="dense"
        size="small"
        {...register("correo")}
        error={!!errors.correo}
        helperText={errors.correo?.message}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email />
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            color: "#fff",
            "& fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" },
            "&:hover fieldset": { borderColor: "#fff" },
            "&.Mui-focused fieldset": { borderColor: "#d32f2f" },
          },
          "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
          "& .MuiInputLabel-root.Mui-focused": { color: "#d32f2f" },
          "& .MuiInputAdornment-root": { color: "rgba(255, 255, 255, 0.7)" },
        }}
      />
      <TextField
        fullWidth
        label="Contraseña"
        type={showPassword ? "text" : "password"}
        margin="dense"
        size="small"
        {...register("contrasenia")}
        error={!!errors.contrasenia}
        helperText={errors.contrasenia?.message}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                sx={{ color: "rgba(255, 255, 255, 0.7)" }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            color: "#fff",
            "& fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" },
            "&:hover fieldset": { borderColor: "#fff" },
            "&.Mui-focused fieldset": { borderColor: "#d32f2f" },
          },
          "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
          "& .MuiInputLabel-root.Mui-focused": { color: "#d32f2f" },
          "& .MuiInputAdornment-root": { color: "rgba(255, 255, 255, 0.7)" },
        }}
      />
      <TextField
        fullWidth
        label="Confirmar contraseña"
        type={showConfirmPassword ? "text" : "password"}
        margin="dense"
        size="small"
        {...register("confirmarContrasenia")}
        error={!!errors.confirmarContrasenia}
        helperText={errors.confirmarContrasenia?.message}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowConfirmPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                sx={{ color: "rgba(255, 255, 255, 0.7)" }}
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            color: "#fff",
            "& fieldset": { borderColor: "rgba(255, 255, 255, 0.23)" },
            "&:hover fieldset": { borderColor: "#fff" },
            "&.Mui-focused fieldset": { borderColor: "#d32f2f" },
          },
          "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
          "& .MuiInputLabel-root.Mui-focused": { color: "#d32f2f" },
          "& .MuiInputAdornment-root": { color: "rgba(255, 255, 255, 0.7)" },
        }}
      />
      <Button
        fullWidth
        variant="contained"
        type="submit"
        disabled={cargando}
        sx={{
          mt: 2,
          py: 1,
          bgcolor: "#d32f2f",
          "&:hover": { bgcolor: "#b71c1c" },
        }}
      >
        {cargando ? "Procesando..." : "Registrarse"}
      </Button>
    </Box>
  );
}

export default RegistroForm;
