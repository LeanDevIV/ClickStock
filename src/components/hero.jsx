import React, { useState, useEffect } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
import '@splidejs/splide/dist/css/splide.min.css';
import '../css/hero.css';

const CarouselProgress = () => {
  const [progress, setProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Array de imágenes de ejemplo (puedes reemplazar con tus URLs)
  const images = [
    'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1200&h=500&fit=crop',
    'https://images.unsplash.com/photo-1682687220067-dced9a881b56?w=1200&h=500&fit=crop',
    'https://images.unsplash.com/photo-1682687221038-404670f4274a?w=1200&h=500&fit=crop',
    'https://images.unsplash.com/photo-1682687220509-61b8b906d0a4?w=1200&h=500&fit=crop',
    'https://images.unsplash.com/photo-1682695794947-17061dc284dd?w=1200&h=500&fit=crop'
  ];

  const splideOptions = {
    type: 'loop',
    perPage: 1,
    autoplay: true,
    interval: 2000, // REDUCIDO a 2 segundos (más rápido)
    pauseOnHover: false,
    resetProgress: false,
    arrows: true,
    pagination: false,
    speed: 500, // REDUCIDO para transición más rápida entre slides
    dragAngleThreshold: 30,
    autoScroll: {
      speed: 1.5, // AUMENTADO para que la barra progrese más rápido
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

        {/* Barra de progreso personalizada */}
        <div className="custom-progress">
          <div 
            className="progress-bar"
            style={{ 
              width: `${((currentSlide + 1) / images.length) * 100}%` 
            }}
          ></div>
        </div>

        {/* Indicadores de progreso */}
        <div className="progress-indicators">
          {images.map((_, index) => (
            <div
              key={index}
              className={`progress-dot ${index === currentSlide ? 'active' : ''} ${
                index < currentSlide ? 'completed' : ''
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarouselProgress;