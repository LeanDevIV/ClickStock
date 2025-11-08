import { useState, useEffect, useCallback } from "react";
import { useStore } from "./useStore";
import {
  obtenerFavoritos,
  agregarFavorito,
  eliminarFavorito,
} from "../services/favoritosService";
import toast from "react-hot-toast";

/**
 * Hook personalizado para manejar la lógica de favoritos
 * @returns {Object} Estado y funciones para manejar favoritos
 */
export const useFavoritos = () => {
  const [favoritos, setFavoritos] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [cargando, setCargando] = useState(true);
  const { token } = useStore();

  /**
   * Carga los favoritos del usuario desde el servidor
   */
  const cargarFavoritos = useCallback(async () => {
    try {
      setCargando(true);
      const idsFavoritos = await obtenerFavoritos();
      setFavoritos(new Set(idsFavoritos));
    } catch (error) {
      console.error("Error al cargar favoritos:", error);
      toast.error("Error al cargar favoritos");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      cargarFavoritos();
    } else {
      setFavoritos(new Set());
      setCargando(false);
    }
  }, [token, cargarFavoritos]);

  /**
   * Agrega o elimina un producto de favoritos
   * @param {string} productoId - ID del producto
   */
  const toggleFavorito = useCallback(
    async (productoId) => {
      if (!token) {
        toast.error("Debes iniciar sesión para agregar productos a favoritos");
        return;
      }

      const productoIdStr = productoId.toString();
      const esFavorito = favoritos.has(productoIdStr);

    //Switch para agregar o eliminar favorito
    
      try {
        setLoading(true);
        if (esFavorito) {
          await eliminarFavorito(productoId);
          setFavoritos((prev) => {
            const nuevo = new Set(prev);
            nuevo.delete(productoIdStr);
            return nuevo;
          });
          toast.success("Producto eliminado de favoritos");
        } else {
          await agregarFavorito(productoId);
          setFavoritos((prev) => {
            const nuevo = new Set(prev);
            nuevo.add(productoIdStr);
            return nuevo;
          });
          toast.success("Producto agregado a favoritos");
        }
      } catch (error) {
        console.error("Error al actualizar favoritos:", error);
        const mensaje =
          error.response?.data?.mensaje ||
          error.response?.data?.msg ||
          "Error al actualizar favoritos";
        toast.error(mensaje);
      } finally {
        setLoading(false);
      }
    },
    [favoritos, token]
  );

  /**
   * Verifica si un producto está en favoritos
   * @param {string} productoId - ID del producto
   * @returns {boolean} true si está en favoritos
   */
  const esFavorito = useCallback(
    (productoId) => {
      return favoritos.has(productoId?.toString());
    },
    [favoritos]
  );

  return {
    favoritos,
    loading,
    cargando,
    toggleFavorito,
    esFavorito,
    cargarFavoritos,
  };
};

