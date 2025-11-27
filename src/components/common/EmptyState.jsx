import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import { Inbox } from "@mui/icons-material";

/**
 * Componente reutilizable para mostrar estados vacíos
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Ícono a mostrar (componente MUI Icon)
 * @param {string} props.title - Título del estado vacío
 * @param {string} props.message - Mensaje descriptivo
 * @param {string} props.actionLabel - Texto del botón de acción (opcional)
 * @param {Function} props.onAction - Función a ejecutar al hacer clic en el botón (opcional)
 * @param {Object} props.sx - Estilos adicionales para el contenedor (opcional)
 */
const EmptyState = ({
  icon: IconComponent = Inbox,
  title = "No hay datos disponibles",
  message = "Aún no hay información para mostrar aquí",
  actionLabel,
  onAction,
  sx = {},
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        textAlign: "center",
        py: 8,
        px: 4,
        backgroundColor: theme.palette.background.default,
        borderRadius: 3,
        boxShadow: theme.shadows[1],
        ...sx,
      }}
    >
      <CardContent>
        {/* Ícono */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 120,
            height: 120,
            borderRadius: "50%",
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.03)",
            mb: 3,
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(0, 0, 0, 0.05)",
            },
          }}
        >
          <IconComponent
            sx={{
              fontSize: 64,
              color: theme.palette.text.secondary,
              opacity: 0.5,
            }}
          />
        </Box>

        {/* Título */}
        <Typography
          variant="h5"
          component="h3"
          color="text.primary"
          gutterBottom
          sx={{ fontWeight: 600, mb: 1 }}
        >
          {title}
        </Typography>

        {/* Mensaje */}
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: actionLabel && onAction ? 3 : 0,
            opacity: 0.8,
            maxWidth: 500,
            mx: "auto",
          }}
        >
          {message}
        </Typography>

        {/* Botón de acción (opcional) */}
        {actionLabel && onAction && (
          <Button
            variant="contained"
            size="large"
            onClick={onAction}
            sx={{
              mt: 2,
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              boxShadow: `0 4px 15px ${theme.palette.primary.main}30`,
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: `0 6px 20px ${theme.palette.primary.main}50`,
                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
              },
              transition: "all 0.3s ease",
            }}
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyState;
