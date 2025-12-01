import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  useTheme,
  alpha,
} from "@mui/material";
import PromocionBadge from "./PromocionBadge";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import {
  diasRestantes,
  formatearRangoFechas,
} from "../../utils/promocionUtils";

const PromocionCard = ({ promocion, onVerProductos }) => {
  const theme = useTheme();

  const dias = diasRestantes(promocion);

  const handleVerProductos = () => {
    if (onVerProductos) {
      onVerProductos(promocion);
    }
  };

  return (
    <Card
      sx={{
        height: "100%",
        minHeight: 350,
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
        border: `1px solid ${theme.palette.divider}`,
        transition: "all 0.3s ease",
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.02
        )} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
        },
      }}
    >
      {/* Badge de descuento flotante */}
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
          zIndex: 2,
        }}
      >
        <PromocionBadge descuento={promocion.descuento} size="large" />
      </Box>

      {/* Header con gradiente */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          p: 3,
          minHeight: 120,
          color: "white",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            mb: 1,
            position: "relative",
            fontFamily: "Orbitron, sans-serif",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
          }}
        >
          {promocion.titulo}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            opacity: 0.95,
            position: "relative",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {promocion.descripcion}
        </Typography>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Información de tiempo */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.warning.main, 0.1),
            border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
          }}
        >
          <AccessTimeIcon
            sx={{ color: theme.palette.warning.main, fontSize: 20 }}
          />
          <Box>
            <Typography variant="caption" display="block" fontWeight={600}>
              {dias > 0 ? `¡Quedan ${dias} días!` : "¡Último día!"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatearRangoFechas(promocion.fechaInicio, promocion.fechaFin)}
            </Typography>
          </Box>
        </Box>

        {/* Productos en promoción (Solo texto) */}
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1.5,
            }}
          >
            <ShoppingBagIcon
              sx={{ color: theme.palette.primary.main, fontSize: 18 }}
            />
            <Typography variant="subtitle2" fontWeight={700}>
              {promocion.productos?.length || 0}{" "}
              {promocion.productos?.length === 1 ? "Producto" : "Productos"} en
              oferta
            </Typography>
          </Box>
        </Box>
      </CardContent>

      {/* Footer con botón */}
      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleVerProductos}
          sx={{
            py: 1.5,
            fontWeight: 700,
            borderRadius: 2,
            textTransform: "none",
            fontSize: "1rem",
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            "&:hover": {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
              transform: "translateY(-2px)",
              boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
            },
          }}
        >
          Ver productos en oferta
        </Button>
      </Box>
    </Card>
  );
};

export default PromocionCard;
