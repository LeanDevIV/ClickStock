import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./AboutUs.css";

const integrantes = [
  {
    nombre: "Luciano Mayorga",
    rol: "Desarrollador Frontend",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRq2Td0CIbPGuZvYgLyx0up0jcQ1VH3Vm5yMg&s",
    github: "https://github.com/lucianomayorga",
    linkedin: "#",
  },
  {
    nombre: "Leandro Cordoba",
    rol: "Desarrollador Fullstack",
    imagen: "https://avatars.githubusercontent.com/u/123712000?v=4",
    github: "https://github.com/LeanDevIV",
    linkedin: "#",
  },
  {
    nombre: "Sara Robles",
    rol: "Diseñador fullstack",
    imagen: "https://avatars.githubusercontent.com/u/209563219?v=4",
    github: "https://github.com/sara-18Git",
    linkedin: "#",
  },
  {
    nombre: "Isaias Romano",
    rol: "Tester",
    imagen: "https://ca.slack-edge.com/THQU1MGPN-U088Z15QP6Z-1362ac5a8ce0-512",
    github: "#",
    linkedin: "#",
  },
  {
    nombre: "Alvaro Roldan",
    rol: "Tester",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6SNQ9XsPt9cv4aHIR6z2XXTBHZ9Wn091bkQ&s",
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
        Y por sobre todo, APROBAR😁
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
