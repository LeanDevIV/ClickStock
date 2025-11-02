import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Footer.css";
import logo from "../assets/favicon.png";

const Footer = () => {
  return (
    <footer className="footer text-white pt-5 pb-3 d-flex flex-column justify-content-center">
      <div className="container">
        <div className="row align-items-start text-center text-md-start">

          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="fw-bold mb-3 text-gold">Nuestras redes</h5>
            <div className="d-flex justify-content-center justify-content-md-start gap-3 fs-4">
              <a href="#" className="text-white social-icon"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-white social-icon"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-white social-icon"><i className="bi bi-twitter-x"></i></a>
            </div>
          </div>

          <div className="col-md-4">
            <h5 className="fw-bold mb-3 text-gold">Acerca de nosotros</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="footer-link">Quiénes somos</a></li>
              <li><a href="#" className="footer-link">Política de privacidad</a></li>
              <li><a href="#" className="footer-link">Términos y condiciones</a></li>
            </ul>
          </div>

          <div className="col-md-4">
            <h5 className="footer-title">Enlaces Rápidos</h5>
            <ul className="footer-links-list">
              <li><a href="/">Inicio</a></li>
              <li><a href="/products">Productos</a></li>
              <li><a href="/contacto">Contacto</a></li>
            </ul>
          </div>
        </div>

        <hr className="footer-line my-4" />
        <div className="text-center">
          <p className="mb-0 text-white-50">Todos los derechos reservados © {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
