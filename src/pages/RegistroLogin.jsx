import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { PersonFill, EnvelopeFill, KeyFill } from "react-bootstrap-icons";
import { useStore } from "../hooks/useStore";
import { registroService } from "../services/RegistroService";

function RegistroLogin({ show, onHide }) {
  const [modo, setModo] = useState("login");
  React.useEffect(() => {
  if (show) setModo("login");
}, [show]);
  const [formData, setFormData] = useState({
    nombre: "",
    emailUsuario: "",
    contrasenia: "",
    confirmarContrasenia: "",
  });

  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, emailUsuario, contrasenia, confirmarContrasenia } =
      formData;

    if (!nombre || !emailUsuario || !contrasenia || !confirmarContrasenia) {
      setMensaje("Por favor completa todos los campos.");
      return;
    }

    if (contrasenia !== confirmarContrasenia) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }

    try {
      setCargando(true);
      const data = await registroService({
        nombre,
        emailUsuario,
        contrasenia,
      });

      setMensaje(data.msg || "Registro exitoso");

      if (data.usuario || data.token) {
        useStore.getState().setUser(data.usuario, data.token);
      }

      // Limpiar
      setFormData({
        nombre: "",
        emailUsuario: "",
        contrasenia: "",
        confirmarContrasenia: "",
      });
    } catch (error) {
      setMensaje(error.message || "Error en el registro.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Nombre completo</Form.Label>
        <div className="input-group">
          <span className="input-group-text">
            <PersonFill />
          </span>
          <Form.Control
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
      </Form.Group>

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

      <Form.Group className="mb-3">
        <Form.Label>Confirmar contraseña</Form.Label>
        <div className="input-group">
          <span className="input-group-text">
            <KeyFill />
          </span>
          <Form.Control
            type="password"
            name="confirmarContrasenia"
            value={formData.confirmarContrasenia}
            onChange={handleChange}
            required
          />
        </div>
      </Form.Group>

      <div className="d-grid gap-2">
        <Button variant="primary" type="submit" disabled={cargando}>
          {cargando ? "Procesando..." : "Registrarse"}
        </Button>
      </div>
    </Form>
  );
}

export default RegistroForm;
