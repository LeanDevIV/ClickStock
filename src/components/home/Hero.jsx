import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import "@splidejs/splide/dist/css/splide.min.css";
import "../../styles/hero.css";

const HeroHomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      image: "https://i.imgur.com/WQCfEbH.jpeg",
      link: "/",
      title: "Una comunidad de confianza",
      description: "Únete a miles de usuarios satisfechos que gestionan su inventario con nosotros.",
      buttonText: "Empezar Ahora",
    },
    {
      image: "https://i.imgur.com/27tgbdE.jpeg",
      link: "/contacto",
      title: "Una gran variedad de productos",
      description: "Encuentra todo lo que necesitas para tu negocio en un solo lugar. Y sí no lo tenemos, ¡déjanos un mensaje!",
      buttonText: "Empezar Ahora",
    },
    {
      image: "https://i.imgur.com/Db3z0Pj.jpeg",
      title: "Control Total",
      description: "Gestiona cada aspecto de tu inventario con precisión.",
      buttonText: "Empezar Ahora",
      link: "/contacto",
    },
    {
      image: "https://i.imgur.com/ZBRU7yI.jpeg",
      title: "Seguridad Garantizada",
      description: "Tus datos protegidos con los más altos estándares.",
      buttonText: "Más Información",
      link: "/nosotros",
    },
    {
      image: "https://i.imgur.com/7aPraif.jpeg",
      title: "Soporte 24/7",
      description: "Estamos aquí para ayudarte en cada paso del camino.",
      buttonText: "Contactar",
      link: "/contacto",
    },
  ];

  const splideOptions = {
    type: "loop",
    perPage: 1,
    autoplay: true,
    interval: 4000,
    pauseOnHover: false,
    resetProgress: false,
    arrows: true,
    pagination: true, 
    speed: 800,
    dragAngleThreshold: 30,
    autoScroll: {
      speed: 1.5,
      pauseOnHover: false,
    },
  };

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        <Splide
          options={splideOptions}
          extensions={{ AutoScroll }}
          onMoved={(splide, index) => {
            setCurrentSlide(index);
          }}
        >
          {slides.map((slide, index) => (
            <SplideSlide key={index}>
              <div
                className="slide-content"
                onClick={() => navigate(slide.link)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate(slide.link);
                  }
                }}
              >
                <img
                  src={slide.image}
                  alt={`Slide ${index + 1}`}
                  className="slide-image"
                />
                <div className="slide-overlay">
                  <h3>{slide.title}</h3>
                  <p>{slide.description}</p>
                </div>
              </div>
            </SplideSlide>
          ))}
        </Splide>
        <div className="custom-progress">
          <div
            className="progress-bar"
            style={{
              width: `${((currentSlide + 1) / slides.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default HeroHomePage;
