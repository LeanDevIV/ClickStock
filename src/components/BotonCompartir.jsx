import React from "react";
import { useCompartir } from "../hooks/useCompartir";
import { QRCodeSVG } from "qrcode.react";
import "../../src/css/BotonCompartir.css";

const BotonCompartir = ({ idProducto, nombreProducto }) => {
  const {
    enlaceCopiado,
    mostrarQR,
    mostrarOpciones,
    generarEnlace,
    copiarEnlace,
    alternarOpciones,
    alternarQR,
  } = useCompartir(idProducto, nombreProducto);
  return (
    <div className="contenedor-compartir">
      <button
        onClick={copiarEnlace}
        className={`boton-principal ${enlaceCopiado ? "copiado" : ""}`}
        disabled={enlaceCopiado}
      >
        {enlaceCopiado ? (
          <>
            <span className="icono">✓</span>
            ¡Enlace copiado!
          </>
        ) : (
          <>
            <span className="icono">📤</span>
            Compartir producto
          </>
        )}
      </button>
      {enlaceCopiado && (
        <div className="mensaje-copiado">¡Enlace copiado al portapapeles!</div>
      )}
      <button onClick={alternarOpciones} className="boton-opciones">
        Más opciones ›
      </button>

      {mostrarOpciones && (
        <div className="opciones-adicionales">
          <button
            className="opcion"
            onClick={() =>
              window.open(
                `https://wa.me/?text=${encodeURIComponent(
                  `Mira este producto: ${nombreProducto} - ${generarEnlace()}`
                )}`,
                "_blank"
              )
            }
          >
            Compartir en WhatsApp
          </button>

          <button
            className="opcion"
            onClick={() =>
              window.open(
                `mailto:?subject=${encodeURIComponent(
                  nombreProducto
                )}&body=${encodeURIComponent(
                  `Mira este producto: ${generarEnlace()}`
                )}`
              )
            }
          >
            Compartir por Email
          </button>

          <button
            className="opcion"
            onClick={() =>
              alert(`Enlace para copiar manualmente: ${generarEnlace()}`)
            }
          >
            Mostrar enlace
          </button>
          <div className="contenedor-botones-opciones">
            <button onClick={alternarOpciones} className="boton-opciones">
              {mostrarOpciones ? "Ocultar opciones" : "Más opciones"} ›
            </button>

            <button onClick={alternarQR} className="boton-opciones">
              {mostrarQR ? "Ocultar QR" : "Mostrar QR"} ›
            </button>
          </div>
        </div>
      )}
      {mostrarQR && (
        <div className="contenedor-qr">
          <h4>Escanea el código QR</h4>
          <button
            className="boton-cerrar"
            onClick={alternarQR}
            title="Cerrar QR"
          >
            ×
          </button>
          <div className="qr-code">
            <QRCodeSVG 
              value={generarEnlace()}
              size={200}
              level="H"
            //   includeMargin={true}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
          <p className="texto-qr">
            Escanea con tu cámara para acceder al producto
          </p>
          <button
            className="boton-descargar-qr"
            onClick={() => {
              const svg = document.querySelector(".qr-code svg");
              const svgData = new XMLSerializer().serializeToString(svg);
              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d");
              const img = new Image();

              img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const pngFile = canvas.toDataURL("image/png");

                const downloadLink = document.createElement("a");
                downloadLink.download = `qr-${nombreProducto}.png`;
                downloadLink.href = pngFile;
                downloadLink.click();
              };

              img.src = "data:image/svg+xml;base64," + btoa(svgData);
            }}
          >
            📥 Descargar QR
          </button>
        </div>
      )}
    </div>
  );
};

export default BotonCompartir;
