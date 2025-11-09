import React from "react";
import "../css/beneficios.css";
const BeneficiosHome = () => {
  return (
    <div>
      <div className="contenedorPadreBene mt-5 w-100">
        <div className="tituloBeneficios text-center">
          <h1>Beneficios de comprar con Nosotros</h1>
        </div>
        <div className="beneficios-contenedor rounded-2 p-3 mt-3 w-100 d-flex flex-column flex-md-row justify-content-between align-items-stretch text-center">
          <div className="itemBeneficio1 card-body mb-3 mb-md-0">
            <i className="bi bi-truck fs-2 mb-2"></i>
            <h6 className="fw-bold text-dark">Entrega Rápida</h6>
            <p className="mb-0 text-dark">Recibe tu pedido en 24/48 horas</p>
          </div>
          <div className="itemBeneficio card-body mb-3 mb-md-0">
            <i className="bi bi-shield-check fs-2 mb-2"></i>
            <h6 className="fw-bold text-dark">Garantía</h6>
            <p className="mb-0 text-dark">30 días de garantía en todos los productos</p>
          </div>
          <div className="itemBeneficio card-body mb-3 mb-md-0">
            <i className="bi bi-credit-card fs-2 mb-2"></i>
            <h6 className="fw-bold text-dark">Pagos Seguros</h6>
            <p className="mb-0 text-dark">Transacciones 100% protegidas</p>
          </div>
          <div className="itemBeneficio card-body">
            <i className="bi bi-tag fs-2 mb-2"></i>
            <h6 className="fw-bold text-dark">Los mejores precios</h6>
            <p className="mb-0 text-dark">Los precios más accesibles con Nosotros</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeneficiosHome;