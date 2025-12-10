import {
  Container,
  Typography,
  Avatar,
  IconButton,
  Box,
  Card,
  useTheme,
} from "@mui/material";
import { GitHub, LinkedIn } from "@mui/icons-material";
import { styled, keyframes } from "@mui/material/styles";
import { usePageTitle } from "../../hooks/usePageTitle";

const neonBorder = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
`;

const NeonCard = styled(Card)(({ theme }) => ({
  height: "100%",
  minHeight: "320px",
  width: "100%",
  position: "relative",
  overflow: "visible",
  backgroundColor: "transparent",
  borderRadius: "16px",
  transition: "transform 0.3s ease",
  boxShadow: "none",

  "&:hover": {
    transform: "translateY(-8px)",
    transition: "transform 0.3s ease",
    cursor: "pointer",
  },

  "&::before": {
    content: '""',
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: "18px",
    background: `linear-gradient(
      90deg,
      transparent 0%,
      ${theme.palette.primary.main} 20%,
      ${theme.palette.error.main} 40%,
      ${theme.palette.warning.main} 60%,
      ${theme.palette.primary.main} 80%,
      transparent 100%
    )`,
    backgroundSize: "200% 100%",
    animation: `${neonBorder} 4s linear infinite`,
    zIndex: 0,
    opacity: 0.8,
  },
}));

const CardSurface = styled(Box)(({ theme }) => ({
  position: "relative",
  zIndex: 1,
  height: "100%",
  width: "100%",

  backgroundColor: theme.palette.mode === "dark" ? "#121212" : "#ffffff",
  borderRadius: "16px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(4),
  boxShadow: theme.shadows[4],
}));

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
    imagen:
      "https://avatars.githubusercontent.com/u/209563219?s=400&u=5014b0af280a14903d42f113e74f572233278f5d&v=4",
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
  usePageTitle("Sobre Nosotros");
  const theme = useTheme();
  const modoOscuro = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: modoOscuro ? "rgba(0,0,0,0.7)" : "background.default",
        backdropFilter: modoOscuro ? "blur(4px)" : "none",
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

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(5, 1fr)",
            },
            gap: 3,
            width: "100%",
            alignItems: "stretch",
            justifyContent: "center",
            mb: 6,
          }}
        >
          {integrantes.map((integrante, index) => (
            <NeonCard key={index}>
              <CardSurface>
                <Box sx={{ textAlign: "center" }}>
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
                <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
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
              </CardSurface>
            </NeonCard>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
