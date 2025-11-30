import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { Lock } from "@mui/icons-material";
import workingGif from "./assets/working-on.gif";

export default function WorkingOn({ onLogin }) {
  const [openAuth, setOpenAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (password === "ClickStock") {
      localStorage.setItem("site_access_granted", "true");
      setOpenAuth(false);
      if (onLogin) onLogin();
    } else {
      setError("Contraseña incorrecta");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        p: 2,
      }}
    >
      <Container maxWidth="md">
        <Box
          component="img"
          src={workingGif}
          alt="En construcción"
          sx={{
            maxWidth: "100%",
            maxHeight: "70vh",
            objectFit: "contain",
            borderRadius: 4,
            boxShadow: 3,
            mb: 3,
          }}
        />
        <Typography variant="h6" color="text.secondary">
          Estamos trabajando para traerte algo genial
        </Typography>

        <Box position="fixed" bottom={16} right={16}>
          <IconButton
            onClick={() => setOpenAuth(true)}
            color="primary"
            size="small"
            sx={{ opacity: 0.5, "&:hover": { opacity: 1 } }}
          >
            <Lock fontSize="small" />
          </IconButton>
        </Box>
      </Container>

      <Dialog open={openAuth} onClose={() => setOpenAuth(false)}>
        <DialogTitle>Acceso Administrativo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Clave de Acceso"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            error={!!error}
            helperText={error}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAuth(false)}>Cancelar</Button>
          <Button onClick={handleLogin} variant="contained">
            Entrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
