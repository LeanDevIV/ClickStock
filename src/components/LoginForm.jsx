import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Box, InputAdornment } from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
import { useStore } from "../hooks/useStore";
import { loginService } from "../services/LoginService";

function LoginForm({ setMensaje, onSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
      <TextField
        fullWidth
        label="Correo electrónico"
        type="email"
        margin="normal"
        {...register("correo", {
          required: "El correo es requerido",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Dirección de correo inválida",
          },
        })}
        error={!!errors.correo}
        helperText={errors.correo?.message}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        label="Contraseña"
        type="password"
        margin="normal"
        {...register("contrasenia", { required: "La contraseña es requerida" })}
        error={!!errors.contrasenia}
        helperText={errors.contrasenia?.message}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock />
            </InputAdornment>
          ),
        }}
      />

      <Button
        fullWidth
        variant="contained"
        color="primary"
        type="submit"
        disabled={cargando}
        sx={{ mt: 2, py: 1 }}
      >
        {cargando ? "Verificando..." : "Ingresar"}
      </Button>
    </Box>
  );
}

export default LoginForm;
