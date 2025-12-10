import { Box, Typography, Button } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Link } from "react-router-dom";

export default function PagoPendiente() {
  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 3,
      }}
    >
      <AccessTimeIcon sx={{ fontSize: 80, color: "warning.main" }} />

      <Typography variant="h4" sx={{ mt: 2, fontWeight: "bold" }}>
        Pago pendiente de confirmación
      </Typography>

      <Typography variant="body1" sx={{ mt: 1, maxWidth: 400 }}>
        El pago está siendo validado por Mercado Pago. Te avisaremos cuando se
        complete.
      </Typography>

      <Button
        variant="outlined"
        component={Link}
        to="/mis-pedidos"
        sx={{ mt: 3 }}
      >
        Ver mis pedidos
      </Button>
    </Box>
  );
}
