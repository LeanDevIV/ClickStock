import React, { useState } from "react";
import "./PromocionesForm.css";

function PromocionesForm() {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    descuento: "",
    fechaInicio: "",
    fechaFin: "",
    imagen: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(" Promoción creada con éxito (ver consola)");
    console.log("Datos de la promoción:", formData);
    // Aquí podés conectar con el backend usando axios.post(...)
  };

  return (
    <div className="promo-main">
      <div className="promo-form-container">
        <h2>🛍️ Crear nueva promoción</h2>
        <form className="promo-form" onSubmit={handleSubmit}>
          <label>Título</label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Ej: 20% OFF en zapatillas"
            required
          />

          <label>Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Detalles de la promoción..."
            required
          ></textarea>

          <label>Descuento (%)</label>
          <input
            type="number"
            name="descuento"
            value={formData.descuento}
            onChange={handleChange}
            min="0"
            max="100"
            required
          />

          <div className="fecha-group">
            <div>
              <label>Fecha inicio</label>
              <input
                type="date"
                name="fechaInicio"
                value={formData.fechaInicio}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Fecha fin</label>
              <input
                type="date"
                name="fechaFin"
                value={formData.fechaFin}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label>Imagen (opcional)</label>
          <input
            type="file"
            name="imagen"
            accept="image/*"
            onChange={handleChange}
          />

          <button type="submit">Crear Promoción</button>
        </form>
      </div>

      {/*  Vista previa */}
      <div className="promo-preview">
        <h3>👀 Vista previa</h3>
        <div className="preview-card">
          {preview ? (
            <img src={preview} alt="Preview" className="preview-img" />
          ) : (
            <div className="preview-placeholder">Sin imagen</div>
          )}
          <div className="preview-info">
            <h4>{formData.titulo || "Título de la promoción"}</h4>
            <p>{formData.descripcion || "Descripción breve..."}</p>
            {formData.descuento && (
              <span className="descuento">{formData.descuento}% OFF</span>
            )}
            {(formData.fechaInicio || formData.fechaFin) && (
              <p className="fechas">
                 {formData.fechaInicio} → {formData.fechaFin}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromocionesForm;
