import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Box, InputAdornment } from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
import { useStore } from "../../hooks/useStore";
import { loginService } from "../../services/LoginService";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { showValidationErrors } from "../../utils/validationErrors";

const loginSchema = z.object({
  correo: z.string().email("Debe ser un correo electrónico válido"),
  contrasenia: z.string().min(1, "La contraseña es requerida"),
});

function LoginForm({ setMensaje, onSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const [cargando, setCargando] = useState(false);

  const onSubmit = async (data) => {
    try {
      setCargando(true);
      const response = await loginService(data);

      setMensaje(response.msg || "Inicio de sesión exitoso");

      if (response.usuario || response.token) {
        useStore.getState().setUser(response.usuario, response.token);
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      setMensaje(error.message || "Correo o contraseña incorrectos.");
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
        label="Correo electrónico"
        type="email"
        margin="dense"
        {...register("correo")}
        error={!!errors.correo}
        helperText={errors.correo?.message}
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
        type="password"
        margin="dense"
        {...register("contrasenia")}
        error={!!errors.contrasenia}
        helperText={errors.contrasenia?.message}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock />
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
          bgcolor: "#d32f2f", // Red button
          "&:hover": { bgcolor: "#b71c1c" },
        }}
      >
        {cargando ? "Verificando..." : "Ingresar"}
      </Button>
    </Box>
  );
}

export default LoginForm;
