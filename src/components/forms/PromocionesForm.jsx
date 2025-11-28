import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import clientAxios from "../../utils/clientAxios";
import { useForm } from "react-hook-form";
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
} from "@mui/material";

function PromocionesForm() {
  const [preview, setPreview] = useState(null);

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(promocionSchema),
    defaultValues: {
      titulo: "",
      descripcion: "",
      descuento: "",
      fechaInicio: "",
      fechaFin: "",
      imagen: null,
    },
  });

  // Watch fields for preview
  const watchedValues = watch();

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
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
      // Crear FormData para envío
      const formDataToSend = new FormData();
      formDataToSend.append("titulo", data.titulo);
      formDataToSend.append("descripcion", data.descripcion);
      formDataToSend.append("descuento", data.descuento);
      formDataToSend.append("fechaInicio", data.fechaInicio);
      formDataToSend.append("fechaFin", data.fechaFin);
      if (data.imagen instanceof File) {
        formDataToSend.append("imagen", data.imagen);
      }

      await clientAxios.post("/promociones", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Promoción creada con éxito");
      reset();
      setPreview(null);
    } catch (error) {
      console.error("Error al crear promoción:", error);
      toast.error(
        error.response?.data?.message || "Error al crear la promoción"
      );
    }
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
              🛍️ Crear nueva promoción
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

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creando..." : "Crear Promoción"}
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
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PromocionesForm;
