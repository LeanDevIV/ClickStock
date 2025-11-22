import React, { useState } from "react";
import { TextField, Button, Box, InputAdornment } from "@mui/material";
import { Person, Email, Lock } from "@mui/icons-material";
import { useStore } from "../hooks/useStore";
import { registroService } from "../services/RegistroService";

function RegistroForm({ setMensaje }) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    contrasenia: "",
    confirmarContrasenia: "",
  });

  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      nombre,
      apellido,
      correo,
      telefono,
      contrasenia,
      confirmarContrasenia,
    } = formData;

    if (
      !nombre ||
      !apellido ||
      !correo ||
      !contrasenia ||
      !confirmarContrasenia
    ) {
      setMensaje("Por favor completa todos los campos.");
      return;
    }

    if (contrasenia !== confirmarContrasenia) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }

    try {
      setCargando(true);

      const data = await registroService({
        nombre,
        apellido,
        correo,
        telefono,
        contrasenia,
      });

      setMensaje(data.msg || "Registro exitoso");

      if (data.usuario || data.token) {
        useStore.getState().setUser(data.usuario, data.token);
      }

      setFormData({
        nombre: "",
        apellido: "",
        correo: "",
        telefono: "",
        contrasenia: "",
        confirmarContrasenia: "",
      });
    } catch (error) {
      setMensaje(error.message || "Error en el registro.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <TextField
        fullWidth
        label="Nombre"
        name="nombre"
        margin="normal"
        value={formData.nombre}
        onChange={handleChange}
        required
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
        name="apellido"
        margin="normal"
        value={formData.apellido}
        onChange={handleChange}
        required
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
        name="telefono"
        margin="normal"
        value={formData.telefono}
        onChange={handleChange}
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

      <TextField
        fullWidth
        label="Confirmar contraseña"
        name="confirmarContrasenia"
        type="password"
        margin="normal"
        value={formData.confirmarContrasenia}
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
        {cargando ? "Procesando..." : "Registrarse"}
      </Button>
    </Box>
  );
}

export default RegistroForm;
