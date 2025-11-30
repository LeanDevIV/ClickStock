import { CHIP_COLORS, SELECT_OPTIONS, FIELD_TYPES } from '../config/adminConfig';
/**
 * Trunca un texto a una longitud máxima sin cortar palabras.
 */
export const truncate =(text = '', max = 50, suffix = '...') => {
  if (text.length <= max) return text;
  const short = text.slice(0, max);
  const cut = short.lastIndexOf(' ');
  return (cut === -1 ? short : short.slice(0, cut)) + suffix;
};
/**
 * Formatea un valor según su tipo para su visualización en la tabla.
 */
export const formatValue = (value, type) => {
  if (!value && value !== 0) return 'N/A';

  switch (type) {
    case 'price':
      return `$${parseFloat(value).toFixed(2)}`;
    case 'rating':
      return `${value} ⭐`;
    case 'date':
      return new Date(value).toLocaleDateString();
    case 'boolean':
      return value ? 'Sí' : 'No';
    case 'truncate':
      return truncate(value, 50);
    default:
      return value;
  }
};
/**
 * Obtiene el color del chip basado en el valor y tipo.
 */
export const getChipColor = (value, type) => {
  return CHIP_COLORS[type]?.[value] || 'default';
};
/**
 * Obtiene la configuración del campo basado en su nombre.
 */
export const getFieldConfig = (field) => {
  return FIELD_TYPES[field];
};
/**
 * Obtiene las opciones de selección para un campo dado.
 */
export const getSelectOptions = (field) => {
  return SELECT_OPTIONS[field] || [];
};
