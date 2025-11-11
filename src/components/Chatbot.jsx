import React, { useState, useRef, useEffect } from "react";
import {
  Fab,
  Paper,
  Box,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Chip,
  CircularProgress,
  Slide,
  Fade,
  Zoom,
} from "@mui/material";
import {
  Close as CloseIcon,
  Send as SendIcon,
  Chat as ChatIcon,
  SmartToy as RobotIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import axios from "axios";

// Configurar axios con base URL (ajusta según tu configuración)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

import { useTheme } from "@mui/material/styles";

const FloatingChat = () => {
  const theme = useTheme();
  // Detectar modo oscuro desde el theme
  const modoOscuro = theme.palette.mode === "dark";
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "¡Hola! 👋 Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const toggleChat = () => {
    setOpen(!open);
    if (!open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  };

  const sendMessage = async () => {
    const messageText = input.trim();
    if (!messageText || loading) return;

    // Agregar mensaje del usuario
    const userMessage = { sender: "user", text: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.post("/api/chatbot", { message: messageText });
      const botMessage = response.data.reply;
      setMessages((prev) => [...prev, { sender: "bot", text: botMessage }]);
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Lo siento, hubo un error al conectarse con el asistente. Por favor, intenta de nuevo.";
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: errorMessage },
      ]);
    } finally {
      setLoading(false);
      // Enfocar el input después de enviar
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Scroll automático al final cuando hay nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Botón flotante */}
      <Zoom in={!open} timeout={300}>
        <Fab
          color="primary"
          aria-label="chat"
          onClick={toggleChat}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 64,
            height: 64,
            zIndex: 1300,
            boxShadow: modoOscuro
              ? "0 8px 24px rgba(0,0,0,0.7)"
              : "0 8px 24px rgba(0,0,0,0.15)",
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              boxShadow: modoOscuro
                ? "0 12px 32px rgba(0,0,0,0.9)"
                : "0 12px 32px rgba(0,0,0,0.2)",
              transform: "scale(1.05)",
              backgroundColor: theme.palette.primary.dark,
            },
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <ChatIcon sx={{ fontSize: 28 }} />
        </Fab>
      </Zoom>

      {/* Panel de chat */}
      <Slide direction="up" in={open} mountOnEnter unmountOnExit timeout={300}>
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            bottom: 100,
            right: 24,
            width: { xs: "calc(100vw - 48px)", sm: 420 },
            maxWidth: 420,
            height: { xs: "calc(100vh - 120px)", sm: 600 },
            maxHeight: 600,
            zIndex: 1300,
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: modoOscuro
              ? "0 16px 48px rgba(0,0,0,0.7)"
              : "0 16px 48px rgba(0,0,0,0.2)",
            backgroundColor: theme.palette.background.paper,
          }}
        >
          {/* Header del chat */}
          <Box
            sx={{
              background: modoOscuro
                ? `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`
                : `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
              color: theme.palette.primary.contrastText,
              padding: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: modoOscuro ? theme.palette.primary.main : "rgba(255,255,255,0.2)",
                  width: 40,
                  height: 40,
                  color: modoOscuro ? theme.palette.primary.contrastText : theme.palette.primary.main,
                }}
              >
                <RobotIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.1rem" }}>
                  Asistente Virtual
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9, fontSize: "0.75rem" }}>
                  En línea
                </Typography>
              </Box>
            </Box>
            <Chip
              label="En línea"
              size="small"
              sx={{
                bgcolor: modoOscuro ? theme.palette.primary.dark : "rgba(255,255,255,0.2)",
                color: modoOscuro ? theme.palette.primary.contrastText : "white",
                fontWeight: 500,
                display: { xs: "none", sm: "flex" },
              }}
            />
            <IconButton
              onClick={toggleChat}
              sx={{
                color: theme.palette.primary.contrastText,
                '&:hover': {
                  bgcolor: modoOscuro ? theme.palette.primary.main : "rgba(255,255,255,0.1)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Área de mensajes */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              padding: 2,
              backgroundColor: theme.palette.background.default,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: modoOscuro ? theme.palette.primary.dark : "#ccc",
                borderRadius: "3px",
                "&:hover": {
                  background: modoOscuro ? theme.palette.primary.main : "#aaa",
                },
              },
            }}
          >
            {messages.map((msg, idx) => (
              <Fade in key={idx} timeout={400}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "75%",
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.5,
                      alignItems: msg.sender === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      {msg.sender === "bot" ? (
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                          }}
                        >
                          <RobotIcon sx={{ fontSize: 14 }} />
                        </Avatar>
                      ) : (
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: theme.palette.secondary.main,
                            color: theme.palette.secondary.contrastText,
                          }}
                        >
                          <PersonIcon sx={{ fontSize: 14 }} />
                        </Avatar>
                      )}
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                        }}
                      >
                        {msg.sender === "bot" ? "Asistente" : "Tú"}
                      </Typography>
                    </Box>
                    <Paper
                      elevation={1}
                      sx={{
                        padding: 1.5,
                        borderRadius: msg.sender === "bot"
                          ? "20px 20px 20px 4px"
                          : "20px 20px 4px 20px",
                        backgroundColor: msg.sender === "bot"
                          ? theme.palette.background.paper
                          : theme.palette.primary.main,
                        color: msg.sender === "bot"
                          ? theme.palette.text.primary
                          : theme.palette.primary.contrastText,
                        wordWrap: "break-word",
                        lineHeight: 1.5,
                        maxWidth: "100%",
                        border: modoOscuro && msg.sender === "bot" ? `1px solid ${theme.palette.primary.dark}` : undefined,
                      }}
                    >
                      <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
                        {msg.text}
                      </Typography>
                    </Paper>
                  </Box>
                </Box>
              </Fade>
            ))}

            {/* Indicador de carga */}
            {loading && (
              <Fade in={loading}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      bgcolor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                    }}
                  >
                    <RobotIcon sx={{ fontSize: 14 }} />
                  </Avatar>
                  <Paper
                    elevation={1}
                    sx={{
                      padding: 1.5,
                      borderRadius: "20px 20px 20px 4px",
                      backgroundColor: theme.palette.background.paper,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      color: theme.palette.text.primary,
                    }}
                  >
                    <CircularProgress size={16} thickness={4} />
                    <Typography
                      variant="caption"
                      sx={{ color: theme.palette.text.secondary, fontSize: "0.8rem" }}
                    >
                      Escribiendo...
                    </Typography>
                  </Paper>
                </Box>
              </Fade>
            )}

            <div ref={messagesEndRef} />
          </Box>

          {/* Input area */}
          <Box
            sx={{
              padding: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
              <TextField
                inputRef={inputRef}
                fullWidth
                multiline
                maxRows={3}
                placeholder="Escribe tu mensaje..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    "& fieldset": {
                      borderColor: "transparent",
                    },
                    "&:hover fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: modoOscuro ? "#aaaaaa" : "#555555",
                    opacity: 1,
                  },
                }}
              />
              <IconButton
                color="primary"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  width: 40,
                  height: 40,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  },
                  '&.Mui-disabled': {
                    bgcolor: theme.palette.action.disabledBackground,
                    color: theme.palette.action.disabled,
                  },
                  transition: "all 0.2s",
                }}
              >
                {loading ? (
                  <CircularProgress size={20} sx={{ color: theme.palette.primary.contrastText }} />
                ) : (
                  <SendIcon fontSize="small" />
                )}
              </IconButton>
            </Box>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                textAlign: "center",
                mt: 1,
                color: theme.palette.text.secondary,
                fontSize: "0.7rem",
              }}
            >
              Presiona Enter para enviar
            </Typography>
          </Box>
        </Paper>
      </Slide>
    </>
  );
};

export default FloatingChat;
