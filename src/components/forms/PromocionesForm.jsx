import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import clientAxios from "../../utils/clientAxios";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { promocionSchema } from "../../schemas/validationSchemas";
import { showValidationErrors } from "../../utils/validationErrors";

import {
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Stack,
  Autocomplete,
  Chip,
  Switch,
  FormControlLabel,
} from "@mui/material";

function PromocionesForm({ promocionEditar, onSuccess, onCancel }) {
  const [preview, setPreview] = useState(null);
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const esEdicion = !!promocionEditar;

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(promocionSchema),
    defaultValues: {
      titulo: "",
      descripcion: "",
      descuento: "",
      fechaInicio: "",
      fechaFin: "",
      productos: [],
      activa: true,
      imagen: null,
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    if (promocionEditar) {
      setValue("titulo", promocionEditar.titulo);
      setValue("descripcion", promocionEditar.descripcion);
      setValue("descuento", promocionEditar.descuento);
      setValue(
        "fechaInicio",
        new Date(promocionEditar.fechaInicio).toISOString().split("T")[0]
      );
      setValue(
        "fechaFin",
        new Date(promocionEditar.fechaFin).toISOString().split("T")[0]
      );
      setValue("activa", promocionEditar.activa);

      if (promocionEditar.productos) {
        setValue("productos", promocionEditar.productos);
      }
      if (promocionEditar.imagen) {
        setPreview(`${import.meta.env.VITE_API_URL}${promocionEditar.imagen}`);
      }
    }
  }, [promocionEditar, setValue]);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const { data } = await clientAxios.get("/productos");
        const disponibles = data.filter((p) => p.disponible && !p.isDeleted);
        setProductosDisponibles(disponibles);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        toast.error("Error al cargar productos");
      }
    };
    obtenerProductos();
  }, []);

  useEffect(() => {
    return () => {
      if (preview && !preview.startsWith("http")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("imagen", file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const onSubmit = async (data) => {
    try {
      const dataToSend = {
        titulo: data.titulo,
        descripcion: data.descripcion,
        descuento: data.descuento,
        fechaInicio: data.fechaInicio,
        fechaFin: data.fechaFin,
        productos: data.productos?.map((p) => p._id) || [],
        activa: data.activa,
      };

      if (esEdicion) {
        await clientAxios.put(
          `/promociones/${promocionEditar._id}`,
          dataToSend
        );
        toast.success("Promoción actualizada con éxito");
      } else {
        await clientAxios.post("/promociones", dataToSend);
        toast.success("Promoción creada con éxito");
      }

      reset();
      setPreview(null);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error al guardar promoción:", error);
      toast.error(
        error.response?.data?.message || "Error al guardar la promoción"
      );
    }
  };

  const handleCancelar = () => {
    reset();
    setPreview(null);
    if (onCancel) onCancel();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{ p: 3 }}
            elevation={3}
            component="form"
            onSubmit={handleSubmit(onSubmit, showValidationErrors)}
          >
            <Typography variant="h6" gutterBottom>
              {esEdicion ? "✏️ Editar promoción" : "🛍️ Crear nueva promoción"}
            </Typography>

            <Stack spacing={2}>
              <TextField
                label="Título"
                placeholder="Ej: 20% OFF en zapatillas"
                fullWidth
                error={!!errors.titulo}
                helperText={errors.titulo?.message}
                {...register("titulo")}
              />

              <TextField
                label="Descripción"
                placeholder="Detalles de la promoción..."
                multiline
                rows={4}
                fullWidth
                error={!!errors.descripcion}
                helperText={errors.descripcion?.message}
                {...register("descripcion")}
              />

              <TextField
                label="Descuento (%)"
                type="number"
                fullWidth
                slotProps={{
                  input: { min: 0, max: 100 },
                }}
                error={!!errors.descuento}
                helperText={errors.descuento?.message}
                {...register("descuento")}
              />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Fecha inicio"
                    type="date"
                    fullWidth
                    slotProps={{
                      inputLabel: { shrink: true },
                    }}
                    error={!!errors.fechaInicio}
                    helperText={errors.fechaInicio?.message}
                    {...register("fechaInicio")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Fecha fin"
                    type="date"
                    fullWidth
                    slotProps={{
                      inputLabel: { shrink: true },
                    }}
                    error={!!errors.fechaFin}
                    helperText={errors.fechaFin?.message}
                    {...register("fechaFin")}
                  />
                </Grid>
              </Grid>

              {/* Selector de productos */}
              <Controller
                name="productos"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    multiple
                    options={productosDisponibles}
                    getOptionLabel={(option) => option.nombre}
                    value={value || []}
                    onChange={(_, newValue) => onChange(newValue)}
                    isOptionEqualToValue={(option, value) =>
                      option._id === value._id
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Productos en promoción"
                        placeholder="Seleccionar productos..."
                        error={!!errors.productos}
                        helperText={
                          errors.productos?.message ||
                          "Seleccioná los productos que incluye esta promoción"
                        }
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option.nombre}
                          {...getTagProps({ index })}
                          size="small"
                          key={index}
                        />
                      ))
                    }
                  />
                )}
              />

              <FormControlLabel
                control={
                  <Switch
                    {...register("activa")}
                    defaultChecked={watchedValues.activa}
                  />
                }
                label="Promoción activa"
              />

              <Box>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="promo-imagen"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="promo-imagen">
                  <Button variant="outlined" component="span">
                    Seleccionar imagen (opcional)
                  </Button>
                </label>
                {errors.imagen && (
                  <Typography variant="caption" color="error" display="block">
                    {errors.imagen?.message}
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                {esEdicion && (
                  <Button variant="outlined" onClick={handleCancelar}>
                    Cancelar
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Guardando..."
                    : esEdicion
                    ? "Actualizar Promoción"
                    : "Crear Promoción"}
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }} elevation={3}>
            <Typography variant="h6" gutterBottom>
              👀 Vista previa
            </Typography>

            <Card>
              {preview ? (
                <CardMedia
                  component="img"
                  height="200"
                  image={preview}
                  alt="Preview"
                />
              ) : (
                <Box
                  sx={{
                    height: 200,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "grey.100",
                  }}
                >
                  <Typography color="text.secondary">Sin imagen</Typography>
                </Box>
              )}
              <CardContent>
                <Typography variant="h6">
                  {watchedValues.titulo || "Título de la promoción"}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {watchedValues.descripcion || "Descripción breve..."}
                </Typography>

                {watchedValues.descuento && (
                  <Typography
                    component="span"
                    sx={{ display: "block", fontWeight: 700 }}
                  >
                    {watchedValues.descuento}% OFF
                  </Typography>
                )}

                {(watchedValues.fechaInicio || watchedValues.fechaFin) && (
                  <Typography variant="caption" color="text.secondary">
                    {watchedValues.fechaInicio} → {watchedValues.fechaFin}
                  </Typography>
                )}

                {/* Productos seleccionados */}
                {watchedValues.productos &&
                  watchedValues.productos.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography
                        variant="caption"
                        fontWeight={700}
                        display="block"
                        gutterBottom
                      >
                        {watchedValues.productos.length} producto(s) incluido(s)
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {watchedValues.productos.map((prod, idx) => (
                          <Chip
                            key={idx}
                            label={prod.nombre}
                            size="small"
                            sx={{ fontSize: "0.7rem" }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PromocionesForm;
