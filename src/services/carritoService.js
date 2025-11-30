import clientAxios from "../utils/clientAxios";

/**
 * Obtiene el carrito del usuario autenticado
 * @returns {Promise<Object>} Carrito con productos y total
 */
export const obtenerCarrito = async () => {
  try {
    const response = await clientAxios.get("/carrito");
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      return { productos: [], total: 0 };
    }
    throw error;
  }
};

/**
 * Agrega un producto al carrito
 * @param {string} idProducto - ID del producto a agregar
 * @param {number} cantidad - Cantidad del producto (default: 1)
 * @returns {Promise<Object>} Respuesta del servidor con el carrito actualizado
 */
export const agregarProducto = async (idProducto, cantidad = 1) => {
  const response = await clientAxios.post("/carrito", {
    productos: [{ idProducto, cantidad }],
  });
  return response.data;
};

/**
 * Actualiza la cantidad de un producto en el carrito
 * @param {string} idProducto - ID del producto
 * @param {number} cantidad - Nueva cantidad
 * @returns {Promise<Object>} Respuesta del servidor con el carrito actualizado
 */
export const actualizarCantidad = async (idProducto, cantidad) => {
  const response = await clientAxios.put(`/carrito/${idProducto}`, {
    cantidad,
  });
  return response.data;
};

/**
 * Elimina un producto del carrito
 * @param {string} idProducto - ID del producto a eliminar
 * @returns {Promise<Object>} Respuesta del servidor con el carrito actualizado
 */
export const eliminarProducto = async (idProducto) => {
  const response = await clientAxios.delete(`/carrito/${idProducto}`);
  return response.data;
};

/**
 * Limpia todo el carrito del usuario
 * @returns {Promise<Object>} Respuesta del servidor con el carrito vacío
 */
export const limpiarCarrito = async () => {
  const response = await clientAxios.delete("/carrito/vaciar");
  return response.data;
};

