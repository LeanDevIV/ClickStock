import React from 'react';
import {
  Box,
  Grid,
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
        <Typography variant="body1" sx={{ ml: 2 }}>
          Cargando productos...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Filtros por categoría */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 4,
            color: 'primary.main'
          }}
        >
          Nuestros Productos
        </Typography>
        
        <Tabs
          value={categoriaSeleccionada}
          onChange={manejarCambioCategoria}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            mb: 3,
            '& .MuiTab-root': {
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '1rem',
              minWidth: 'auto',
              px: 3
            }
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

      {/* Grid de productos */}
      <Grid container spacing={3}>
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((producto) => {
            const imagenUrl = obtenerUrlImagen(producto);
            return (
              <Grid 
                item 
                xs={6} 
                sm={4} 
                md={3} 
                lg={2} 
                key={producto._id}
                sx={{
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <Card 
                  sx={{ 
                    width: 200,
                    height: 280,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  {/* Imagen del producto */}
                  <Box sx={{ position: 'relative', flex: 1 }}>
                    <CardMedia
                      component="img"
                      height="160"
                      image={imagenUrl}
                      alt={producto.nombre}
                      sx={{ 
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%'
                      }}
                    />
                    
                    {/* Overlay con título al hacer hover */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.3s ease-in-out',
                        '&:hover': {
                          opacity: 1
                        }
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'white',
                          fontWeight: 600,
                          textAlign: 'center',
                          px: 1,
                          fontSize: '0.9rem'
                        }}
                      >
                        {producto.nombre}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Contenido de la card */}
                  <CardContent sx={{ p: 1.5, flex: '0 0 auto' }}>
                    {/* Categoría */}
                    {producto.categoria && (
                      <Chip 
                        label={producto.categoria.nombre} 
                        variant="outlined" 
                        size="small" 
                        sx={{ 
                          mb: 1,
                          height: 20,
                          fontSize: '0.7rem'
                        }}
                      />
                    )}
                    
                    {/* Precio y stock */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography 
                        variant="h6" 
                        color="primary" 
                        sx={{ 
                          fontWeight: 700,
                          fontSize: '0.9rem'
                        }}
                      >
                        ${producto.precio?.toLocaleString() || '0'}
                      </Typography>
                      <Chip 
                        label={producto.stock > 0 ? `Stock: ${producto.stock}` : 'Agotado'} 
                        color={producto.stock > 0 ? 'success' : 'default'}
                        size="small"
                        variant="outlined"
                        sx={{
                          height: 20,
                          fontSize: '0.65rem'
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Grid item xs={12}>
            <Alert severity="info" sx={{ textAlign: 'center' }}>
              No hay productos disponibles en esta categoría
            </Alert>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default ProductosHome;