import { useEffect } from "react";

/**
 * Hook personalizado para actualizar el título del documento.
 * @param {string} title - El título de la página actual.
 */
export const usePageTitle = (title) => {
  useEffect(() => {
    document.title = `${title} | ClickStock`;
  }, [title]);
};
