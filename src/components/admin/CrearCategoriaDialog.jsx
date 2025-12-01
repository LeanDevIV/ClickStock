import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useCategoriesStore } from "../../hooks/useCategoriesStore";
import { THEME } from "../../config/adminConfig";
import { toast } from "react-hot-toast";

export const CrearCategoriaDialog = ({ open, onClose, onCategoriaCreada }) => {
  const [cargando, setCargando] = useState(false);
  const { crearCategoria } = useCategoriesStore();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
    },
  });

  const onSubmit = async (data) => {
    setCargando(true);
    const toastId = toast.loading("Creando categoría...");
    try {
      const nuevaCategoria = await crearCategoria(data);
      toast.success("Categoría creada exitosamente", { id: toastId });
      reset();
      onClose();
      if (onCategoriaCreada) {
        onCategoriaCreada(nuevaCategoria);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`, { id: toastId });
    } finally {
      setCargando(false);
    }
  };

  const handleClose = () => {
    if (!cargando) {
      reset();
      onClose();
    }
  };

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      color: "#fff",
      "& fieldset": {
        borderColor: "rgba(212, 175, 55, 0.3)",
      },
      "&:hover fieldset": {
        borderColor: THEME.primaryColor,
      },
      "&.Mui-focused fieldset": {
        borderColor: THEME.primaryColor,
      },
    },
    "& .MuiInputLabel-root": {
      color: "rgba(255, 255, 255, 0.7)",
      "&.Mui-focused": {
        color: THEME.primaryColor,
      },
    },
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#1e1e1e",
          color: "#fff",
          border: `1px solid ${THEME.primaryColor}`,
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "rgba(30, 30, 30, 0.95)",
          color: THEME.primaryColor,
          fontWeight: "bold",
          borderBottom: `1px solid rgba(212, 175, 55, 0.2)`,
          fontSize: "1.25rem",
          textAlign: "center",
          py: 2,
        }}
      >
        Nueva Categoría
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ py: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Controller
              name="nombre"
              control={control}
              rules={{
                required: "El nombre es obligatorio",
                minLength: {
                  value: 2,
                  message: "Mínimo 2 caracteres",
                },
                maxLength: {
                  value: 50,
                  message: "Máximo 50 caracteres",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nombre"
                  fullWidth
                  error={!!errors.nombre}
                  helperText={errors.nombre?.message}
                  disabled={cargando}
                  autoFocus
                  sx={inputStyles}
                />
              )}
            />

            <Controller
              name="descripcion"
              control={control}
              rules={{
                maxLength: {
                  value: 200,
                  message: "Máximo 200 caracteres",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Descripción (opcional)"
                  fullWidth
                  multiline
                  rows={2}
                  error={!!errors.descripcion}
                  helperText={errors.descripcion?.message}
                  disabled={cargando}
                  sx={inputStyles}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions
          sx={{ p: 2.5, borderTop: `1px solid rgba(212, 175, 55, 0.1)` }}
        >
          <Button
            onClick={handleClose}
            disabled={cargando}
            sx={{
              color: "#aaa",
              "&:hover": { color: "#fff" },
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={cargando}
            startIcon={cargando && <CircularProgress size={16} />}
            sx={{
              bgcolor: THEME.primaryColor,
              color: THEME.darkColor,
              fontWeight: "bold",
              px: 3,
              "&:hover": {
                bgcolor: "#bfa030",
              },
              "&:disabled": {
                bgcolor: "rgba(212, 175, 55, 0.3)",
              },
            }}
          >
            {cargando ? "Creando..." : "Crear"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
