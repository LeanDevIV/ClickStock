import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Paper,
    Button,
    Stack,
  } from "@mui/material";
  import EditIcon from "@mui/icons-material/Edit";
  import DeleteIcon from "@mui/icons-material/Delete";
  
  const TablaProductos = ({ productos, handleShowModal, eliminarProducto }) => {
    return (
      <TableContainer component={Paper} sx={{ boxShadow: 2, borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "primary.main" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>Nombre</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>Precio</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>Stock</TableCell>
              <TableCell
                align="center"
                sx={{ color: "white", fontWeight: 600 }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto._id} hover>
                <TableCell>{producto.nombre}</TableCell>
                <TableCell>${producto.precio}</TableCell>
                <TableCell>{producto.stock}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleShowModal(producto)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => eliminarProducto(producto._id)}
                    >
                      Eliminar
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
  
  export default TablaProductos;
  