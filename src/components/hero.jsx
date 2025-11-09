import React, { useState, useEffect } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import { AutoScroll } from "@splidejs/splide-extension-auto-scroll";
import "@splidejs/splide/dist/css/splide.min.css";
import "../css/hero.css";

const HeroHomePage = () => {
  const [progress, setProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [
    "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1200&h=500&fit=crop",
    "https://images.unsplash.com/photo-1682687220067-dced9a881b56?w=1200&h=500&fit=crop",
    "https://img.freepik.com/free-vector/stylish-glowing-digital-red-lines-banner_1017-23964.jpg?semt=ais_hybrid&w=740&q=80",
    "https://png.pngtree.com/thumb_back/fh260/background/20230217/pngtree-blue-wavy-banner-background-blank-image_1608934.jpg",
    "https://img.freepik.com/vector-gratis/fondo-abstracto-azul-medio-tono-espacio-texto_1017-41428.jpg?semt=ais_hybrid&w=740&q=80",
  ];

  const splideOptions = {
    type: "loop",
    perPage: 1,
    autoplay: true,
    interval: 2000, 
    pauseOnHover: false,
    resetProgress: false,
    arrows: true,
    pagination: false,
    speed: 480, 
    dragAngleThreshold: 30,
    autoScroll: {
      speed: 1.5, 
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
            setProgress(0);
          }}
        >
          {images.map((image, index) => (
            <SplideSlide key={index}>
              <div className="slide-content">
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className="slide-image"
                />
                <div className="slide-overlay">
                  <h3>Slide {index + 1}</h3>
                  <p>Descripción de la imagen {index + 1}</p>
                </div>
              </div>
            </SplideSlide>
          ))}
        </Splide>
        <div className="custom-progress">
          <div
            className="progress-bar"
            style={{
              width: `${((currentSlide + 1) / images.length) * 100}%`,
            }}
          ></div>
        </div>
        <div className="progress-indicators">
          {images.map((_, index) => (
            <div
              key={index}
              className={`progress-dot ${
                index === currentSlide ? "active" : ""
              } ${index < currentSlide ? "completed" : ""}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroHomePage;
