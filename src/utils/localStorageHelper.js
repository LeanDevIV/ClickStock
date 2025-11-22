/**
 * Helper seguro para acceso a localStorage
 * Maneja errores cuando localStorage no está disponible (modo incógnito, cuota excedida, etc.)
 */

const isLocalStorageAvailable = () => {
  try {
    const test = "__localStorage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    console.error("Error al verificar localStorage:", error);
    return false;
  }
};

/**
 * Obtiene un valor de localStorage de forma segura
 * @param {string} key - Clave del item
 * @param {*} defaultValue - Valor por defecto si falla o no existe
 * @returns {*} Valor almacenado o defaultValue
 */
export const getItem = (key, defaultValue = null) => {
  if (!isLocalStorageAvailable()) {
    console.warn("localStorage no está disponible, usando valor por defecto");
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }

    // Intentar parsear JSON, si falla retornar el string
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  } catch (error) {
    console.error(`Error al leer de localStorage (key: ${key}):`, error);
    return defaultValue;
  }
};

/**
 * Guarda un valor en localStorage de forma segura
 * @param {string} key - Clave del item
 * @param {*} value - Valor a guardar
 * @returns {boolean} true si se guardó exitosamente, false si falló
 */
export const setItem = (key, value) => {
  if (!isLocalStorageAvailable()) {
    console.warn("localStorage no está disponible, no se puede guardar");
    return false;
  }

  try {
    const valueToStore =
      typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, valueToStore);
    return true;
  } catch (error) {
    console.error(`Error al guardar en localStorage (key: ${key}):`, error);

    // Manejar error de cuota excedida
    if (error.name === "QuotaExceededError") {
      console.warn(
        "Cuota de localStorage excedida. Considera limpiar datos antiguos."
      );
    }

    return false;
  }
};

/**
 * Elimina un item de localStorage de forma segura
 * @param {string} key - Clave del item a eliminar
 * @returns {boolean} true si se eliminó exitosamente, false si falló
 */
export const removeItem = (key) => {
  if (!isLocalStorageAvailable()) {
    console.warn("localStorage no está disponible");
    return false;
  }

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error al eliminar de localStorage (key: ${key}):`, error);
    return false;
  }
};

/**
 * Limpia todo el localStorage de forma segura
 * @returns {boolean} true si se limpió exitosamente, false si falló
 */
export const clear = () => {
  if (!isLocalStorageAvailable()) {
    console.warn("localStorage no está disponible");
    return false;
  }

  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error("Error al limpiar localStorage:", error);
    return false;
  }
};

/**
 * Verifica si una clave existe en localStorage
 * @param {string} key - Clave a verificar
 * @returns {boolean} true si existe, false si no
 */
export const hasItem = (key) => {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error(`Error al verificar localStorage (key: ${key}):`, error);
    return false;
  }
};

export default {
  getItem,
  setItem,
  removeItem,
  clear,
  hasItem,
};
