import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Avatar,
  IconButton,
  Alert,
} from "@mui/material";
import { Close as CloseIcon, PhotoCamera } from "@mui/icons-material";
import { useStore } from "../../hooks/useStore";

import toast from "react-hot-toast";
import { updateUserService } from "../../services/usuarioService";
import { showValidationErrors } from "../../utils/validationErrors";

const EditProfileModal = ({ open, onClose }) => {
  const { user, setUser } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: "",
      apellido: "",
      correo: "",
      telefono: "",
      fotoPerfil: "",
    },
  });

  // Observar fotoPerfil para mostrar la previsualización
  const fotoPerfilValue = watch("fotoPerfil");

  useEffect(() => {
    if (user && open) {
      reset({
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        correo: user.correo || "",
        telefono: user.telefono || "",
        fotoPerfil: user.fotoPerfil || "",
      });
      setError(null);
    }
  }, [user, open, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const updatedUser = await updateUserService(
        user.id || user._id || user.usuarioId,
        data
      );

      const currentToken = useStore.getState().token;
      setUser({ ...user, ...updatedUser }, currentToken);

      toast.success("Perfil actualizado correctamente");
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Editar Perfil
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit, showValidationErrors)}
          sx={{ mt: 1 }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Avatar
              src={fotoPerfilValue}
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            <TextField
              fullWidth
              label="URL Foto de Perfil"
              {...register("fotoPerfil")}
              error={!!errors.fotoPerfil}
              helperText={
                errors.fotoPerfil?.message || "Ingresa la URL de tu imagen"
              }
              variant="outlined"
              size="small"
            />
          </Box>

          <Box sx={{ display: "grid", gap: 2 }}>
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
            >
              <TextField
                required
                label="Nombre"
                {...register("nombre", { required: "El nombre es requerido" })}
                error={!!errors.nombre}
                helperText={errors.nombre?.message}
              />
              <TextField
                required
                label="Apellido"
                {...register("apellido", {
                  required: "El apellido es requerido",
                })}
                error={!!errors.apellido}
                helperText={errors.apellido?.message}
              />
            </Box>

            <TextField
              required
              label="Correo Electrónico"
              type="email"
              {...register("correo", {
                required: "El correo es requerido",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Dirección de correo inválida",
                },
              })}
              error={!!errors.correo}
              helperText={errors.correo?.message}
            />

            <TextField
              label="Teléfono"
              {...register("telefono", {
                pattern: {
                  value: /^[0-9+\-\s()]*$/,
                  message: "Ingresa un número de teléfono válido",
                },
              })}
              error={!!errors.telefono}
              helperText={errors.telefono?.message}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit(onSubmit, showValidationErrors)}
          variant="contained"
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileModal;
