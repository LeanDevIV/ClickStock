import { Box, Typography, Button } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import { Link } from "react-router-dom";

export default function PagoFallido() {
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
      <ErrorIcon sx={{ fontSize: 80, color: "error.main" }} />

      <Typography variant="h4" sx={{ mt: 2, fontWeight: "bold" }}>
        El pago no pudo completarse
      </Typography>

      <Typography variant="body1" sx={{ mt: 1, maxWidth: 400 }}>
        Hubo un problema al procesar tu pago. Podés intentar nuevamente.
      </Typography>

      <Button
        variant="contained"
        component={Link}
        to="/carrito"
        sx={{ mt: 3 }}
      >
        Volver al carrito
      </Button>
    </Box>
  );
}
