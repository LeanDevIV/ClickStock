import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Splide from "@splidejs/splide";
import "@splidejs/splide/dist/css/splide.min.css";
import "../css/OfertaCarrusel.css";

const OfertaCarrusel = () => {
  const splideRef = useRef(null);
  const navigate = useNavigate();

  const ofertas = [
    {
      id: 1,
      imagen: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=800&h=500&fit=crop",
      categoria: "TECNOLOGÍA",
      titulo: "50% OFF en Electrónicos",
      descripcion: "Descubre las mejores ofertas en smartphones y tablets de última generación",
      color: "#6366f1",
    },
    {
      id: 2,
      imagen: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&h=500&fit=crop",
      categoria: "SUPERMERCADO",
      titulo: "2x1 en Productos Seleccionados",
      descripcion: "Aprovecha esta promoción exclusiva en tu supermercado favorito",
      color: "#10b981",
    },
    {
      id: 3,
      imagen: "https://thumbs.dreamstime.com/b/etiquetas-de-venta-con-descuento-en-perchas-ropa-tienda-informal-temporada-por-concepto-moda-negro-viernes-d%C3%ADa-compras-fuera-230462056.jpg",
      categoria: "MODA",
      titulo: "30% OFF en Temporada",
      descripcion: "Renueva tu guardarropa con nuestros descuentos especiales",
      color: "#f59e0b",
    },
    {
      id: 4,
      imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBjIhW7cp5ZTHBy20h-CpQUlvpurLNvv9zzQ&s",
      categoria: "ENVÍO",
      titulo: "Envío Gratis",
      descripcion: "En todas tus compras mayores a $500 - Aprovecha hoy",
      color: "#ef4444",
    },
  ];

  useEffect(() => {
    if (splideRef.current) {
      const splide = new Splide(splideRef.current, {
        type: "fade",
        rewind: true,
        pagination: false,
        arrows: true,
        autoplay: true,
        interval: 5000,
        pauseOnHover: true,
        speed: 1000,
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",
      });
      splide.mount();
      return () => splide.destroy();
    }
  }, []);

  const handleOfertaClick = () => {
    navigate("/no-existe");
  };

  return (
    <div className="ofertas-oferta">
      <div className="splide" ref={splideRef}>
        <div className="splide__track">
          <ul className="splide__list">
            {ofertas.map((oferta, index) => (
              <li className="splide__slide" key={oferta.id}>
                <div className="slide-oferta" style={{ "--accent-color": oferta.color }}>
                  <div className="slide-imagen">
                    <img src={oferta.imagen} alt={oferta.titulo} />
                    <div className="overlay-gradiente"></div>
                  </div>

                  <div className="slide-contenido">
                    <div className="contenido-interno">
                      <span className="categoria" style={{ color: oferta.color }}>
                        {oferta.categoria}
                      </span>
                      <h2 className="titulo-principal">{oferta.titulo}</h2>
                      <p className="descripcion">{oferta.descripcion}</p>
                      <button
                        className="btn-oferta"
                        style={{ backgroundColor: oferta.color, borderColor: oferta.color }}
                        onClick={handleOfertaClick}
                      >
                        Descubrir Oferta
                        <svg className="btn-icon" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M5 12H19M19 12L12 5M19 12L12 19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="slide-indicador">
                    {ofertas.map((_, i) => (
                      <div
                        key={i}
                        className={`indicador-punto ${i === index ? "activo" : ""}`}
                        style={{ backgroundColor: i === index ? oferta.color : "#e5e7eb" }}
                      ></div>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OfertaCarrusel;
