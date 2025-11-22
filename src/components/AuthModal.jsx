import React, { useState } from "react";
import { Modal, Container, Row, Col } from "react-bootstrap";
import RegistroForm from "./RegistroForm";
import LoginForm from "./LoginForm";
import "./AuthModal.css"; // ⬅️ estilos manuales

function AuthModal({ show, onHide }) {
  const [modo, setModo] = useState("login");
  const [mensaje, setMensaje] = useState("");
  const [animacion, setAnimacion] = useState("slide-in");

  const cambiarModo = (nuevoModo) => {
    if (nuevoModo === modo) return;

    setAnimacion("slide-out");

    setTimeout(() => {
      setModo(nuevoModo);
      setMensaje("");
      setAnimacion("slide-in");
    }, 300);
  };

  const handleSuccess = () => {
    setMensaje("✔ Operación exitosa!");
    setTimeout(() => {
      onHide();
    }, 700);
  };

  return (
    <Modal show={!!show} onHide={onHide} dialogClassName="modal-dialog-top">
      <Modal.Header closeButton>
        <Modal.Title>Mi Cuenta</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Container>
          {/* === ❗ NUEVAS TABS PERSONALIZADAS === */}
          <div className="custom-tabs">
            <button
              className={`tab-btn ${modo === "login" ? "active" : ""}`}
              onClick={() => cambiarModo("login")}
            >
              Iniciar Sesión
            </button>

            <button
              className={`tab-btn ${modo === "registro" ? "active" : ""}`}
              onClick={() => cambiarModo("registro")}
            >
              Registrarse
            </button>

            <div
              className="tab-underline"
              style={{
                left: modo === "login" ? "0%" : "50%",
              }}
            />
          </div>

          {/* === ALERTA === */}
          {mensaje && (
            <Row>
              <Col>
                <div
                  className={`alert ${
                    mensaje.includes("Error") ? "alert-danger" : "alert-success"
                  }`}
                >
                  {mensaje}
                </div>
              </Col>
            </Row>
          )}

          {/* === FORMULARIO CON ANIMACIÓN === */}
          <div className={`form-slide ${animacion}`}>
            {modo === "login" ? (
              <LoginForm setMensaje={setMensaje} onSuccess={handleSuccess} />
            ) : (
              <RegistroForm setMensaje={setMensaje} onSuccess={handleSuccess} />
            )}
          </div>
        </Container>
      </Modal.Body>
    </Modal>
  );
}

export default AuthModal;
