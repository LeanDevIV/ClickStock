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
    
    const token = data.token;
    const usuario = data.usuario || null;
    const msg = data.message || data.msg || null;

    return { token, usuario, msg };
  } catch (error) {
    const mensaje =
      error.response?.data?.msg || error.message || "Error en el login";
    throw new Error(mensaje);
  }
}
