import React, { useEffect, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import "@splidejs/react-splide/css";
import clientAxios from "../../utils/clientAxios";
import { Box, Typography, Container, Skeleton } from "@mui/material";
import ProductCard from "../products/ProductCard";
import "./CarruselDestacados.css";

const CarruselDestacados = () => {
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerProductosDestacados = async () => {
      try {
        const { data } = await clientAxios.get("/productos?destacado=true");
        setProductosDestacados(data);
      } catch (error) {
        console.error("Error al obtener productos destacados:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerProductosDestacados();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 6, fontWeight: "bold", color: "primary.main" }}
        >
          Productos Destacados
        </Typography>
        <Box sx={{ display: "flex", gap: 2, overflow: "hidden" }}>
          {[...Array(4)].map((_, index) => (
            <Box key={index} sx={{ minWidth: "25%", p: 2 }}>
              <Skeleton
                variant="rectangular"
                height={300}
                sx={{ borderRadius: 2, bgcolor: "rgba(255,255,255,0.1)" }}
              />
              <Skeleton
                variant="text"
                sx={{ mt: 1, bgcolor: "rgba(255,255,255,0.1)" }}
              />
              <Skeleton
                variant="text"
                width="60%"
                sx={{ bgcolor: "rgba(255,255,255,0.1)" }}
              />
            </Box>
          ))}
        </Box>
      </Container>
    );
  }

  if (productosDestacados.length === 0) return null;

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Typography
        variant="h3"
        component="h2"
        align="center"
        gutterBottom
        sx={{ mb: 6, fontWeight: "bold", color: "primary.main" }}
      >
        Productos Destacados
      </Typography>

      <Splide
        options={{
          type: "loop",
          drag: "free",
          focus: "center",
          perPage: 4,
          gap: "2rem",
          autoScroll: {
            speed: 1,
            pauseOnHover: true,
            pauseOnFocus: false,
          },
          arrows: false,
          pagination: false,
          breakpoints: {
            1200: {
              perPage: 3,
            },
            900: {
              perPage: 2,
            },
            600: {
              perPage: 1,
            },
          },
        }}
        extensions={{ AutoScroll }}
      >
        {productosDestacados.map((producto) => (
          <SplideSlide key={producto._id} style={{ padding: "20px 10px" }}>
            <div className="destacado-card-wrapper">
              <div className="destacado-ribbon">Destacado</div>
              <ProductCard producto={producto} />
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </Container>
  );
};

export default CarruselDestacados;
