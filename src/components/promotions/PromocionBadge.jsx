import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

const PromocionBadge = ({ descuento, size = "medium" }) => {
  const theme = useTheme();

  const sizes = {
    small: {
      px: 1,
      py: 0.5,
      fontSize: "0.7rem",
      iconSize: 12,
    },
    medium: {
      px: 1.5,
      py: 0.75,
      fontSize: "0.85rem",
      iconSize: 14,
    },
    large: {
      px: 2,
      py: 1,
      fontSize: "1rem",
      iconSize: 16,
    },
  };

  const currentSize = sizes[size] || sizes.medium;

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        px: currentSize.px,
        py: currentSize.py,
        borderRadius: 50,
        background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.warning.main} 100%)`,
        color: "white",
        fontWeight: 800,
        fontSize: currentSize.fontSize,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        boxShadow: "0 2px 8px rgba(244, 67, 54, 0.4)",
        animation: "pulse 2s ease-in-out infinite",
        "@keyframes pulse": {
          "0%, 100%": {
            transform: "scale(1)",
          },
          "50%": {
            transform: "scale(1.05)",
          },
        },
      }}
    >
      <LocalOfferIcon sx={{ fontSize: currentSize.iconSize }} />
      <Typography
        component="span"
        sx={{
          fontSize: "inherit",
          fontWeight: "inherit",
          lineHeight: 1,
        }}
      >
        {descuento}% OFF
      </Typography>
    </Box>
  );
};

export default PromocionBadge;
