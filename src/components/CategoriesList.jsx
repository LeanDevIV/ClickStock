
import { useEffect } from "react";
import { useCategoriesStore } from "../hooks/useCategoriesStore";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
} from "@mui/material";

export const CategoriesList = ({ onSelectCategory }) => {
  const { categorias, loading, error, fetchCategorias } = useCategoriesStore();

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Categorías
      </Typography>
      <Grid container spacing={3} sx={{ justifyContent: "center" }}>
        {categorias && categorias.length > 0 ? (
          categorias.map((categoria) => (
            <Grid
              item
              key={categoria._id}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Card
                onClick={() => onSelectCategory(categoria._id)}
                sx={{
                  width: 280,
                  height: 340,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderRadius: 3,
                  boxShadow: 3,
                  overflow: "hidden",
                  position: "relative",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 20,
                  },
                }}
              >
                {categoria.imagen && (
                  <CardMedia
                    component="img"
                    image={categoria.imagen}
                    alt={categoria.nombre}
                    sx={{
                      height: 140,
                      objectFit: "cover",
                    }}
                  />
                )}
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    textAlign: "center",
                    p: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  >
                    {categoria.nombre}
                  </Typography>
                  {categoria.descripcion && (
                    <Typography variant="body2" color="text.secondary">
                      {categoria.descripcion}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No hay categorías disponibles.</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default CategoriesList;
