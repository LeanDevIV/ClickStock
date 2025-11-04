import clientAxios from "../utils/clientAxios";

/**
 * Realiza la llamada al backend para iniciar sesión.
 * @param {{ emailUsuario: string, contrasenia: string }} payload
 * @returns {Promise<object>} respuesta del servidor
 */
export async function loginService({ emailUsuario, contrasenia }) {
  try {
    const { data } = await clientAxios.post("/usuarios/login", {
      emailUsuario,
      contrasenia,
    });
    return data;
  } catch (error) {
    const mensaje =
      error.response?.data?.msg || error.message || "Error en el login";
    throw new Error(mensaje);
  }
}
