import React from "react";
import { Box, Button, useTheme } from "@mui/material";
import {
  Inventory as ProductosIcon,
  People as UsuariosIcon,
  ShoppingCart as PedidosIcon,
  Support as SoporteIcon,
  RateReview as ReseñasIcon,
  LocalOffer as PromocionesIcon,
} from "@mui/icons-material";
import { MENU_ITEMS, THEME } from "../../config/adminConfig";
import Bsod from "../common/Bsod";

const iconMap = {
  Productos: ProductosIcon,
  Usuarios: UsuariosIcon,
  Pedidos: PedidosIcon,
  Soporte: SoporteIcon,
  Reseñas: ReseñasIcon,
  Promociones: PromocionesIcon,
};

export const AdminSidebar = ({
  selectedSection,
  onSelectSection,
  isMobile,
}) => {
  const muiTheme = useTheme();
  const primary = muiTheme.palette.primary.main;
  const contrast =
    muiTheme.palette.primary.contrastText || muiTheme.palette.text.primary;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        p: 2,
        borderRight: isMobile ? "none" : `2px solid ${primary}`,
        minWidth: isMobile ? "100%" : 200,
        width: isMobile ? "100%" : 200,
        justifyContent: "flex-start",
        alignItems: "stretch",
        backgroundColor: "transparent",
        overflowY: "auto",
        maxHeight: isMobile ? "100%" : "calc(100vh - 200px)",
      }}
    >
      {MENU_ITEMS.map((item) => {
        const IconComponent = iconMap[item.section];
        const isSelected = selectedSection === item.section;

        const buttonContent = (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconComponent
              sx={{ fontSize: 20, color: isSelected ? contrast : primary }}
            />
            <Box component="span">{item.titulo}</Box>
          </Box>
        );

        return (
          <Button
            key={item.section}
            onClick={() => onSelectSection(item.section)}
            variant={isSelected ? "contained" : "text"}
            sx={{
              bgcolor: isSelected ? primary : "transparent",
              color: isSelected ? contrast : primary,
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "0.9rem",
              padding: "10px 12px",
              width: "100%",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              "&:hover": {
                transform: "scale(1.02)",
                bgcolor: isSelected ? primary : "rgba(255, 255, 255, 0.05)",
              },
            }}
          >
            {buttonContent}
          </Button>
        );
      })}
      <Bsod variant="outlined" size="medium" style={{ margin: "10px" }} />
    </Box>
  );
};
