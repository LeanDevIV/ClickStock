import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import RegistroForm from "./RegistroForm";
import LoginForm from "./LoginForm";
import "./AuthModal.css";

function AuthModal({ show, handleClose }) {
  const [modo, setModo] = useState(0); // 0 = login, 1 = registro
  const [mensaje, setMensaje] = useState("");

  const handleTabChange = (event, newValue) => {
    setModo(newValue);
    setMensaje("");
  };

  const handleSuccess = () => {
    setMensaje("✔ Operación exitosa!");
    setTimeout(() => {
      handleClose();
    }, 700);
  };

  return (
    <Dialog
      open={!!show}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Mi Cuenta
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs value={modo} onChange={handleTabChange} centered>
            <Tab label="Iniciar Sesión" />
            <Tab label="Registrarse" />
          </Tabs>
        </Box>

        {mensaje && (
          <Box
            sx={{
              mb: 2,
              p: 2,
              bgcolor: "success.light",
              borderRadius: 1,
              textAlign: "center",
            }}
          >
            {mensaje}
          </Box>
        )}

        <Box>
          {modo === 0 ? (
            <LoginForm setMensaje={setMensaje} onSuccess={handleSuccess} />
          ) : (
            <RegistroForm setMensaje={setMensaje} onSuccess={handleSuccess} />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default AuthModal;
