import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Container,
  Button,
  useTheme,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { useProductosFiltrados } from "../../hooks/useProductosFiltrados";
import ProductGrid from "../products/ProductGrid";

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
  } = useProductosFiltrados();

  const [paginaActual, setPaginaActual] = useState(1);

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

      {loading ? (
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
      ) : (
        <>
          <ProductGrid productos={lista} />

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
        </>
      )}
    </Container>
  );
}
export default ProductosHome;
