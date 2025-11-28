import clientAxios from "../utils/clientAxios";

/**
 * Realiza la llamada al backend para iniciar sesión.
 * @param {{ emailUsuario: string, contrasenia: string }} payload
 * @returns {Promise<object>} respuesta del servidor
 */
export async function loginService({ correo, contrasenia }) {
  try {
    const { data } = await clientAxios.post("/usuarios/login", {
      correo,
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

/**
 * Realiza el login social (Google/GitHub) enviando el token al backend.
 * @param {string} token - Token de ID de Firebase
 * @returns {Promise<object>} respuesta del servidor
 */
export async function socialLoginService(token) {
  try {
    const { data } = await clientAxios.post("/auth/social", { token });
    return data;
  } catch (error) {
    const mensaje =
      error.response?.data?.message || error.message || "Error en login social";
    throw new Error(mensaje);
  }
}
