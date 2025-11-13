import { useState } from "react";
export const useCompartir = (idProducto, nombreProducto) => {
  const [enlaceCopiado, setEnlaceCopiado] = useState(false);
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const generarEnlace = () => {
    const urlBase = window.location.origin;
    return `${urlBase}/producto/${idProducto}`;
  };
  const copiarEnlace = async () => {
    try {
      const enlace = generarEnlace();
      await navigator.clipboard.writeText(enlace);
      setEnlaceCopiado(true);
      setTimeout(() => {
        setEnlaceCopiado(false);
      }, 2000);
    } catch (error) {
      console.error("error al copiar:", error);
      copiarConFallBack(generarEnlace());
    }
  };
  const alternarOpciones = () => {
    setMostrarOpciones(!mostrarOpciones);
  };
  const copiarConFallBack = async (texto) => {
    return new Promise((resolve, reject) => {
      const areaTexto = document.createElement("textarea");
      areaTexto.value = texto;
      areaTexto.style.position = "fixed";
      areaTexto.style.left = "-999999px";
      document.body.appendChild(areaTexto);
      areaTexto.select();
      try {
        const exito = document.execCommand("copy");
        document.body.removeChild(areaTexto);
        exito ? resolve() : reject(new Error("Fallback failed"));
      } catch (err) {
        document.body.removeChild(areaTexto);
        reject(err);
      }
    });
  };

  return {
    enlaceCopiado,
    mostrarOpciones,
    generarEnlace,
    copiarEnlace,
    alternarOpciones,
  };
};
