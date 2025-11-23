import React from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Box,
  Grow,
  useTheme,
} from "@mui/material";
import { GitHub, LinkedIn } from "@mui/icons-material";

const integrantes = [
  {
    nombre: "Luciano Mayorga",
    rol: "Desarrollador Frontend",
    imagen:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRq2Td0CIbPGuZvYgLyx0up0jcQ1VH3Vm5yMg&s",
    github: "https://github.com/lucianomayorga",
    linkedin: "#",
  },
  {
    nombre: "Leandro Cordoba",
    rol: "Desarrollador Fullstack",
    imagen: "https://avatars.githubusercontent.com/u/123712000?v=4",
    github: "https://github.com/LeanDevIV",
    linkedin: "#",
  },
  {
    nombre: "Sara Robles",
    rol: "Diseñador fullstack",
    imagen: "https://avatars.githubusercontent.com/u/209563219?v=4",
    github: "https://github.com/sara-18Git",
    linkedin: "#",
  },
  {
    nombre: "Isaias Romano",
    rol: "Tester",
    imagen: "https://ca.slack-edge.com/THQU1MGPN-U088Z15QP6Z-1362ac5a8ce0-512",
    github: "#",
    linkedin: "#",
  },
  {
    nombre: "Alvaro Roldan",
    rol: "Tester",
    imagen:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6SNQ9XsPt9cv4aHIR6z2XXTBHZ9Wn091bkQ&s",
    github: "#",
    linkedin: "#",
  },
];

export default function AboutUs() {
  const theme = useTheme();
  const modoOscuro = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "background.default",
        py: 8,
        textAlign: "center",
        minHeight: "80vh",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          fontWeight="bold"
          sx={{
            mb: 2,
            color: "text.primary",
          }}
        >
          Quiénes Somos
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 6,
            maxWidth: "700px",
            mx: "auto",
            color: "#D4AF37",
            fontSize: "1.1rem",
          }}
        >
          Somos un equipo de desarrolladores apasionados por la tecnología y el
          trabajo en equipo. Este proyecto forma parte de nuestro trabajo final
          del curso de desarrollo Fullstack, donde buscamos crear una aplicación
          web moderna y funcional. Y por sobre todo, APROBAR😁
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {integrantes.map((integrante, index) => (
            <Grid xs={12} sm={6} md={4} lg={2.4} key={index}>
              <Grow in={true} timeout={500 + index * 200}>
                <Card
                  sx={{
                    height: "100%",
                    minHeight: "320px",
                    bgcolor: modoOscuro ? "#2C2C2C" : "#FFFFFF",
                    borderRadius: 4,
                    transition: "transform 0.4s ease, box-shadow 0.4s ease",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: modoOscuro
                        ? "0 8px 20px rgba(212, 175, 55, 0.3)"
                        : "0 8px 20px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      textAlign: "center",
                      py: 4,
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Avatar
                        src={integrante.imagen}
                        alt={integrante.nombre}
                        sx={{
                          width: 120,
                          height: 120,
                          mx: "auto",
                          mb: 2,
                          border: "3px solid #D4AF37",
                          transition: "transform 0.4s ease",
                          "&:hover": {
                            transform: "scale(1.05) rotate(-2deg)",
                          },
                        }}
                      />
                      <Typography
                        variant="h6"
                        component="h5"
                        fontWeight="600"
                        gutterBottom
                        sx={{ color: "text.primary" }}
                      >
                        {integrante.nombre}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mb: 2,
                          color: "#D4AF37",
                        }}
                      >
                        {integrante.rol}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                    >
                      <IconButton
                        href={integrante.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: modoOscuro ? "#FFFFFF" : "#000000",
                          transition: "transform 0.4s ease, color 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.2)",
                            color: "#D4AF37",
                          },
                        }}
                      >
                        <GitHub fontSize="large" />
                      </IconButton>
                      <IconButton
                        href={integrante.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: "#0077B5",
                          transition: "transform 0.4s ease, color 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.2)",
                            color: "#D4AF37",
                          },
                        }}
                      >
                        <LinkedIn fontSize="large" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
