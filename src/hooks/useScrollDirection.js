import { useState, useEffect } from "react";

/**
 * Detecta si el usuario hace scroll hacia arriba o hacia abajo.
 * Muestra el header apenas sube un poco, y lo oculta al bajar.
 */
export const useScrollDirection = (offset = 10) => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY + offset && currentScrollY > 100) {
        setShowNavbar(false);
      }
      else if (currentScrollY < lastScrollY - offset) {
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, offset]);

  return showNavbar;
};
