import React from "react";
import {
  Container,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFound404() {
  const colors = {
    black: "#000000",
    whiteSmoke: "#F5F5F5",
    cornellRed: "#B91C1C",
    gold: "#D4AF37",
    onyx: "#404040",
  };

  return (
    <Box
      sx={{
        background: `linear-gradient(180deg, ${colors.black} 0%, ${colors.onyx} 100%)`,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        color: colors.whiteSmoke,
      }}
    >
      <Container maxWidth="md">
        <Card
          sx={{
            textAlign: "center",
            p: 5,
            backgroundColor: colors.whiteSmoke,
            border: `2px solid ${colors.gold}`,
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          <CardContent>
            <Typography
              variant="h1"
              sx={{
                fontWeight: "bold",
                mb: 3,
                color: colors.cornellRed,
                textShadow: `2px 2px ${colors.gold}`,
                fontSize: { xs: "4rem", md: "6rem" },
              }}
            >
              404
            </Typography>

            <Typography
              variant="h4"
              sx={{ fontWeight: 600, mb: 3, color: colors.onyx }}
            >
              Página no encontrada
            </Typography>

            <Typography variant="body1" sx={{ mb: 4, color: colors.onyx }}>
              Lo sentimos, no pudimos encontrar la página que buscas. Puede
              haber sido movida o ya no existe.
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Button
                component={Link}
                to="/"
                variant="contained"
                sx={{
                  backgroundColor: colors.cornellRed,
                  border: `1px solid ${colors.gold}`,
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: colors.gold,
                  },
                }}
              >
                Volver al inicio
              </Button>

              <Button
                component={Link}
                to="/productos"
                variant="outlined"
                sx={{
                  borderColor: colors.cornellRed,
                  color: colors.cornellRed,
                  backgroundColor: colors.whiteSmoke,
                  "&:hover": {
                    backgroundColor: colors.gold,
                    color: colors.black,
                  },
                }}
              >
                Ver productos
              </Button>
            </Box>

            <Box
              sx={{
                mt: 5,
                p: 3,
                borderRadius: 1,
                backgroundColor: colors.black,
                color: colors.whiteSmoke,
                border: `1px solid ${colors.gold}`,
              }}
            >
              <Typography
                variant="body1"
                sx={{ mb: 1, fontWeight: 600, color: colors.gold }}
              >
                ¿Buscás algo especial?
              </Typography>
              <Typography variant="body2" sx={{ color: colors.whiteSmoke }}>
                Explora nuestras categorías premium con ofertas exclusivas.
              </Typography>
            </Box>

            <Box sx={{ mt: 5 }}>
              <Box
                component="hr"
                sx={{ borderColor: colors.gold, opacity: 0.8 }}
              />
              <Typography variant="caption" sx={{ mt: 3, color: colors.onyx }}>
                © {new Date().getFullYear()} — Tienda Online | Inspirado en
                elegancia, urgencia y exclusividad.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
