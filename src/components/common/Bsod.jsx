import React from "react";
import { Button } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

/**
 * Componente Easter Egg - Simula una pantalla azul de la muerte (BSOD)
 * ⚠️ ADVERTENCIA: Este componente es solo para diversión/easter egg
 * Reemplaza todo el contenido de la página con una pantalla azul
 */
const Bsod = ({ variant = "contained", size = "small", style = {} }) => {
  const triggerBSOD = () => {
    // 1. Intentar pantalla completa para más realismo
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log("No se pudo activar pantalla completa:", err);
      });
    }

    // 2. Mostrar pantalla de "carga" primero
    setTimeout(() => {
      document.body.innerHTML = `
        <div id="loading-screen" style="background-color: #000; color: #0f0; font-family: 'Courier New', monospace; height: 100vh; padding: 50px; box-sizing: border-box; overflow: hidden;">
          <h1 style="font-size: 24px; margin-bottom: 30px;">SISTEMA DE ELIMINACIÓN AUTOMÁTICA</h1>
          <p style="font-size: 16px; margin-bottom: 20px;">Iniciando proceso de eliminación...</p>
          <div id="console-output" style="font-size: 14px; line-height: 1.8; margin-bottom: 30px;"></div>
          <div style="margin-top: 20px;">
            <p style="font-size: 14px; margin-bottom: 10px;">Progreso: <span id="progress-text">0</span>%</p>
            <div style="width: 100%; height: 30px; background-color: #333; border: 2px solid #0f0;">
              <div id="progress-bar" style="width: 0%; height: 100%; background-color: #0f0; transition: width 0.3s;"></div>
            </div>
          </div>
          <p id="warning" style="font-size: 12px; color: #ff0; margin-top: 30px; display: none;">⚠️ ADVERTENCIA: Este proceso no se puede detener</p>
        </div>
      `;

      const consoleOutput = document.getElementById("console-output");
      const progressBar = document.getElementById("progress-bar");
      const progressText = document.getElementById("progress-text");
      const warning = document.getElementById("warning");

      const messages = [
        "Conectando al servidor...",
        "Autenticación exitosa",
        "Escaneando base de datos...",
        "Encontrados 1,247 registros",
        "Iniciando eliminación de usuarios...",
        "Eliminando: admin@clickstock.com",
        "Eliminando: usuario1@test.com",
        "Eliminando: usuario2@test.com",
        "Eliminando productos...",
        "Eliminando categorías...",
        "Eliminando órdenes...",
        "Vaciando caché...",
        "Eliminando archivos del sistema...",
        "Sobrescribiendo datos...",
        "Proceso completado",
      ];

      let messageIndex = 0;
      let progress = 0;

      const interval = setInterval(() => {
        if (messageIndex < messages.length) {
          const p = document.createElement("p");
          p.textContent = `> ${messages[messageIndex]}`;
          p.style.marginBottom = "5px";
          consoleOutput.appendChild(p);
          consoleOutput.scrollTop = consoleOutput.scrollHeight;

          // Mostrar advertencia a mitad del proceso
          if (messageIndex === 7) {
            warning.style.display = "block";
          }

          messageIndex++;
          progress = Math.min(100, (messageIndex / messages.length) * 100);
          progressBar.style.width = `${progress}%`;
          progressText.textContent = Math.floor(progress);

          // Cuando llegue al 100%, mostrar el BSOD
          if (progress >= 100) {
            clearInterval(interval);
            setTimeout(showBSOD, 1000);
          }
        }
      }, 400); // Cada 400ms un nuevo mensaje
    }, 100);
  };

  const showBSOD = () => {
    // Mostrar la pantalla azul de la muerte
    document.body.innerHTML = `
      <div style="background-color: #0078D7; color: white; font-family: 'Segoe UI', sans-serif; height: 100vh; padding: 100px; box-sizing: border-box; cursor: none; overflow: hidden;">
        <h1 style="font-size: 100px; margin: 0;">:(</h1>
        <h2 style="font-size: 24px; margin-top: 20px;">Su PC ha tenido un problema y necesita reiniciarse.</h2>
        <p style="font-size: 18px; margin-top: 20px;">
          Solo estamos recopilando información sobre el error de que <strong>usted no debería haber presionado ese botón</strong>.
        </p>
        <br><br>
        <p style="font-size: 14px; margin-top: 40px;">CÓDIGO DE DETENCIÓN: USER_DELETED_EVERYTHING</p>
        <p style="font-size: 12px; margin-top: 20px; color: #ccc;">
          Para más información sobre este problema y posibles soluciones, visite 
          <span style="text-decoration: underline;">https://www.windows.com/stopcode</span>
        </p>
        <br><br>
        <p style="font-size: 12px; color: #aaa; margin-top: 60px;">
          Si llama a un profesional de soporte técnico, proporciónele esta información:<br>
          Código de detención: USER_DELETED_EVERYTHING
        </p>
        <p style="font-size: 10px; color: #252525ff; margin-top: 100px; position: absolute; bottom: 20px;">
          Presiona F5 para "reiniciar" 
        </p>
      </div>
    `;

    // Bloquear click derecho
    document.addEventListener("contextmenu", (event) => event.preventDefault());

    // Mensaje en consola
    console.log(
      "%c¡BSOD ACTIVADO! 💀",
      "color: #0078D7; font-size: 30px; font-weight: bold;"
    );
    console.log(
      "%cPresiona F5 para salir del BSOD",
      "color: white; background: #0078D7; padding: 10px; font-size: 14px;"
    );
  };

  return (
    <Button
      variant={variant}
      size={size}
      color="error"
      startIcon={<WarningIcon />}
      onClick={triggerBSOD}
      style={style}
      title="⚠️ No presiones esto a menos que quieras ver algo 'interesante'"
    >
      Borrar todo
    </Button>
  );
};

export default Bsod;
