import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Box, InputAdornment } from "@mui/material";
import { Person, Email, Lock } from "@mui/icons-material";
import { useStore } from "../hooks/useStore";
import { registroService } from "../services/RegistroService";

function RegistroForm({ setMensaje, onSuccess }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [cargando, setCargando] = useState(false);

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
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
      <TextField
        fullWidth
        label="Nombre"
        margin="normal"
        {...register("nombre", { required: "El nombre es requerido" })}
        error={!!errors.nombre}
        helperText={errors.nombre?.message}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        label="Apellido"
        margin="normal"
        {...register("apellido", { required: "El apellido es requerido" })}
        error={!!errors.apellido}
        helperText={errors.apellido?.message}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        label="Teléfono"
        margin="normal"
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
      />

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

      <TextField
        fullWidth
        label="Confirmar contraseña"
        type="password"
        margin="normal"
        {...register("confirmarContrasenia", {
          required: "Confirma tu contraseña",
          validate: (val) => {
            if (watch("contrasenia") != val) {
              return "Las contraseñas no coinciden";
            }
          },
        })}
        error={!!errors.confirmarContrasenia}
        helperText={errors.confirmarContrasenia?.message}
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
        {cargando ? "Procesando..." : "Registrarse"}
      </Button>
    </Box>
  );
}

export default RegistroForm;
