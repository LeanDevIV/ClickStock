import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Typography, Box, CircularProgress } from "@mui/material";
import ProductGrid from "../../components/products/ProductGrid";
import clientAxios from "../../utils/clientAxios";
import { usePromocionStore } from "../../hooks/usePromocionStore";

import { usePageTitle } from "../../hooks/usePageTitle";

const SearchResults = () => {
  usePageTitle("Resultados de Búsqueda");

  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { obtenerPromocionesActivas } = usePromocionStore();
  const [promociones, setPromociones] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const { data } = await clientAxios.get(`/productos?search=${query}`);
        setProductos(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  useEffect(() => {
    const cargarPromociones = async () => {
      try {
        const data = await obtenerPromocionesActivas();
        setPromociones(data);
      } catch (error) {
        console.error("Error al cargar promociones:", error);
      }
    };
    cargarPromociones();
  }, [obtenerPromocionesActivas]);

  return (
    <Container maxWidth="xl" sx={{ mt: 12, mb: 4, minHeight: "60vh" }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Resultados para: <strong>{query}</strong>
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress />
        </Box>
      ) : productos.length > 0 ? (
        <ProductGrid productos={productos} promociones={promociones} />
      ) : (
        <Box sx={{ textAlign: "center", mt: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No se encontraron productos que coincidan con tu búsqueda.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default SearchResults;
