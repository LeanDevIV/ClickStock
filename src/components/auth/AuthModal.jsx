import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Tabs,
  Tab,
  Button,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import RegistroForm from "./RegistroForm";
import LoginForm from "./LoginForm";
import { auth, googleProvider, githubProvider } from "../../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { socialLoginService } from "../../services/LoginService";
import { useStore } from "../../hooks/useStore";

function AuthModal({ show, handleClose }) {
  const [modo, setModo] = useState(0); // 0 = login, 1 = registro
  const [mensaje, setMensaje] = useState("");
  const [height, setHeight] = useState("auto");
  const contentRef = useRef(null);
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    if (!contentRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setHeight(entry.contentRect.height);
      }
    });
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, []);

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

  const handleSocialLogin = async (provider) => {
    try {
      setMensaje("");
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      const data = await socialLoginService(token);

      if (data.usuario || data.token) {
        setUser(data.usuario, data.token);
        handleSuccess();
      }
    } catch (error) {
      console.error("Error Social Login:", error);
      setMensaje(error.message || "Error al iniciar sesión");
    }
  };

  return (
    <Dialog
      open={!!show}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      sx={{
        "& .MuiDialog-container": {
          alignItems: "flex-start",
          pt: 10,
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "90vh",
          bgcolor: "#1e1e1e", // Dark background
          color: "#ffffff", // White text
          border: "1px solid #333",
        },
      }}
    >
      <DialogContent sx={{ p: 3, position: "relative" }}>
        {/* Close button in body */}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          size="small"
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
            zIndex: 1,
            "&:hover": { color: "#ffffff" },
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Tabs */}
        <Box
          sx={{ borderBottom: 1, borderColor: "rgba(255,255,255,0.1)", mb: 2 }}
        >
          <Tabs
            value={modo}
            onChange={handleTabChange}
            centered
            variant="fullWidth"
            sx={{
              minHeight: 40,
              "& .MuiTab-root": {
                color: "rgba(255,255,255,0.7)",
                "&.Mui-selected": { color: "#d32f2f" }, // Red selected text
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#d32f2f", // Red indicator
              },
            }}
          >
            <Tab label="Iniciar Sesión" sx={{ py: 1, minHeight: 40 }} />
            <Tab label="Registrarse" sx={{ py: 1, minHeight: 40 }} />
          </Tabs>
        </Box>

        {mensaje && (
          <Box
            sx={{
              mb: 2,
              p: 1,
              bgcolor: mensaje.includes("Error")
                ? "rgba(211, 47, 47, 0.2)"
                : "rgba(46, 125, 50, 0.2)",
              color: mensaje.includes("Error") ? "#ef5350" : "#66bb6a",
              borderRadius: 1,
              textAlign: "center",
              fontSize: "0.875rem",
            }}
          >
            {mensaje}
          </Box>
        )}

        {/* Content with smooth height transition */}
        <Box
          sx={{
            height: height,
            transition: "height 0.4s ease-in-out",
            overflow: "hidden",
          }}
        >
          <Box ref={contentRef}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                transition:
                  "opacity 0.4s ease-in-out, transform 0.4s ease-in-out",
                opacity: 1,
                transform: "translateY(0)",
                "@keyframes fadeIn": {
                  from: {
                    opacity: 0,
                    transform: "translateY(10px)",
                  },
                  to: {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                },
                animation: "fadeIn 0.4s ease-in-out",
                p: 0.5,
              }}
              key={modo}
            >
              {modo === 0 ? (
                <LoginForm setMensaje={setMensaje} onSuccess={handleSuccess} />
              ) : (
                <RegistroForm
                  setMensaje={setMensaje}
                  onSuccess={handleSuccess}
                />
              )}
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <Box
              sx={{ flex: 1, height: "1px", bgcolor: "rgba(255,255,255,0.1)" }}
            />
            <Box
              sx={{
                px: 2,
                color: "rgba(255,255,255,0.5)",
                typography: "caption",
              }}
            >
              O continuar con
            </Box>
            <Box
              sx={{ flex: 1, height: "1px", bgcolor: "rgba(255,255,255,0.1)" }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FcGoogle size={20} />}
              onClick={() => handleSocialLogin(googleProvider)}
              size="small"
              sx={{
                borderColor: "rgba(255,255,255,0.2)",
                color: "#ffffff",
                py: 0.8,
                "&:hover": {
                  borderColor: "#ffffff",
                  bgcolor: "rgba(255,255,255,0.05)",
                },
              }}
            >
              Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FaGithub size={20} />}
              onClick={() => handleSocialLogin(githubProvider)}
              size="small"
              sx={{
                borderColor: "rgba(255,255,255,0.2)",
                color: "#ffffff",
                py: 0.8,
                "&:hover": {
                  borderColor: "#ffffff",
                  bgcolor: "rgba(255,255,255,0.05)",
                },
              }}
            >
              GitHub
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default AuthModal;
