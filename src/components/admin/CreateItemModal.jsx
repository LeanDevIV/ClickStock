import React, { useEffect, useState } from "react";
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
  Checkbox,
  FormControlLabel,
  Divider,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FIELD_TYPES, SELECT_OPTIONS, THEME } from "../../config/adminConfig";
import { productoSchema } from "../../schemas/validationSchemas";
import { showValidationErrors } from "../../utils/validationErrors";
import { CrearCategoriaDialog } from "./CrearCategoriaDialog";
import { useCategoriesStore } from "../../hooks/useCategoriesStore";

export const CreateItemModal = ({
  open,
  onClose,
  onCreate,
  section,
  config,
}) => {
  const resolver =
    section === "productos" ? zodResolver(productoSchema) : undefined;

  const [dialogCategoriaOpen, setDialogCategoriaOpen] = useState(false);
  const { fetchCategorias } = useCategoriesStore();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver,
  });

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, section, reset]);

  const onSubmit = (data) => {
    onCreate(data);
    onClose();
  };

  const handleNuevaCategoriaCreada = async (nuevaCategoria) => {
    await fetchCategorias();
    if (nuevaCategoria && nuevaCategoria._id) {
      setValue("categoria", nuevaCategoria._id);
    }
  };

  const camposParaMostrar = config?.editableFields || [];

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
    "& .MuiSelect-icon": {
      color: THEME.primaryColor,
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
          fontSize: "1.5rem",
          textAlign: "center",
          py: 3,
        }}
      >
        Agregar {section.slice(0, -1)}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit, showValidationErrors)}>
        <DialogContent sx={{ py: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
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
                  defaultValue={tipoCampo === "boolean" ? true : ""}
                  rules={
                    !resolver
                      ? { required: "Este campo es obligatorio" }
                      : undefined
                  }
                  render={({ field }) => {
                    if (esSelect) {
                      const opciones = SELECT_OPTIONS[campo] || [];
                      const opcionesReales = Array.isArray(opciones)
                        ? opciones
                        : opciones[section] || [];

                      return (
                        <FormControl
                          fullWidth
                          error={!!errors[campo]}
                          sx={inputStyles}
                        >
                          <InputLabel>
                            {campo.charAt(0).toUpperCase() + campo.slice(1)}
                          </InputLabel>
                          <Select
                            {...field}
                            label={
                              campo.charAt(0).toUpperCase() + campo.slice(1)
                            }
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  bgcolor: "#2c2c2c",
                                  color: "#fff",
                                  "& .MuiMenuItem-root": {
                                    "&:hover": {
                                      bgcolor: "rgba(212, 175, 55, 0.1)",
                                    },
                                    "&.Mui-selected": {
                                      bgcolor: "rgba(212, 175, 55, 0.2)",
                                      "&:hover": {
                                        bgcolor: "rgba(212, 175, 55, 0.3)",
                                      },
                                    },
                                  },
                                },
                              },
                            }}
                          >
                            {opcionesReales.map((opcion) => (
                              <MenuItem key={opcion.value} value={opcion.value}>
                                {opcion.label}
                              </MenuItem>
                            ))}
                            {campo === "categoria" && [
                              <Divider
                                key="divider"
                                sx={{
                                  borderColor: "rgba(212, 175, 55, 0.2)",
                                }}
                              />,
                              <MenuItem
                                key="nueva-categoria"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDialogCategoriaOpen(true);
                                }}
                                sx={{
                                  color: THEME.primaryColor,
                                  fontWeight: "bold",
                                  "&:hover": {
                                    bgcolor: "rgba(212, 175, 55, 0.15)",
                                  },
                                }}
                              >
                                <ListItemIcon
                                  sx={{ color: THEME.primaryColor }}
                                >
                                  <AddIcon />
                                </ListItemIcon>
                                <ListItemText primary="Nueva Categoría" />
                              </MenuItem>,
                            ]}
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
                          <InputLabel
                            shrink
                            sx={{
                              color: THEME.primaryColor,
                              mb: 1,
                              fontSize: "0.9rem",
                            }}
                          >
                            {campo.charAt(0).toUpperCase() + campo.slice(1)}
                          </InputLabel>
                          <Button
                            variant="outlined"
                            component="label"
                            fullWidth
                            sx={{
                              color: "#fff",
                              borderColor: "rgba(212, 175, 55, 0.5)",
                              py: 1.5,
                              borderStyle: "dashed",
                              "&:hover": {
                                borderColor: THEME.primaryColor,
                                bgcolor: "rgba(212, 175, 55, 0.05)",
                              },
                            }}
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
                              sx={{ mt: 1, display: "block", color: "#aaa" }}
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

                    if (tipoCampo === "boolean") {
                      return (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={!!field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              sx={{
                                color: "rgba(212, 175, 55, 0.5)",
                                "&.Mui-checked": {
                                  color: THEME.primaryColor,
                                },
                              }}
                            />
                          }
                          label={
                            <Typography sx={{ color: "#fff" }}>
                              {campo.charAt(0).toUpperCase() + campo.slice(1)}
                            </Typography>
                          }
                        />
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
                        sx={inputStyles}
                      />
                    );
                  }}
                />
              );
            })}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{ p: 3, borderTop: `1px solid rgba(212, 175, 55, 0.1)` }}
        >
          <Button
            onClick={onClose}
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
            sx={{
              bgcolor: THEME.primaryColor,
              color: THEME.darkColor,
              fontWeight: "bold",
              px: 4,
              "&:hover": {
                bgcolor: "#bfa030",
              },
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </form>

      <CrearCategoriaDialog
        open={dialogCategoriaOpen}
        onClose={() => setDialogCategoriaOpen(false)}
        onCategoriaCreada={handleNuevaCategoriaCreada}
      />
    </Dialog>
  );
};
