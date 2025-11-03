import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./AboutUs.css";

const integrantes = [
  {
    nombre: "Luciano Mayorga",
    rol: "Desarrollador Frontend",
    imagen: "/img/luciano.jpg",
    github: "#",
    linkedin: "#",
  },
  {
    nombre: "Leandro Cordoba",
    rol: "Desarrollador Fullstack",
    imagen: "/img/leandro.jpg",
    github: "#",
    linkedin: "#",
  },
  {
    nombre: "Sara Robles",
    rol: "Diseñador fullstack",
    imagen: "/img/sara.jpg",
    github: "#",
    linkedin: "#",
  },
  {
    nombre: "Isaias Romano",
    rol: "Tester",
    imagen: "/img/isaias.jpg",
    github: "#",
    linkedin: "#",
  },
];

export default function AboutUs() {
  return (
    <div className="container-fluid py-5 text-center about-section">
      <h1 className="mb-4 fw-bold">Quiénes Somos</h1>
      <p className="mb-5 text-muted mx-auto" style={{ maxWidth: "700px" }}>
        Somos un equipo de desarrolladores apasionados por la tecnología y el
        trabajo en equipo. Este proyecto forma parte de nuestro trabajo final
        del curso de desarrollo Fullstack, donde buscamos crear una aplicación
        web moderna y funcional.
      </p>

      <div className="row justify-content-center g-4">
        {integrantes.map((i, index) => (
          <div key={index} className="col-12 col-sm-6 col-lg-3">
            <div className="card integrante-card border-0 shadow-lg h-100">
              <div className="img-container mt-4">
                <img
                  src={i.imagen}
                  alt={i.nombre}
                  className="rounded-circle integrante-img"
                />
              </div>
              <div className="card-body">
                <h5 className="card-title fw-semibold">{i.nombre}</h5>
                <p className="card-text text-muted">{i.rol}</p>
                <div className="social-icons">
                  <a
                    href={i.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark mx-2"
                  >
                    <i className="bi bi-github fs-4"></i>
                  </a>
                  <a
                    href={i.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary mx-2"
                  >
                    <i className="bi bi-linkedin fs-4"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
