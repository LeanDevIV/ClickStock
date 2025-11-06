import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Stack,
  } from "@mui/material";
  
  const ModalProducto = ({
    open,
    handleClose,
    handleSubmit,
    handleInputChange,
    productoActual,
    editando,
  }) => {
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
                value={productoActual.nombre}
                onChange={handleInputChange}
                required
                fullWidth
              />
  
              <TextField
                label="Descripción"
                name="descripcion"
                value={productoActual.descripcion}
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
                  value={productoActual.precio}
                  onChange={handleInputChange}
                  required
                  inputProps={{ min: 0, step: 0.01 }}
                  fullWidth
                />
                <TextField
                  label="Stock"
                  type="number"
                  name="stock"
                  value={productoActual.stock}
                  onChange={handleInputChange}
                  required
                  inputProps={{ min: 0 }}
                  fullWidth
                />
              </Stack>
  
              <TextField
                label="Categoría"
                name="categoria"
                value={productoActual.categoria}
                onChange={handleInputChange}
                required
                fullWidth
              />
  
              <TextField
                label="URL de la Imagen"
                type="url"
                name="imagen"
                value={productoActual.imagen}
                onChange={handleInputChange}
                required
                fullWidth
              />
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
  