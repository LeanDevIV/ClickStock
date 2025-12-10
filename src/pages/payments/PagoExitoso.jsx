import { Box, Typography, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Link } from "react-router-dom";

export default function PagoExitoso() {
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
      <CheckCircleIcon sx={{ fontSize: 80, color: "success.main" }} />

      <Typography variant="h4" sx={{ mt: 2, fontWeight: "bold" }}>
        ¡Pago realizado con éxito!
      </Typography>

      <Typography variant="body1" sx={{ mt: 1, maxWidth: 400 }}>
        Gracias por tu compra. Tu pago fue aprobado y estamos procesando tu
        pedido.
      </Typography>

      <Button
        variant="contained"
        component={Link}
        to="/mis-pedidos"
        sx={{ mt: 3 }}
      >
        Ver mis pedidos
      </Button>
    </Box>
  );
}
