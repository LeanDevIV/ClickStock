import clientAxios from "../utils/clientAxios";

/**
 * Obtiene todos los favoritos del usuario autenticado
 * @returns {Promise<Array>} Array de productos favoritos
 */
export const obtenerFavoritos = async () => {
  try {
    const response = await clientAxios.get("/favoritos");
    const favoritosData = response.data?.productos || response.data?.favoritos || response.data;
    
    if (Array.isArray(favoritosData)) {
      return favoritosData
        .map((fav) => fav.idProducto?.toString() || fav._id?.toString() || fav.toString())
        .filter(Boolean);
    }
    return [];
  } catch (error) {
    if (error.response?.status === 401) {
      return [];
    }
    throw error;
  }
};

/**
 * Agrega un producto a los favoritos
 * @param {string} idProducto - ID del producto a agregar
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const agregarFavorito = async (idProducto) => {
  const response = await clientAxios.post("/favoritos", { idProducto });
  return response.data;
};

/**
 * Elimina un producto de los favoritos
 * @param {string} idProducto - ID del producto a eliminar
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const eliminarFavorito = async (idProducto) => {
  const response = await clientAxios.delete(`/favoritos/${idProducto}`);
  return response.data;
};

/**
 * Verifica si un producto está en favoritos
 * @param {string} idProducto - ID del producto a verificar
 * @returns {Promise<boolean>} true si está en favoritos, false si no
 */
export const verificarFavorito = async (idProducto) => {
  try {
    const response = await clientAxios.get(`/favoritos/${idProducto}/verificar`);
    return response.data?.estaEnFavoritos || false;
  } catch (error) {
    if (error.response?.status === 401) {
      return false;
    }
    throw error;
  }
};

