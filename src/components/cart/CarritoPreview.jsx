import { useEffect, useState } from "react";
import useCart from "../../hooks/useCart";
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
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const CarritoPreview = ({ show, handleClose }) => {
  const { articulos, precioTotal } = useCart();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const ultimosCinco = articulos.slice(-5).reverse();

  return (
    <Drawer
      anchor="right"
      open={show}
      onClose={handleClose}
      PaperProps={{
        sx: {
          backgroundColor: "transparent",
          boxShadow: "none",
        },
      }}
    >
      <Box
        sx={{
          width: 380,
          p: 3,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          background: isDarkMode
            ? "rgba(18, 18, 18, 0.85)"
            : "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(12px)",
          borderLeft: isDarkMode
            ? "1px solid rgba(255, 255, 255, 0.1)"
            : "1px solid rgba(0, 0, 0, 0.1)",
          boxShadow: "-4px 0 30px rgba(0, 0, 0, 0.5)",
          color: theme.palette.text.primary,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="bold" sx={{ letterSpacing: 1 }}>
            Tu carrito
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              color: isDarkMode
                ? "rgba(255, 255, 255, 0.7)"
                : "rgba(0, 0, 0, 0.6)",
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider
          sx={{
            my: 2,
            borderColor: isDarkMode
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.1)",
          }}
        />

        {ultimosCinco.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
            El carrito está vacío.
          </Typography>
        ) : (
          <List sx={{ flexGrow: 1, overflowY: "auto" }}>
            {ultimosCinco.map((item, idx) => (
              <ListItem
                key={idx}
                secondaryAction={
                  <Badge
                    color="primary"
                    badgeContent={item.cantidad}
                    sx={{ "& .MuiBadge-badge": { fontSize: "0.8rem" } }}
                  />
                }
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  backgroundColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.03)"
                    : "rgba(0, 0, 0, 0.03)",
                  "&:hover": {
                    backgroundColor: isDarkMode
                      ? "rgba(255, 255, 255, 0.06)"
                      : "rgba(0, 0, 0, 0.05)",
                  },
                }}
              >
                <ListItemText
                  primary={item.nombre || "Producto"}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItem>
            ))}
          </List>
        )}

        <Divider
          sx={{
            my: 2,
            borderColor: isDarkMode
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.1)",
          }}
        />

        <Box display="flex" justifyContent="space-between" mb={3}>
          <Typography variant="h6" fontWeight="bold">
            Total:
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="primary.main">
            ${precioTotal?.toLocaleString()}
          </Typography>
        </Box>

        <Button
          component={Link}
          to="/carrito"
          variant="contained"
          fullWidth
          onClick={handleClose}
          sx={{
            py: 1.5,
            fontWeight: "bold",
            background: "linear-gradient(45deg, #D4AF37 30%, #B91C1C 90%)",
            boxShadow: "0 3px 5px 2px rgba(212, 175, 55, .3)",
            "&:hover": {
              background: "linear-gradient(45deg, #FFD700 30%, #FF0000 90%)",
              boxShadow: "0 3px 5px 2px rgba(255, 215, 0, .4)",
            },
            color: "#fff",
          }}
        >
          Ir al carrito completo
        </Button>
      </Box>
    </Drawer>
  );
};

export default CarritoPreview;
