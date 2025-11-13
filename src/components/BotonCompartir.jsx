import React from "react";
import { useCompartir } from "../hooks/useCompartir";
import "../../src/css/BotonCompartir.css"
const BotonCompartir = ({ idProducto, nombreProducto }) => {
  const {
    enlaceCopiado,
    mostrarOpciones,
    generarEnlace,
    copiarEnlace,
    alternarOpciones,
  } = useCompartir(idProducto, nombreProducto);
    return (
    <div className="contenedor-compartir">

      <button
        onClick={copiarEnlace}
        className={`boton-principal ${enlaceCopiado ? 'copiado' : ''}`}
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
        <div className="mensaje-copiado">
          ¡Enlace copiado al portapapeles!
        </div>
      )}

      <button 
        onClick={alternarOpciones}
        className="boton-opciones"
      >
        Más opciones ›
      </button>
      {mostrarOpciones && (
        <div className="opciones-adicionales">
          <button 
            className="opcion"
            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Mira este producto: ${nombreProducto} - ${generarEnlace()}`)}`, '_blank')}
          >
            Compartir en WhatsApp
          </button>
          
          <button 
            className="opcion"
            onClick={() => window.open(`mailto:?subject=${encodeURIComponent(nombreProducto)}&body=${encodeURIComponent(`Mira este producto: ${generarEnlace()}`)}`)}
          >
          Compartir por Email
          </button>
          
          <button 
            className="opcion"
            onClick={() => alert(`Enlace para copiar manualmente: ${generarEnlace()}`)}
          >
            Mostrar enlace
          </button>
        </div>
      )}
    </div>
  );
};

export default BotonCompartir;

