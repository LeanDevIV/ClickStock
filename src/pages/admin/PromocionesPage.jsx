import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Divider,
  Collapse,
  Paper,
  useTheme,
  alpha,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/List";
import PromocionesForm from "../../components/forms/PromocionesForm";
import TablaPromociones from "../../components/tables/TablaPromociones";

import { usePageTitle } from "../../hooks/usePageTitle";

const PromocionesPage = () => {
  usePageTitle("Admin - Promociones");

  const theme = useTheme();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [promocionEditar, setPromocionEditar] = useState(null);
  const [recargarTabla, setRecargarTabla] = useState(0);

  const handleNuevaPromocion = () => {
    setPromocionEditar(null);
    setMostrarFormulario(true);
  };

  const handleEditarPromocion = (promocion) => {
    setPromocionEditar(promocion);
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSuccess = () => {
    setMostrarFormulario(false);
    setPromocionEditar(null);
    setRecargarTabla((prev) => prev + 1);
  };

  const handleCancelar = () => {
    setMostrarFormulario(false);
    setPromocionEditar(null);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          gutterBottom
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Gestión de Promociones
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Crea y administra las promociones activas en la tienda
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant={mostrarFormulario ? "outlined" : "contained"}
            startIcon={mostrarFormulario ? <ListIcon /> : <AddIcon />}
            onClick={
              mostrarFormulario
                ? () => setMostrarFormulario(false)
                : handleNuevaPromocion
            }
          >
            {mostrarFormulario ? "Ver Lista" : "Nueva Promoción"}
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Formulario colapsable */}
      <Collapse in={mostrarFormulario}>
        <Paper
          sx={{
            mb: 4,
            p: 2,
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            background: alpha(theme.palette.primary.main, 0.02),
          }}
        >
          <PromocionesForm
            promocionEditar={promocionEditar}
            onSuccess={handleSuccess}
            onCancel={handleCancelar}
          />
        </Paper>
      </Collapse>

      {/* Tabla de promociones */}
      {!mostrarFormulario && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            📋 Promociones Existentes
          </Typography>
          <TablaPromociones
            key={recargarTabla}
            onEdit={handleEditarPromocion}
          />
        </Box>
      )}
    </Container>
  );
};

export default PromocionesPage;
