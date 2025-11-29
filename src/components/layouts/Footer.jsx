import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Link,
} from "@mui/material";
import { Instagram, Facebook, X } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const FooterContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  backgroundColor: "#000",
  color: "#fff",
  paddingTop: "40px",
  paddingBottom: "40px",
  marginTop: theme.spacing(10),
}));

const NeonWave = () => (
  <Box
    sx={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      overflow: "hidden",
      lineHeight: 0,
      transform: "translateY(-99%)",
      zIndex: 1,
    }}
  >
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      style={{
        display: "block",
        width: "100%",
        height: "100px",
      }}
    >
      <defs>
        <linearGradient
          id="neonGradient"
          gradientUnits="userSpaceOnUse"
          x1="-100%"
          y1="0"
          x2="0%"
          y2="0"
        >
          <stop offset="0%" stopColor="transparent" />
          <stop offset="20%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#FFD700" />
          <stop offset="80%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="transparent" />

          <animate
            attributeName="x1"
            from="-100%"
            to="100%"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="x2"
            from="0%"
            to="200%"
            dur="3s"
            repeatCount="indefinite"
          />
        </linearGradient>

        <filter id="glow">
          <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path d="M0,60 C320,140 880,-20 1200,60 L1200,120 L0,120 Z" fill="#000" />

      <path
        d="M0,60 C320,140 880,-20 1200,60"
        fill="none"
        stroke="url(#neonGradient)"
        strokeWidth="4"
        filter="url(#glow)"
      />
    </svg>
  </Box>
);

const Footer = () => {
  return (
    <FooterContainer component="footer">
      <NeonWave />

      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 4 }} justifyContent="center">
          <Grid xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: "#D4AF37",
                fontWeight: 600,
                mb: 3,
                textAlign: "left",
              }}
            >
              Nuestras redes
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-start",
              }}
            >
              <IconButton
                href="/error404"
                sx={{
                  color: "#fff",
                  background:
                    "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                  borderRadius: "12px",
                  width: 48,
                  height: 48,
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.2)",
                  },
                }}
              >
                <Instagram fontSize="medium" />
              </IconButton>
              <IconButton
                href="/error404"
                sx={{
                  color: "#fff",
                  bgcolor: "#1877F2",
                  borderRadius: "12px",
                  width: 48,
                  height: 48,
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.2)",
                    bgcolor: "#1877F2",
                  },
                }}
              >
                <Facebook fontSize="medium" />
              </IconButton>
              <IconButton
                href="/error404"
                sx={{
                  color: "#000",
                  bgcolor: "#fff",
                  borderRadius: "12px",
                  width: 48,
                  height: 48,
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.2)",
                  },
                }}
              >
                <X fontSize="medium" />
              </IconButton>
            </Box>
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: "#D4AF37",
                fontWeight: 600,
                mb: 3,
                textAlign: "left",
              }}
            >
              Acerca de nosotros
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                alignItems: "flex-start",
              }}
            >
              <Link
                href="/nosotros"
                underline="none"
                sx={{
                  color: "#F5F5F5",
                  fontSize: "0.95rem",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#D4AF37",
                    paddingLeft: "6px",
                  },
                }}
              >
                Quiénes somos
              </Link>
              <Link
                href="/error404"
                underline="none"
                sx={{
                  color: "#F5F5F5",
                  fontSize: "0.95rem",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#D4AF37",
                    paddingLeft: "6px",
                  },
                }}
              >
                Política de privacidad
              </Link>
              <Link
                href="/error404"
                underline="none"
                sx={{
                  color: "#F5F5F5",
                  fontSize: "0.95rem",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#D4AF37",
                    paddingLeft: "6px",
                  },
                }}
              >
                Términos y condiciones
              </Link>
            </Box>
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: "#D4AF37",
                fontWeight: 600,
                mb: 3,
                textAlign: "left",
              }}
            >
            Links útiles
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                alignItems: "flex-start",
              }}
            >
              <Link
                href="/"
                underline="none"
                sx={{
                  color: "#F5F5F5",
                  fontSize: "0.95rem",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#D4AF37",
                    paddingLeft: "6px",
                  },
                }}
              >
                Inicio
              </Link>

              <Link
                href="/contacto"
                underline="none"
                sx={{
                  color: "#F5F5F5",
                  fontSize: "0.95rem",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#D4AF37",
                    paddingLeft: "6px",
                  },
                }}
              >
                Contacto
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            height: "2px",
            background:
              "linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)",
            my: 4,
            opacity: 0.6,
          }}
        />

        <Typography
          align="center"
          sx={{
            color: "rgba(245, 245, 245, 0.7)",
            fontSize: "0.9rem",
          }}
        >
          © {new Date().getFullYear()} BugBusters. Todos los derechos reservados.
        </Typography>
      </Container>
    </FooterContainer>
  );
};

export default Footer;