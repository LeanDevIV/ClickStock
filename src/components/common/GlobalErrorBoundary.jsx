import { ErrorBoundary } from "react-error-boundary";
import { Box, Typography, Button } from "@mui/material";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        bgcolor: "#121212",
        color: "#fff",
        textAlign: "center",
        p: 3,
      }}
    >
      <Typography variant="h4" gutterBottom color="error">
        ¡Ups! Algo salió mal.
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, maxWidth: "600px" }}>
        Ha ocurrido un error inesperado. Por favor, intenta recargar la página.
      </Typography>
      {import.meta.env.MODE === "development" && (
        <Box
          component="pre"
          sx={{
            bgcolor: "#333",
            p: 2,
            borderRadius: 1,
            mb: 3,
            maxWidth: "800px",
            overflow: "auto",
            textAlign: "left",
          }}
        >
          {error.message}
        </Box>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={resetErrorBoundary}
        sx={{ bgcolor: "#d32f2f", "&:hover": { bgcolor: "#b71c1c" } }}
      >
        Intentar de nuevo
      </Button>
    </Box>
  );
}

export const GlobalErrorBoundary = ({ children }) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Resetear el estado de la aplicación si es necesario
        window.location.reload();
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
