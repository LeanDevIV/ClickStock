import React from 'react';
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
  Container
} from '@mui/material';
import { useProductosFiltrados } from '../../hooks/useProductosFiltrados';

const getPlaceholderImage = () => {
  return `https://picsum.photos/id/66/300/200`;
};

const ProductosHome = () => {
  const {
    categorias,
    categoriaSeleccionada,
    productosFiltrados,
    loading,
    error,
    manejarCambioCategoria,
    obtenerUrlImagen
  } = useProductosFiltrados();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>Cargando...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 3,
            color: 'primary.main',
            fontSize: { xs: '1.5rem', md: '2.5rem' }
          }}
        >
          Nuestros Productos
        </Typography>

        <Tabs
          value={categoriaSeleccionada}
          onChange={manejarCambioCategoria}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            mb: 2,
            '& .MuiTab-root': {
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.9rem',
              minWidth: 'auto',
              px: 2
            }
          }}
        >
          <Tab label="Todos" value="todos" />
          {categorias.map((categoria) => (
            <Tab key={categoria._id} label={categoria.nombre} value={categoria._id} />
          ))}
        </Tabs>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(4, 1fr)',
            lg: 'repeat(5, 1fr)',
          },
          gap: { xs: 2, md: 3 },
          justifyItems: 'center'
        }}
      >
        {productosFiltrados.map((producto) => {
          const originalImageUrl = obtenerUrlImagen(producto);
          const finalImageUrl = originalImageUrl || getPlaceholderImage();

          return (
            <Card
              key={producto._id}
              sx={{
                width: '100%',
                maxWidth: 250,
                aspectRatio: '3/4',
                borderRadius: 2,
                backgroundColor: "#1a1a1a",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                transition: "0.3s",
                display: 'flex',
                flexDirection: 'column',
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 12px 20px rgba(0,0,0,0.5)",
                },
              }}
            >
              <Box sx={{
                width: "100%",
                height: "60%",
                overflow: "hidden",
                backgroundColor: "#000",
                position: 'relative'
              }}>
                <CardMedia
                  component="img"
                  image={finalImageUrl}
                  alt={producto.nombre}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>

              <CardContent sx={{
                p: 1.5,
                height: '40%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                "&:last-child": { pb: 1.5 }
              }}>

                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 0.5,
                  mb: 0.5
                }}>
                  <Chip
                    label={producto.categoria?.nombre}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: "#FFD54F",
                      color: "#FFD54F",
                      fontSize: "0.65rem",
                      height: 20,
                      maxWidth: '55%',
                      "& .MuiChip-label": {
                        px: 0.75,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#FFD54F",
                      fontWeight: 800,
                      fontSize: "0.9rem",
                      lineHeight: 1,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    ${producto.precio?.toLocaleString()}
                  </Typography>
                </Box>

                <Typography
                  variant="caption"
                  sx={{
                    color: "#bbb",
                    textAlign: 'center',
                    fontSize: '0.7rem',
                    mt: 'auto'
                  }}
                >
                  {producto.stock > 0 ? `${producto.stock} disponibles` : "Agotado"}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Container>
  );
};

export default ProductosHome;