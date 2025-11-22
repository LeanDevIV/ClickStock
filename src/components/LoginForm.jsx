import React, { useState } from "react";
import { TextField, Button, Box, InputAdornment } from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
import { useStore } from "../hooks/useStore";
import { loginService } from "../services/LoginService";

function LoginForm({ setMensaje }) {
  const [formData, setFormData] = useState({
    correo: "",
    contrasenia: "",
  });

  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.correo || !formData.contrasenia) {
      setMensaje("Completa todos los campos.");
      return;
    }

    try {
      setCargando(true);
      const data = await loginService(formData);

      setMensaje(data.msg || "Inicio de sesión exitoso");

      if (data.usuario || data.token) {
        useStore.getState().setUser(data.usuario, data.token);
      }

      setFormData({ correo: "", contrasenia: "" });
    } catch (error) {
      setMensaje(error.message || "Correo o contraseña incorrectos.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <TextField
        fullWidth
        label="Correo electrónico"
        name="correo"
        type="email"
        margin="normal"
        value={formData.correo}
        onChange={handleChange}
        required
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
        name="contrasenia"
        type="password"
        margin="normal"
        value={formData.contrasenia}
        onChange={handleChange}
        required
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
