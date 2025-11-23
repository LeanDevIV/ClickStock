import React, { useState } from "react";
import { TextField, Button, Alert, Box, InputAdornment } from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import { useStore } from "../hooks/useStore";
import { registroService } from "../services/RegistroService";

function RegistroLogin() {
  const [mensaje, setMensaje] = useState("");

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

      // Limpiar
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
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      {mensaje && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {mensaje}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Nombre"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        required
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        label="Apellido"
        name="apellido"
        value={formData.apellido}
        onChange={handleChange}
        required
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        label="Teléfono"
        name="telefono"
        value={formData.telefono}
        onChange={handleChange}
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PhoneIcon />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        label="Correo electrónico"
        name="correo"
        type="email"
        value={formData.correo}
        onChange={handleChange}
        required
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        label="Contraseña"
        name="contrasenia"
        type="password"
        value={formData.contrasenia}
        onChange={handleChange}
        required
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        label="Confirmar contraseña"
        name="confirmarContrasenia"
        type="password"
        value={formData.confirmarContrasenia}
        onChange={handleChange}
        required
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon />
            </InputAdornment>
          ),
        }}
      />

      <Button
        fullWidth
        variant="contained"
        type="submit"
        disabled={cargando}
        sx={{ mt: 2 }}
      >
        {cargando ? "Procesando..." : "Registrarse"}
      </Button>
    </Box>
  );
}

export default RegistroLogin;
