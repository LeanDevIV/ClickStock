import axios from "axios";
import { useStore } from "../hooks/useStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Servicio para subir archivos al servidor
 * @param {File} archivo - Archivo a subir
 * @param {string} directorio - Directorio destino (ej: 'productos', 'usuarios')
 * @returns {Promise<string>} - URL del archivo subido
 */
export const subirArchivo = async (archivo, directorio = "productos") => {
  try {
    const formData = new FormData();
    formData.append("file", archivo);

    const token = useStore.getState().token || localStorage.getItem("token");

    const headers = {
      "Content-Type": "multipart/form-data",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.post(
      `${API_URL}/uploads/${directorio}`,
      formData,
      { headers }
    );

    return response.data.url;
  } catch (error) {
    console.error("Error al subir archivo:", error);
    throw new Error(
      error.response?.data?.error?.message ||
        error.response?.data?.error ||
        "Error al subir el archivo"
    );
  }
};

/**
 * Servicio para subir múltiples archivos
 * @param {File[]} archivos - Array de archivos a subir
 * @param {string} directorio - Directorio destino
 * @returns {Promise<string[]>} - Array de URLs de los archivos subidos
 */
export const subirMultiplesArchivos = async (
  archivos,
  directorio = "productos"
) => {
  try {
    const promesas = Array.from(archivos).map((archivo) =>
      subirArchivo(archivo, directorio)
    );
    const urls = await Promise.all(promesas);
    return urls;
  } catch (error) {
    console.error("Error al subir múltiples archivos:", error);
    throw error;
  }
};

export const uploadImage = subirArchivo;
