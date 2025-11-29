import React, { useEffect, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import "@splidejs/react-splide/css";
import clientAxios from "../../utils/clientAxios";
import { Box, Typography, Container } from "@mui/material";
import ProductCard from "../products/ProductCard";
import "./CarruselDestacados.css";

const CarruselDestacados = () => {
  const [productosDestacados, setProductosDestacados] = useState([]);

  useEffect(() => {
    const obtenerProductosDestacados = async () => {
      try {
        const { data } = await clientAxios.get("/productos?destacado=true");
        setProductosDestacados(data);
      } catch (error) {
        console.error("Error al obtener productos destacados:", error);
      }
    };

    obtenerProductosDestacados();
  }, []);

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
