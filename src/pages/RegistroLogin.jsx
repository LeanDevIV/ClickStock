import React, { useState } from "react";
import "./RegistroLogin.css";
import { useStore } from "../hooks/useStore";
import { registroService } from "../services/RegistroService";
import { loginService } from "../services/LoginService";

function RegistroLogin() {
  const [modo, setModo] = useState("registro");
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
      setMensaje(data.msg || `Bienvenido, ${data.nombre || "usuario"}`);
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
    <div className="registro-login-container">
      {modo === "registro" ? (
        <>
          <h2 className="registro-login-titulo">Registro de Usuario</h2>
          <form className="registro-login-form" onSubmit={handleRegistro}>
            <input
              type="text"
              name="nombreUsuario"
              placeholder="Nombre completo"
              value={formData.nombreUsuario}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="emailUsuario"
              placeholder="Correo electrónico"
              value={formData.emailUsuario}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="contrasenia"
              placeholder="Contraseña"
              value={formData.contrasenia}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              disabled={cargando}
              className="registro-login-boton"
            >
              {cargando ? "Procesando..." : "Registrarse"}
            </button>
          </form>

          <p className="registro-login-mensaje">{mensaje}</p>

          <div className="registro-login-cambio">
            ¿Ya tienes una cuenta?{" "}
            <a
              onClick={() => {
                setModo("login");
                setMensaje("");
              }}
            >
              Inicia sesión aquí
            </a>
          </div>
        </>
      ) : (
        <>
          <h2 className="registro-login-titulo">Iniciar Sesión</h2>
          <form className="registro-login-form" onSubmit={handleLogin}>
            <input
              type="email"
              name="emailUsuario"
              placeholder="Correo electrónico"
              value={formData.emailUsuario}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="contrasenia"
              placeholder="Contraseña"
              value={formData.contrasenia}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              disabled={cargando}
              className="registro-login-boton"
            >
              {cargando ? "Verificando..." : "Ingresar"}
            </button>
          </form>

          <p className="registro-login-mensaje">{mensaje}</p>

          <div className="registro-login-cambio">
            ¿No tienes cuenta?{" "}
            <a
              onClick={() => {
                setModo("registro");
                setMensaje("");
              }}
            >
              Regístrate aquí
            </a>
          </div>
        </>
      )}
    </div>
  );
}

export default RegistroLogin;
