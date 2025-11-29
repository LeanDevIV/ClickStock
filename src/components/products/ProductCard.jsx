import React, { useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Fade,
  useTheme,
  alpha,
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useFavoritos } from "../../hooks/useFavoritos";

const placeholder = () => `https://picsum.photos/id/66/300/200`;

const ProductCard = ({ producto }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [hoverId, setHoverId] = useState(null);

  const {
    añadirAlCarrito,
    quitarDelCarrito,
    cargando: cargandoCarrito,
    articulos,
  } = useCart();

  const { toggleFavorito, esFavorito } = useFavoritos();

  const estaEnCarrito = (productoId) => {
    return articulos.some((item) => item.idProducto === productoId);
  };

  const handleToggleCarrito = async (e) => {
    e.stopPropagation();
    try {
      if (estaEnCarrito(producto._id)) {
        await quitarDelCarrito(producto._id);
      } else {
        await añadirAlCarrito(producto, 1);
      }
    } catch (error) {
      console.error("Error al modificar el carrito:", error);
    }
  };

  const handleToggleFavorito = async (e) => {
    e.stopPropagation();
    await toggleFavorito(producto._id);
  };

  const obtenerUrlImagen = (prod) => {
    if (prod.imagenes && prod.imagenes.length > 0) {
      if (prod.imagenes[0].startsWith("http")) {
        return prod.imagenes[0];
      }
      return `${import.meta.env.VITE_API_URL}${prod.imagenes[0]}`;
    }
    return null;
  };

  const img = obtenerUrlImagen(producto) || placeholder();
  const enCarrito = estaEnCarrito(producto._id);
  const enFavoritos = esFavorito(producto._id);

  return (
    <Card
      onMouseEnter={() => setHoverId(producto._id)}
      onMouseLeave={() => setHoverId(null)}
      onClick={() => navigate(`/producto/detalle/${producto._id}`)}
      sx={{
        width: "100%",
        maxWidth: 260,
        height: { xs: 380, sm: 400, md: 420 },
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        overflow: "hidden",
        transition: "transform 200ms ease, box-shadow 200ms ease",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          border: `1px solid ${theme.palette.primary.main}55`,
        },
      }}
    >
      <Box sx={{ width: "100%", position: "relative" }}>
        <CardMedia
          component="img"
          image={img}
          alt={producto.nombre}
          sx={{
            width: "100%",
            height: { xs: 170, sm: 180, md: 200 },
            objectFit: "cover",
            display: "block",
          }}
        />

        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <Fade in={hoverId === producto._id} timeout={200}>
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0,0,0,0.4)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                backdropFilter: "blur(2px)",
              }}
            >
              <Tooltip
                title={enCarrito ? "Quitar del carrito" : "Agregar al carrito"}
              >
                <IconButton
                  onClick={handleToggleCarrito}
                  disabled={cargandoCarrito}
                  sx={{
                    backgroundColor: "white",
                    color: theme.palette.primary.main,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                    },
                  }}
                >
                  {enCarrito ? (
                    <ShoppingCartCheckoutIcon />
                  ) : (
                    <AddShoppingCartIcon />
                  )}
                </IconButton>
              </Tooltip>

              <Tooltip
                title={
                  enFavoritos ? "Quitar de favoritos" : "Agregar a favoritos"
                }
              >
                <IconButton
                  onClick={handleToggleFavorito}
                  sx={{
                    backgroundColor: "white",
                    color: enFavoritos
                      ? theme.palette.error.main
                      : theme.palette.text.secondary,
                    "&:hover": {
                      backgroundColor: theme.palette.error.main,
                      color: "white",
                    },
                  }}
                >
                  {enFavoritos ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
              </Tooltip>
            </Box>
          </Fade>
        </Box>

        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <IconButton
            onClick={handleToggleCarrito}
            disabled={cargandoCarrito}
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              color: enCarrito
                ? theme.palette.success.main
                : theme.palette.primary.main,
              backdropFilter: "blur(4px)",
              boxShadow: 1,
              "&:hover": {
                backgroundColor: "white",
              },
              width: 36,
              height: 36,
            }}
          >
            {enCarrito ? (
              <ShoppingCartCheckoutIcon fontSize="small" />
            ) : (
              <AddShoppingCartIcon fontSize="small" />
            )}
          </IconButton>

          <IconButton
            onClick={handleToggleFavorito}
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              color: enFavoritos
                ? theme.palette.error.main
                : theme.palette.text.secondary,
              backdropFilter: "blur(4px)",
              boxShadow: 1,
              "&:hover": {
                backgroundColor: "white",
              },
              width: 36,
              height: 36,
            }}
          >
            {enFavoritos ? (
              <Favorite fontSize="small" />
            ) : (
              <FavoriteBorder fontSize="small" />
            )}
          </IconButton>
        </Box>
      </Box>

      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          py: 2,
          px: 2,
        }}
      >
        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              lineHeight: 1.2,
              mb: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              height: "2.4em",
            }}
          >
            {producto.nombre}
          </Typography>

          <Chip
            label={producto.categoria?.nombre}
            size="small"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 600,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              border: "none",
              mb: 2,
            }}
          />
        </Box>

        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: theme.palette.primary.main,
              }}
            >
              ${producto.precio?.toLocaleString()}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mt: 1,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor:
                  producto.stock > 5
                    ? theme.palette.success.main
                    : producto.stock > 0
                    ? theme.palette.warning.main
                    : theme.palette.error.main,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color:
                  producto.stock > 5
                    ? theme.palette.success.main
                    : producto.stock > 0
                    ? theme.palette.warning.main
                    : theme.palette.error.main,
              }}
            >
              {producto.stock > 0 ? `Stock: ${producto.stock} u.` : "Sin Stock"}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
