import clientAxios from "../utils/clientAxios";

/**
 * Actualiza la información de un usuario
 * @param {string} id - ID del usuario
 * @param {object} data - Datos a actualizar
 * @returns {Promise<object>} - Usuario actualizado
 */
export const updateUserService = async (id, data) => {
  try {
    const response = await clientAxios.put(`/usuarios/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
