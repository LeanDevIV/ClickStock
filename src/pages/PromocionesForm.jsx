import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
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
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    descuento: "",
    fechaInicio: "",
    fechaFin: "",
    imagen: null,
  });

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    // Liberar objeto URL anterior cuando cambie la preview
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Usar react-hot-toast en lugar de alert
    toast.success("Promoción creada con éxito");
    console.log("Datos de la promoción:", formData);
    // Aquí podés conectar con el backend usando axios.post(...)
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{ p: 3 }}
            elevation={3}
            component="form"
            onSubmit={handleSubmit}
          >
            <Typography variant="h6" gutterBottom>
              🛍️ Crear nueva promoción
            </Typography>

            <Stack spacing={2}>
              <TextField
                label="Título"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Ej: 20% OFF en zapatillas"
                required
                fullWidth
              />

              <TextField
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Detalles de la promoción..."
                required
                multiline
                rows={4}
                fullWidth
              />

              <TextField
                label="Descuento (%)"
                name="descuento"
                type="number"
                value={formData.descuento}
                onChange={handleChange}
                inputProps={{ min: 0, max: 100 }}
                required
                fullWidth
              />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Fecha inicio"
                    name="fechaInicio"
                    type="date"
                    value={formData.fechaInicio}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Fecha fin"
                    name="fechaFin"
                    type="date"
                    value={formData.fechaFin}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    required
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Box>
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="promo-imagen"
                  type="file"
                  name="imagen"
                  onChange={handleChange}
                />
                <label htmlFor="promo-imagen">
                  <Button variant="outlined" component="span">
                    Seleccionar imagen (opcional)
                  </Button>
                </label>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button type="submit" variant="contained">
                  Crear Promoción
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
                  {formData.titulo || "Título de la promoción"}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {formData.descripcion || "Descripción breve..."}
                </Typography>

                {formData.descuento && (
                  <Typography
                    component="span"
                    sx={{ display: "block", fontWeight: 700 }}
                  >
                    {formData.descuento}% OFF
                  </Typography>
                )}

                {(formData.fechaInicio || formData.fechaFin) && (
                  <Typography variant="caption" color="text.secondary">
                    {formData.fechaInicio} → {formData.fechaFin}
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
