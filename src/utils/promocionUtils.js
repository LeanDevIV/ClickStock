/**
 * Obtiene la promoción activa de un producto
 * @param {string} productoId - ID del producto
 * @param {Array} promociones - Array de promociones activas
 * @returns {Object|null} - Promoción encontrada o null
 */
export const obtenerPromocionProducto = (productoId, promociones) => {
  if (!productoId || !promociones || promociones.length === 0) return null;

  return promociones.find((promo) =>
    promo.productos.some(
      (p) => (typeof p === "string" ? p : p._id) === productoId
    )
  );
};

/**
 * Calcula el precio final aplicando el descuento
 * @param {number} precio - Precio original
 * @param {number} descuento - Porcentaje de descuento (1-100)
 * @returns {number} - Precio con descuento aplicado
 */
export const calcularPrecioConDescuento = (precio, descuento) => {
  if (!precio || !descuento || descuento <= 0) return precio;
  const porcentajeDescuento = descuento / 100;
  return Math.round(precio * (1 - porcentajeDescuento));
};

/**
 * Formatea el descuento para mostrar
 * @param {number} descuento - Porcentaje de descuento
 * @returns {string} - Texto formateado (ej: "20% OFF")
 */
export const formatearDescuento = (descuento) => {
  return `${descuento}% OFF`;
};

/**
 * Valida si una promoción está vigente
 * @param {Object} promocion - Objeto de promoción
 * @returns {boolean} - true si está vigente
 */
export const validarPromocionVigente = (promocion) => {
  if (!promocion) return false;

  const now = new Date();
  const fechaInicio = new Date(promocion.fechaInicio);
  const fechaFin = new Date(promocion.fechaFin);

  return (
    promocion.activa &&
    !promocion.isDeleted &&
    now >= fechaInicio &&
    now <= fechaFin
  );
};

/**
 * Calcula los días restantes de una promoción
 * @param {Object} promocion - Objeto de promoción
 * @returns {number} - Días restantes
 */
export const diasRestantes = (promocion) => {
  if (!promocion || !promocion.fechaFin) return 0;

  const now = new Date();
  const fechaFin = new Date(promocion.fechaFin);
  const diff = fechaFin - now;

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

/**
 * Formatea el rango de fechas de la promoción
 * @param {string} fechaInicio - Fecha de inicio
 * @param {string} fechaFin - Fecha de fin
 * @returns {string} - Rango formateado
 */
export const formatearRangoFechas = (fechaInicio, fechaFin) => {
  const inicio = new Date(fechaInicio).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
  });
  const fin = new Date(fechaFin).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
  });
  return `${inicio} - ${fin}`;
};
