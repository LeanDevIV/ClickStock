import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FIELD_TYPES, SELECT_OPTIONS, THEME } from "../../config/adminConfig";
import { productoSchema } from "../../schemas/validationSchemas";
import { showValidationErrors } from "../../utils/validationErrors";

export const CreateItemModal = ({
  open,
  onClose,
  onCreate,
  section,
  config,
}) => {
  // Determinar si debemos usar un esquema de validación (solo para productos por ahora)
  const resolver =
    section === "productos" ? zodResolver(productoSchema) : undefined;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver,
  });

  // Resetear formulario cuando se cierra o cambia la sección
  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, section, reset]);

  const onSubmit = (data) => {
    onCreate(data);
    onClose();
  };

  // Determinar qué campos mostrar (usamos editableFields por defecto para creación)
  const camposParaMostrar = config?.editableFields || [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          bgcolor: THEME.primaryColor,
          color: THEME.darkColor,
          fontWeight: "bold",
        }}
      >
        Agregar {section.slice(0, -1)} {/* Intento básico de singularizar */}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit, showValidationErrors)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            {camposParaMostrar.map((campo) => {
              const tipoCampo = FIELD_TYPES[campo];
              const esSelect =
                tipoCampo === "select" ||
                (typeof tipoCampo === "object" && tipoCampo.type === "select");
              const esNumero =
                tipoCampo === "number" ||
                (typeof tipoCampo === "object" && tipoCampo.type === "number");
              const esFecha = tipoCampo === "date";
              const esMultiline = tipoCampo === "multiline";

              return (
                <Controller
                  key={campo}
                  name={campo}
                  control={control}
                  defaultValue=""
                  // Si no hay resolver (otras secciones), mantenemos required básico
                  rules={
                    !resolver
                      ? { required: "Este campo es obligatorio" }
                      : undefined
                  }
                  render={({ field }) => {
                    if (esSelect) {
                      const opciones = SELECT_OPTIONS[campo] || [];
                      // Manejo especial para opciones anidadas (ej: estado en Pedidos/Soporte)
                      const opcionesReales = Array.isArray(opciones)
                        ? opciones
                        : opciones[section] || [];

                      return (
                        <FormControl fullWidth error={!!errors[campo]}>
                          <InputLabel>
                            {campo.charAt(0).toUpperCase() + campo.slice(1)}
                          </InputLabel>
                          <Select
                            {...field}
                            label={
                              campo.charAt(0).toUpperCase() + campo.slice(1)
                            }
                          >
                            {opcionesReales.map((opcion) => (
                              <MenuItem key={opcion.value} value={opcion.value}>
                                {opcion.label}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors[campo] && (
                            <Typography variant="caption" color="error">
                              {errors[campo].message}
                            </Typography>
                          )}
                        </FormControl>
                      );
                    }

                    if (tipoCampo === "file") {
                      return (
                        <Box>
                          <InputLabel shrink>
                            {campo.charAt(0).toUpperCase() + campo.slice(1)}
                          </InputLabel>
                          <Button
                            variant="outlined"
                            component="label"
                            fullWidth
                            sx={{ mt: 1 }}
                          >
                            Subir Archivo
                            <input
                              type="file"
                              hidden
                              accept="image/*"
                              onChange={(e) => {
                                field.onChange(e.target.files[0]);
                              }}
                            />
                          </Button>
                          {field.value && (
                            <Typography
                              variant="caption"
                              sx={{ mt: 1, display: "block" }}
                            >
                              Archivo seleccionado: {field.value.name}
                            </Typography>
                          )}
                          {errors[campo] && (
                            <Typography variant="caption" color="error">
                              {errors[campo].message}
                            </Typography>
                          )}
                        </Box>
                      );
                    }

                    return (
                      <TextField
                        {...field}
                        label={campo.charAt(0).toUpperCase() + campo.slice(1)}
                        type={esNumero ? "number" : esFecha ? "date" : "text"}
                        multiline={esMultiline}
                        rows={esMultiline ? 3 : 1}
                        fullWidth
                        error={!!errors[campo]}
                        helperText={errors[campo]?.message}
                        InputLabelProps={esFecha ? { shrink: true } : {}}
                        inputProps={
                          typeof tipoCampo === "object" && tipoCampo.min
                            ? { min: tipoCampo.min, max: tipoCampo.max }
                            : {}
                        }
                      />
                    );
                  }}
                />
              );
            })}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: THEME.primaryColor,
              color: THEME.darkColor,
              fontWeight: "bold",
              "&:hover": { bgcolor: "rgba(212, 175, 55, 0.85)" },
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
