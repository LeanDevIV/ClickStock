import React, { useState } from "react";
import "./RegistroLogin.css";
import { useStore } from "../hooks/useStore";
import { registroService } from "../services/RegistroService";
import { loginService } from "../services/LoginService";
import { Modal, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { PersonFill, KeyFill, EnvelopeFill, ArrowLeftCircleFill } from 'react-bootstrap-icons';

function RegistroLogin({ show, onHide }) {
  const [modo, setModo] = useState("login");
  React.useEffect(() => {
  if (show) setModo("login");
}, [show]);
  const [formData, setFormData] = useState({
    nombreUsuario: "",
    emailUsuario: "",
    contrasenia: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    const { nombreUsuario, emailUsuario, contrasenia } = formData;
    if (!nombreUsuario || !emailUsuario || !contrasenia) {
      setMensaje("Por favor completa todos los campos.");
      return;
    }

    try {
      setCargando(true);
      const data = await registroService({
        nombreUsuario,
        emailUsuario,
        contrasenia,
      });
      setMensaje(
        data.msg || `Registro correcto. Bienvenido, ${data.nombre || "usuario"}`
      );
      setFormData({ nombreUsuario: "", emailUsuario: "", contrasenia: "" });
      // Si la respuesta incluye usuario/token, guardarlos en el store
      if (data.usuario || data.token) {
        useStore.getState().setUser(data.usuario, data.token);
      }
    } catch (error) {
      setMensaje(error.message || "Error en el registro.");
    } finally {
      setCargando(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { emailUsuario, contrasenia } = formData;
    if (!emailUsuario || !contrasenia) {
      setMensaje("Por favor completa todos los campos.");
      return;
    }

    try {
      setCargando(true);
      const data = await loginService({ emailUsuario, contrasenia });
      setMensaje(
        data.msg || `Bienvenido, ${data.usuario?.nombreUsuario || "usuario"}`
      );
      setFormData({ nombreUsuario: "", emailUsuario: "", contrasenia: "" });
      if (data.usuario || data.token) {
        useStore.getState().setUser(data.usuario, data.token);
      }
    } catch (error) {
      setMensaje(error.message || "Correo o contraseña incorrectos.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <Modal show={!!show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modo === "registro" ? "Registro de Usuario" : "Iniciar Sesión"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            {mensaje && (
              <Row className="mb-3">
                <Col>
                  <div className={`alert ${mensaje.includes("Error") ? "alert-danger" : "alert-success"}`}>
                    {mensaje}
                  </div>
                </Col>
              </Row>
            )}

            <Form onSubmit={modo === "registro" ? handleRegistro : handleLogin}>
              {modo === "registro" && (
                <Form.Group className="mb-3">
                  <Form.Label>Nombre completo</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <PersonFill />
                    </span>
                    <Form.Control
                      type="text"
                      name="nombreUsuario"
                      value={formData.nombreUsuario}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </Form.Group>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Correo electrónico</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <EnvelopeFill />
                  </span>
                  <Form.Control
                    type="email"
                    name="emailUsuario"
                    value={formData.emailUsuario}
                    onChange={handleChange}
                    required
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <div className="input-group">
                  <span className="input-group-text">
                    <KeyFill />
                  </span>
                  <Form.Control
                    type="password"
                    name="contrasenia"
                    value={formData.contrasenia}
                    onChange={handleChange}
                    required
                  />
                </div>
              </Form.Group>

              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={cargando}
                >
                  {cargando 
                    ? (modo === "registro" ? "Procesando..." : "Verificando...") 
                    : (modo === "registro" ? "Registrarse" : "Ingresar")}
                </Button>

                {modo === "login" && (
                  <Button 
                    variant="link" 
                    className="text-decoration-none"
                    onClick={(e) => {
                      e.preventDefault();
                      // Aquí iría la funcionalidad de recuperar contraseña
                    }}
                  >
                    ¿Olvidaste tu contraseña?
                  </Button>
                )}
              </div>
            </Form>

            <Row className="mt-3">
              <Col className="text-center">
                <Button
                  variant="link"
                  className="text-decoration-none"
                  onClick={() => {
                    setModo(modo === "registro" ? "login" : "registro");
                    setMensaje("");
                  }}
                >
                  <ArrowLeftCircleFill className="me-2" />
                  {modo === "registro" 
                    ? "¿Ya tienes una cuenta? Inicia sesión aquí"
                    : "¿No tienes cuenta? Regístrate aquí"}
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default RegistroLogin;
