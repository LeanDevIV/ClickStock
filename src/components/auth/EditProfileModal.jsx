import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usuarioSchema } from "../../schemas/validationSchemas";
import { uploadImage } from "../../services/uploadService";
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
  CircularProgress,
  Typography,
} from "@mui/material";
import { Close as CloseIcon, PhotoCamera, Delete } from "@mui/icons-material";
import { useStore } from "../../hooks/useStore";

import toast from "react-hot-toast";
import { updateUserService } from "../../services/usuarioService";
import { showValidationErrors } from "../../utils/validationErrors";

const EditProfileModal = ({ open, onClose }) => {
  const { user, setUser } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(usuarioSchema.omit({ contrasenia: true })),
    defaultValues: {
      nombre: "",
      apellido: "",
      correo: "",
      telefono: "",
      fotoPerfil: "",
    },
  });

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
      setUploading(false);
      setIsDragging(false);
    }
  }, [user, open, reset]);

  const handleFileSelect = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Solo se permiten imágenes");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar 5MB");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const url = await uploadImage(file, "usuarios");

      setValue("fotoPerfil", url);
      toast.success("Imagen subida correctamente");
    } catch (err) {
      console.error("Error subiendo imagen:", err);
      setError(err.message || "Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleRemoveImage = () => {
    setValue("fotoPerfil", "");
  };

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
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 3,
              p: 2,
              border: isDragging
                ? "2px dashed #1976d2"
                : "2px dashed transparent",
              borderRadius: 2,
              transition: "all 0.2s",
              backgroundColor: isDragging ? "action.hover" : "transparent",
            }}
          >
            <Box sx={{ position: "relative", mb: 2 }}>
              <Avatar
                src={fotoPerfilValue}
                sx={{
                  width: 100,
                  height: 100,
                  opacity: uploading ? 0.5 : 1,
                  cursor: "pointer",
                }}
                onClick={() => document.getElementById("upload-input").click()}
              />
              {uploading && (
                <CircularProgress
                  size={40}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-20px",
                    marginLeft: "-20px",
                  }}
                />
              )}
            </Box>

            <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="upload-input"
                type="file"
                onChange={handleInputChange}
                disabled={uploading || loading}
              />
              <label htmlFor="upload-input">
                <Button
                  component="span"
                  variant="outlined"
                  startIcon={<PhotoCamera />}
                  disabled={uploading || loading}
                  size="small"
                >
                  Subir Imagen
                </Button>
              </label>

              {fotoPerfilValue && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={handleRemoveImage}
                  disabled={uploading || loading}
                  size="small"
                >
                  Eliminar
                </Button>
              )}
            </Box>

            <Typography variant="caption" color="text.secondary" align="center">
              Arrastrá una imagen o hacé click para seleccionar
              <br />
              (Máx 5MB, JPG/PNG/GIF)
            </Typography>
          </Box>

          <Box sx={{ display: "grid", gap: 2 }}>
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
            >
              <TextField
                required
                label="Nombre"
                {...register("nombre")}
                error={!!errors.nombre}
                helperText={errors.nombre?.message}
              />
              <TextField
                required
                label="Apellido"
                {...register("apellido")}
                error={!!errors.apellido}
                helperText={errors.apellido?.message}
              />
            </Box>

            <TextField
              required
              label="Correo Electrónico"
              type="email"
              {...register("correo")}
              error={!!errors.correo}
              helperText={errors.correo?.message}
            />

            <TextField
              label="Teléfono"
              type="tel"
              {...register("telefono")}
              error={!!errors.telefono}
              helperText={errors.telefono?.message}
              placeholder="+54 9 11 1234-5678"
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
