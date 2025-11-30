import { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Badge,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { obtenerCarrito } from "../../services/carritoService";
import { Link } from "react-router-dom";

const CarritoPreview = ({ show, handleClose }) => {
  const [carrito, setCarrito] = useState({ productos: [], total: 0 });

  useEffect(() => {
    if (show) cargarCarrito();
  }, [show]);

  const cargarCarrito = async () => {
    try {
      const data = await obtenerCarrito();
      setCarrito(data);
    } catch (error) {
      console.error("Error al cargar carrito:", error);
    }
  };

  const ultimosCinco = carrito.productos.slice(-5).reverse();

  return (
    <Drawer anchor="right" open={show} onClose={handleClose}>
      <Box
        sx={{
          width: 350,
          p: 2,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Tu carrito</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        {ultimosCinco.length === 0 ? (
          <Typography color="text.secondary" align="center">
            El carrito está vacío.
          </Typography>
        ) : (
          <List>
            {ultimosCinco.map((item, idx) => (
              <ListItem
                key={idx}
                secondaryAction={
                  <Badge color="primary" badgeContent={item.cantidad} />
                }
              >
                <ListItemText primary={item.producto?.nombre || "Producto"} />
              </ListItem>
            ))}
          </List>
        )}

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="subtitle1" fontWeight="bold">
            Total:
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold">
            ${carrito.total}
          </Typography>
        </Box>

        <Button
          component={Link}
          to="/carrito"
          variant="contained"
          fullWidth
          onClick={handleClose}
        >
          Ir al carrito completo
        </Button>
      </Box>
    </Drawer>
  );
};

export default CarritoPreview;
