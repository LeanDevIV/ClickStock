import clientAxios from "../utils/clientAxios";

/**
 * Realiza la llamada al backend para registrar un usuario.
 * @param {{ nombre: string, emailUsuario: string, contrasenia: string }} payload
 * @returns {Promise<object>} respuesta del servidor
 */
export async function registroService({
  nombre,
  apellido,
  correo,
  telefono,
  contrasenia,
}) {
  try {
    const { data } = await clientAxios.post("/usuarios/registro", {
      nombre,
      apellido,
      correo,
      telefono,
      contrasenia,
    });

    const usuario = data.usuario || null;
    const token = data.token || (usuario && usuario.token) || null;
    const msg = data.message || data.msg || null;

    return { token, usuario, msg };
  } catch (error) {
    // Normalizar el error para que el componente lo muestre
    const mensaje =
      error.response?.data?.msg || error.message || "Error en el registro";
    throw new Error(mensaje);
  }
}
