import React, { useState, useRef, useEffect } from "react";
import { 
  Button, 
  Form, 
  InputGroup, 
  Card, 
  Badge,
  Spinner,
  Container
} from "react-bootstrap";
import { BsChatDots, BsX, BsSend, BsPerson, BsRobot } from "react-icons/bs";
import axios from "axios";

// Configurar axios con base URL (ajusta según tu configuración)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

const FloatingChat = () => {
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
      setTimeout(() => inputRef.current?.focus(), 100);
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
      const errorMessage = error.response?.data?.error || 
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
      <Button
        onClick={toggleChat}
        className="shadow-lg"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
        }}
        variant={open ? "danger" : "primary"}
        size="lg"
      >
        {open ? <BsX size={24} /> : <BsChatDots size={24} />}
      </Button>

      {/* Panel de chat */}
      {open && (
        <Card
          className="shadow-lg"
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "380px",
            height: "500px",
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
            borderRadius: "15px",
            overflow: "hidden",
            border: "none",
          }}
        >
          {/* Header del chat */}
          <Card.Header
            style={{
              backgroundColor: "#0d6efd",
              color: "white",
              padding: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <BsRobot size={20} />
              <strong>Asistente Virtual</strong>
            </div>
            <Badge bg="light" text="dark">
              En línea
            </Badge>
          </Card.Header>

          {/* Área de mensajes */}
          <Card.Body
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "15px",
              backgroundColor: "#f8f9fa",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    maxWidth: "75%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                    alignItems: msg.sender === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginBottom: "4px",
                    }}
                  >
                    {msg.sender === "bot" ? (
                      <BsRobot size={14} color="#6c757d" />
                    ) : (
                      <BsPerson size={14} color="#0d6efd" />
                    )}
                    <small
                      style={{
                        color: "#6c757d",
                        fontSize: "11px",
                        fontWeight: "500",
                      }}
                    >
                      {msg.sender === "bot" ? "Asistente" : "Tú"}
                    </small>
                  </div>
                  <div
                    style={{
                      backgroundColor: msg.sender === "bot" ? "white" : "#0d6efd",
                      color: msg.sender === "bot" ? "#212529" : "white",
                      padding: "10px 14px",
                      borderRadius: msg.sender === "bot" 
                        ? "18px 18px 18px 4px" 
                        : "18px 18px 4px 18px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      wordWrap: "break-word",
                      lineHeight: "1.4",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Indicador de carga */}
            {loading && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <BsRobot size={14} color="#6c757d" />
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "10px 14px",
                    borderRadius: "18px 18px 18px 4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Spinner animation="border" size="sm" variant="primary" />
                  <span style={{ fontSize: "12px", color: "#6c757d" }}>
                    Escribiendo...
                  </span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </Card.Body>

          {/* Input area */}
          <Card.Footer
            style={{
              padding: "15px",
              borderTop: "1px solid #dee2e6",
              backgroundColor: "white",
            }}
          >
            <InputGroup>
              <Form.Control
                ref={inputRef}
                placeholder="Escribe tu mensaje..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                style={{
                  borderRadius: "20px 0 0 20px",
                  border: "1px solid #dee2e6",
                }}
              />
              <Button
                variant="primary"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{
                  borderRadius: "0 20px 20px 0",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 20px",
                }}
              >
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <BsSend size={18} />
                )}
              </Button>
            </InputGroup>
            <small
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "8px",
                color: "#6c757d",
                fontSize: "11px",
              }}
            >
              Presiona Enter para enviar
            </small>
          </Card.Footer>
        </Card>
      )}
    </>
  );
};

export default FloatingChat;
