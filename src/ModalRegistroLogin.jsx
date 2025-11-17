import React, { useState } from "react";
import clientaxios from "../api/clientaxios"; // Ajusta la ruta según tu estructura

function RegistroLogin() {
  const [modo, setModo] = useState("login"); // "registro" o "login"
  const [formData, setFormData] = useState({ nombre: "", email: "", password: "" });
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Registro ---
  const handleRegistro = async (e) => {
    e.preventDefault();
    const { nombre, email, password } = formData;

    if (!nombre || !email || !password) {
      setMensaje("Por favor completa todos los campos.");
      return;
    }

    try {
      setCargando(true);
      const { data } = await clientaxios.post("/usuarios/registro", {
        nombre,
        email,
        password,
      });
      setMensaje(data.msg || "Usuario registrado correctamente");
      setFormData({ nombre: "", email: "", password: "" });
    } catch (error) {
      setMensaje(error.response?.data?.msg || "Error al registrar usuario");
    } finally {
      setCargando(false);
    }
  };

  // --- Login ---
  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setMensaje("Por favor completa todos los campos.");
      return;
    }

    try {
      setCargando(true);
      const { data } = await clientaxios.post("/usuarios/login", { email, password });
      setMensaje(`Bienvenido, ${data.nombre || "usuario"}`);
      setFormData({ nombre: "", email: "", password: "" });
      // Aquí podrías emitir un evento o redirigir al dashboard si el backend devuelve un token
      // Ejemplo: navigate("/dashboard") o props.onLogin(data.token);
    } catch (error) {
      setMensaje(error.response?.data?.msg || "Correo o contraseña incorrectos.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      {modo === "registro" ? (
        <>
          <h2 style={{ textAlign: "center" }}>Registro de Usuario</h2>
          <form
            onSubmit={handleRegistro}
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <input
              type="text"
              name="nombre"
              placeholder="Nombre completo"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              disabled={cargando}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {cargando ? "Procesando..." : "Registrarse"}
            </button>
          </form>

          <p style={{ marginTop: "15px", textAlign: "center", color: "#333" }}>{mensaje}</p>

          <div style={{ textAlign: "center", marginTop: "10px" }}>
            ¿Ya tienes una cuenta?{" "}
            <a
              onClick={() => {
                setModo("login");
                setMensaje("");
              }}
              style={{ color: "#007bff", cursor: "pointer", textDecoration: "underline" }}
            >
              Inicia sesión aquí
            </a>
          </div>
        </>
      ) : (
        <>
          <h2 style={{ textAlign: "center" }}>Iniciar Sesión</h2>
          <form
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              disabled={cargando}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {cargando ? "Verificando..." : "Ingresar"}
            </button>
          </form>

          <p style={{ marginTop: "15px", textAlign: "center", color: "#333" }}>{mensaje}</p>

          <div style={{ textAlign: "center", marginTop: "10px" }}>
            ¿No tienes cuenta?{" "}
            <a
              onClick={() => {
                setModo("registro");
                setMensaje("");
              }}
              style={{ color: "#007bff", cursor: "pointer", textDecoration: "underline" }}
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
