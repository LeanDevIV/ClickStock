import { useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Box,
  Typography,
  IconButton,
  Chip,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";

// URL base del servidor
const API_BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

// Función para obtener la URL completa de la imagen
const getImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  // Si es una ruta relativa, agregar el base URL
  return `${API_BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;
};

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const ModalProducto = ({
  open,
  handleClose,
  handleSubmit,
  handleInputChange,
  productoActual,
  editando,
  handleFileUpload,
  imagenesPreview = [],
  cargandoImagen = false,
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0 && handleFileUpload) {
      handleFileUpload(files);
    }
  };

  const eliminarImagen = (index) => {
    if (handleInputChange) {
      const nuevasImagenes = productoActual.imagenes
        ? [...productoActual.imagenes]
        : [];
      nuevasImagenes.splice(index, 1);
      handleInputChange({
        target: {
          name: "imagenes",
          value: nuevasImagenes,
        },
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, p: 1 },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
        {editando ? "Editar Producto" : "Crear Nuevo Producto"}
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Nombre del Producto"
              name="nombre"
              value={productoActual.nombre || ""}
              onChange={handleInputChange}
              required
              fullWidth
            />

            <TextField
              label="Descripción"
              name="descripcion"
              value={productoActual.descripcion || ""}
              onChange={handleInputChange}
              required
              fullWidth
              multiline
              rows={3}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Precio"
                type="number"
                name="precio"
                value={productoActual.precio || ""}
                onChange={handleInputChange}
                required
                inputProps={{ min: 0, step: 0.01 }}
                fullWidth
              />
              <TextField
                label="Stock"
                type="number"
                name="stock"
                value={productoActual.stock || ""}
                onChange={handleInputChange}
                required
                inputProps={{ min: 0 }}
                fullWidth
              />
            </Stack>

            <TextField
              label="Categoría"
              name="categoria"
              value={productoActual.categoria || ""}
              onChange={handleInputChange}
              required
              fullWidth
            />

            {/* Sección de subida de imágenes */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Imágenes del Producto
              </Typography>

              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                disabled={cargandoImagen}
                fullWidth
                sx={{ mb: 2 }}
              >
                {cargandoImagen ? "Subiendo..." : "Subir Imágenes"}
                <VisuallyHiddenInput
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                />
              </Button>

              {cargandoImagen && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2" color="text.secondary">
                    Subiendo imagen...
                  </Typography>
                </Box>
              )}

              {/* Preview de imágenes */}
              {(productoActual.imagenes?.length > 0 ||
                imagenesPreview.length > 0) && (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    mt: 2,
                  }}
                >
                  {/* Mostrar imágenes del producto actual */}
                  {productoActual.imagenes?.map((url, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        width: 120,
                        height: 120,
                        borderRadius: 2,
                        overflow: "hidden",
                        border: "2px solid",
                        borderColor: "divider",
                      }}
                    >
                      <img
                        src={getImageUrl(url)}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          // Si falla, intentar con la URL original
                          if (e.target.src !== getImageUrl(url)) {
                            e.target.src = getImageUrl(url);
                          } else {
                            // Si sigue fallando, mostrar un placeholder
                            e.target.style.display = "none";
                          }
                        }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          bgcolor: "error.main",
                          color: "white",
                          "&:hover": { bgcolor: "error.dark" },
                        }}
                        onClick={() => eliminarImagen(index)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}

                  {/* Mostrar previews temporales */}
                  {imagenesPreview.map((preview, index) => (
                    <Box
                      key={`preview-${index}`}
                      sx={{
                        position: "relative",
                        width: 120,
                        height: 120,
                        borderRadius: 2,
                        overflow: "hidden",
                        border: "2px solid",
                        borderColor: "primary.main",
                      }}
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <Chip
                        label="Subiendo..."
                        size="small"
                        sx={{
                          position: "absolute",
                          bottom: 4,
                          left: 4,
                          bgcolor: "primary.main",
                          color: "white",
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              )}

              {/* Campo alternativo para URL manual */}
              <TextField
                label="O ingresa URL de imagen manualmente"
                type="url"
                name="urlImagenManual"
                placeholder="https://ejemplo.com/imagen.jpg"
                fullWidth
                sx={{ mt: 2 }}
                helperText="Puedes agregar una URL de imagen si prefieres no subir archivos"
                InputProps={{
                  endAdornment: (
                    <Button
                      size="small"
                      onClick={() => {
                        const urlInput = document.querySelector(
                          'input[name="urlImagenManual"]'
                        );
                        if (urlInput?.value) {
                          const nuevasImagenes = productoActual.imagenes
                            ? [...productoActual.imagenes]
                            : [];
                          if (!nuevasImagenes.includes(urlInput.value)) {
                            nuevasImagenes.push(urlInput.value);
                            handleInputChange({
                              target: {
                                name: "imagenes",
                                value: nuevasImagenes,
                              },
                            });
                            urlInput.value = "";
                          }
                        }
                      }}
                    >
                      Agregar
                    </Button>
                  ),
                }}
              />
            </Box>
          </Stack>

          <DialogActions sx={{ mt: 2 }}>
            <Button onClick={handleClose} color="inherit" variant="outlined">
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disableElevation
              disabled={
                cargandoImagen ||
                !productoActual.imagenes?.length ||
                productoActual.imagenes.length === 0
              }
            >
              {editando ? "Guardar Cambios" : "Crear Producto"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalProducto;
  