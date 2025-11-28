import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Container,
  Button,
  useTheme,
  Fade,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useProductosFiltrados } from "../../hooks/useProductosFiltrados";

const placeholder = () => `https://picsum.photos/id/66/300/200`;

function ProductosHome() {
  const theme = useTheme();

  const scrollSuaveCategorias = () => {
    const el = document.getElementById("categorias-section");
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 20;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const {
    categorias = [],
    categoriaSeleccionada,
    productosFiltrados = [],
    loading,
    error,
    manejarCambioCategoria,
    obtenerUrlImagen,
  } = useProductosFiltrados();

  const [paginaActual, setPaginaActual] = useState(1);
  const [hoverId, setHoverId] = useState(null);

  const calcularPorPagina = () => {
    const w = window.innerWidth;
    if (w < 600) return 6;
    if (w < 900) return 12;
    if (w < 1200) return 16;
    return 20;
  };

  const [porPagina, setPorPagina] = useState(calcularPorPagina());

  useEffect(() => {
    const onResize = () => {
      setPorPagina(calcularPorPagina());
      setPaginaActual(1);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => setPaginaActual(1), [categoriaSeleccionada]);

  const inicio = (paginaActual - 1) * porPagina;
  const lista = productosFiltrados.slice(inicio, inicio + porPagina);
  const totalPag = Math.max(
    1,
    Math.ceil(productosFiltrados.length / porPagina)
  );

  const cambiarPagina = (nueva) => {
    const producto = Math.min(Math.max(1, nueva), totalPag);
    setPaginaActual(producto);
    setTimeout(scrollSuaveCategorias, 60);
  };

  if (loading)
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

  if (error)
    return (
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );

  return (
    <Container id="productos-section" maxWidth="xl" sx={{ py: 6 }}>
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h3"
          textAlign="center"
          fontWeight={700}
          sx={{ color: theme.palette.primary.main, mb: 1 }}
        >
          Nuestros Productos
        </Typography>

        <Typography textAlign="center" sx={{ opacity: 0.7, mb: 3 }}>
          Descubre nuestra colección exclusiva
        </Typography>

        <Box
          id="categorias-section"
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Tabs
            value={categoriaSeleccionada}
            onChange={manejarCambioCategoria}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: theme.palette.primary.main,
                height: 3,
              },
            }}
          >
            <Tab label="Todos" value="todos" />
            {categorias.map((categoria) => (
              <Tab
                key={categoria._id}
                label={categoria.nombre}
                value={categoria._id}
              />
            ))}
          </Tabs>
        </Box>
      </Box>

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
          minHeight: {
            xs: "760px",
            sm: "860px",
            md: "1050px",
            lg: "1150px",
          },
          alignContent: "start",
        }}
      >
        {lista.map((producto) => {
          const img = obtenerUrlImagen(producto) || placeholder();

          return (
            <Card
              key={producto._id}
              onMouseEnter={() => setHoverId(producto._id)}
              onMouseLeave={() => setHoverId(null)}
              sx={{
                width: "100%",
                maxWidth: 260,
                height: { xs: 300, sm: 320, md: 340 },
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                overflow: "hidden",
                transition: "transform 200ms ease, box-shadow 200ms ease",
                display: "flex",
                flexDirection: "column",
                position: "relative",
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

                {/* HOVER: nombre sobre la imagen */}
                <Fade in={hoverId === producto._id} timeout={200}>
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      background: "rgba(0,0,0,0.55)",
                      color: "white",
                      py: 1,
                      px: 1.5,
                      textAlign: "center",
                    }}
                  >
                    <Typography sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
                      {producto.nombre}
                    </Typography>
                  </Box>
                </Fade>
              </Box>

              <CardContent
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  py: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Chip
                    label={producto.categoria?.nombre}
                    size="small"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      backgroundColor: "transparent",
                      border: `1px solid ${theme.palette.primary.main}10`,
                    }}
                  />

                  <Typography
                    sx={{ fontWeight: 800, color: theme.palette.primary.main }}
                  >
                    ${producto.precio?.toLocaleString()}
                  </Typography>
                </Box>

                <Box
                  textAlign="center"
                  sx={{
                    borderTop: `1px solid ${theme.palette.divider}`,
                    pt: 1,
                    mt: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {producto.stock}
                    </Typography>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor:
                          producto.stock > 0
                            ? theme.palette.success.main
                            : theme.palette.error.main,
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {totalPag > 1 && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={2}
          mt={6}
        >
          <Button
            disabled={paginaActual === 1}
            variant="outlined"
            onClick={() => cambiarPagina(paginaActual - 1)}
            startIcon={<ChevronLeft />}
            sx={{ px: 2, borderRadius: 2 }}
          >
            Anterior
          </Button>

          <Typography fontWeight={600}>
            Página {paginaActual} de {totalPag}
          </Typography>

          <Button
            disabled={paginaActual === totalPag}
            variant="outlined"
            onClick={() => cambiarPagina(paginaActual + 1)}
            endIcon={<ChevronRight />}
            sx={{ px: 2, borderRadius: 2 }}
          >
            Siguiente
          </Button>
        </Box>
      )}

      {totalPag > 1 && (
        <Typography textAlign="center" mt={2} sx={{ opacity: 0.7 }}>
          Mostrando {lista.length} de {productosFiltrados.length} productos
        </Typography>
      )}
    </Container>
  );
}
export default ProductosHome;
