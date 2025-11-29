import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Container,
  useTheme,
  Fade,
  IconButton,
  Tooltip,
  alpha,
  Button,
} from "@mui/material";
import { Favorite, SentimentDissatisfied } from "@mui/icons-material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useFavoritos } from "../../hooks/useFavoritos";
import { obtenerDetalleFavoritos } from "../../services/favoritosService";
import { useStore } from "../../hooks/useStore";
import toast from "react-hot-toast";

const placeholder = () => `https://picsum.photos/id/66/300/200`;

const FavoritosPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { handleOpenAuth } = useOutletContext();
  const { token } = useStore();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoverId, setHoverId] = useState(null);

  const {
    añadirAlCarrito,
    quitarDelCarrito,
    cargando: cargandoCarrito,
    articulos,
  } = useCart();

  const { toggleFavorito } = useFavoritos();

  const cargarFavoritosDetallados = async () => {
    try {
      setLoading(true);
      const data = await obtenerDetalleFavoritos();
      setProductos(data);
    } catch (error) {
      console.error("Error al cargar favoritos:", error);
      toast.error("Error al cargar tus favoritos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      cargarFavoritosDetallados();
    } else {
      setLoading(false);
      setProductos([]);
    }
  }, [token]);

  const estaEnCarrito = (productoId) => {
    return articulos.some((item) => item.idProducto === productoId);
  };

  const handleToggleCarrito = async (producto, event) => {
    event.stopPropagation();
    try {
      if (estaEnCarrito(producto.idProducto)) {
        await quitarDelCarrito(producto.idProducto);
      } else {
        const productoParaCarrito = {
          _id: producto.idProducto,
          nombre: producto.nombre,
          precio: producto.precio,
          imagenes: producto.imagenes,
          stock: producto.stock,
        };
        await añadirAlCarrito(productoParaCarrito, 1);
      }
    } catch (error) {
      console.error("Error al modificar el carrito:", error);
    }
  };

  const handleRemoveFavorito = async (productoId, event) => {
    event.stopPropagation();
    await toggleFavorito(productoId);
    setProductos((prev) => prev.filter((p) => p.idProducto !== productoId));
  };

  const obtenerUrlImagen = (producto) => {
    if (producto.imagenes && producto.imagenes.length > 0) {
      if (producto.imagenes[0].startsWith("http")) {
        return producto.imagenes[0];
      }
      return `${import.meta.env.VITE_API_URL}${producto.imagenes[0]}`;
    }
    return null;
  };

  if (loading) {
    return (
      <Box
        minHeight="60vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress
          size={60}
          sx={{ color: theme.palette.primary.main }}
        />
      </Box>
    );
  }

  if (!token) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Inicia sesión para ver tus favoritos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenAuth}
          sx={{ mt: 2 }}
        >
          Ir al Login
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Box sx={{ mb: 6, textAlign: "center" }}>
        <Typography
          variant="h3"
          fontWeight={700}
          sx={{ color: theme.palette.primary.main, mb: 1 }}
        >
          Mis Favoritos
        </Typography>
        <Typography sx={{ opacity: 0.7 }}>
          Tus productos guardados para después
        </Typography>
      </Box>

      {productos.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
            textAlign: "center",
            py: 8,
          }}
        >
          <SentimentDissatisfied
            sx={{
              fontSize: 80,
              color: theme.palette.text.disabled,
              mb: 2,
              opacity: 0.5,
            }}
          />
          <Typography
            variant="h5"
            color="text.secondary"
            gutterBottom
            sx={{ fontWeight: 300 }}
          >
            No tienes favoritos aún
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/")}
            sx={{ mt: 3 }}
          >
            Explorar Productos
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2,1fr)",
              sm: "repeat(3,1fr)",
              md: "repeat(4,1fr)",
              lg: "repeat(5,1fr)",
            },
            gap: { xs: 2.5, md: 3.5 },
            justifyItems: "center",
            alignContent: "start",
          }}
        >
          {productos.map((item) => {
            const img = obtenerUrlImagen(item) || placeholder();
            const enCarrito = estaEnCarrito(item.idProducto);

            return (
              <Card
                key={item._id}
                onMouseEnter={() => setHoverId(item._id)}
                onMouseLeave={() => setHoverId(null)}
                onClick={() => navigate(`/producto/detalle/${item.idProducto}`)}
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
                    alt={item.nombre}
                    sx={{
                      width: "100%",
                      height: { xs: 170, sm: 180, md: 200 },
                      objectFit: "cover",
                      display: "block",
                    }}
                  />

                  <Box sx={{ display: { xs: "none", md: "block" } }}>
                    <Fade in={hoverId === item._id} timeout={200}>
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
                          title={
                            enCarrito
                              ? "Quitar del carrito"
                              : "Agregar al carrito"
                          }
                        >
                          <IconButton
                            onClick={(e) => handleToggleCarrito(item, e)}
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

                        <Tooltip title="Quitar de favoritos">
                          <IconButton
                            onClick={(e) =>
                              handleRemoveFavorito(item.idProducto, e)
                            }
                            sx={{
                              backgroundColor: "white",
                              color: theme.palette.error.main,
                              "&:hover": {
                                backgroundColor: theme.palette.error.main,
                                color: "white",
                              },
                            }}
                          >
                            <Favorite />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Fade>
                  </Box>

                  <Box sx={{ display: { xs: "block", md: "none" } }}>
                    <IconButton
                      onClick={(e) => handleToggleCarrito(item, e)}
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
                      onClick={(e) => handleRemoveFavorito(item.idProducto, e)}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        color: theme.palette.error.main,
                        backdropFilter: "blur(4px)",
                        boxShadow: 1,
                        "&:hover": {
                          backgroundColor: "white",
                        },
                        width: 36,
                        height: 36,
                      }}
                    >
                      <Favorite fontSize="small" />
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
                      {item.nombre}
                    </Typography>

                    <Chip
                      label={
                        typeof item.categoria === "object"
                          ? item.categoria.nombre
                          : item.categoria
                      }
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
                        ${item.precio?.toLocaleString()}
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
                            item.stock > 5
                              ? theme.palette.success.main
                              : item.stock > 0
                              ? theme.palette.warning.main
                              : theme.palette.error.main,
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color:
                            item.stock > 5
                              ? theme.palette.success.main
                              : item.stock > 0
                              ? theme.palette.warning.main
                              : theme.palette.error.main,
                        }}
                      >
                        {item.stock > 0
                          ? `Stock: ${item.stock} u.`
                          : "Sin Stock"}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}
    </Container>
  );
};

export default FavoritosPage;
