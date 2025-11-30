import { useState, useCallback } from "react";
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
  const {
    token,
    favoritos: favoritosGlobal,
    setFavoritos: setFavoritosGlobal,
    addFavorito: addFavoritoGlobal,
    removeFavorito: removeFavoritoGlobal,
  } = useStore();

  const [loading, setLoading] = useState(false);
  const [cargando, setCargando] = useState(false);

  /**
   * Carga los favoritos del usuario desde el servidor
   */
  const cargarFavoritos = useCallback(async () => {
    if (!token) {
      setFavoritosGlobal([]);
      return;
    }

    try {
      setCargando(true);
      const idsFavoritos = await obtenerFavoritos();
      setFavoritosGlobal(idsFavoritos);
    } catch (error) {
      console.error("Error al cargar favoritos:", error);
    } finally {
      setCargando(false);
    }
  }, [token, setFavoritosGlobal]);

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
      const esFavorito = favoritosGlobal.includes(productoIdStr);

      try {
        setLoading(true);
        if (esFavorito) {
          // Optimistic update
          removeFavoritoGlobal(productoIdStr);
          await eliminarFavorito(productoId);
          toast.success("Producto eliminado de favoritos");
        } else {
          // Optimistic update
          addFavoritoGlobal(productoIdStr);
          await agregarFavorito(productoId);
          toast.success("Producto agregado a favoritos");
        }
      } catch (error) {
        console.error("Error al actualizar favoritos:", error);
        const mensaje =
          error.response?.data?.mensaje ||
          error.response?.data?.msg ||
          "Error al actualizar favoritos";
        toast.error(mensaje);

        cargarFavoritos();
      } finally {
        setLoading(false);
      }
    },
    [
      favoritosGlobal,
      token,
      addFavoritoGlobal,
      removeFavoritoGlobal,
      cargarFavoritos,
    ]
  );

  /**
   * Verifica si un producto está en favoritos
   * @param {string} productoId - ID del producto
   * @returns {boolean} true si está en favoritos
   */
  const esFavorito = useCallback(
    (productoId) => {
      return favoritosGlobal.includes(productoId?.toString());
    },
    [favoritosGlobal]
  );

  return {
    favoritos: new Set(favoritosGlobal),
    loading,
    cargando,
    toggleFavorito,
    esFavorito,
    cargarFavoritos,
  };
};
