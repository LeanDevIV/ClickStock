import React from 'react';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
  Smartphone,
  Checkroom,
  Home,
  SportsSoccer,
  Spa,
  Toys,
  MenuBook,
  Pets,
  Yard,
  Kitchen,
  Computer

} from '@mui/icons-material';
import "../css/categoriasBox.css";

const CategoriasBox = () => {
  const theme = useTheme();
  const modoOscuro = theme.palette.mode === 'dark';
  const navigate = useNavigate();

  const categoriasPrincipales = [
    { id: 1, nombre: "Electronicos", icono: <Smartphone sx={{ fontSize: 60 }} />, color: "#B91C1C" },
    { id: 2, nombre: "Moda", icono: <Checkroom sx={{ fontSize: 60 }} />, color: "#D4AF37" },
    { id: 3, nombre: "Hogar", icono: <Home sx={{ fontSize: 60 }} />, color: "#404040" }
  ];

  const otrasCategorias = [
    { id: 4, nombre: "Deportes", icono: <SportsSoccer sx={{ fontSize: 30 }} /> },
    { id: 5, nombre: "Belleza", icono: <Spa sx={{ fontSize: 30 }} /> },
    { id: 6, nombre: "Juguetes", icono: <Toys sx={{ fontSize: 30 }} /> },
    { id: 7, nombre: "Libros", icono: <MenuBook sx={{ fontSize: 30 }} /> },
    { id: 8, nombre: "Mascotas", icono: <Pets sx={{ fontSize: 30 }} /> },
    { id: 9, nombre: "Jardin", icono: <Yard sx={{ fontSize: 30 }} /> },
    { id: 10, nombre: "Cocina", icono: <Kitchen sx={{ fontSize: 30 }} /> },
    { id: 11, nombre: "Tecnologia", icono: <Computer sx={{ fontSize: 30 }} /> }
  ];

  const handleCategoriaClick = (nombreCategoria) => {
    navigate(`/categoria/${nombreCategoria.toLowerCase()}`);
  };

  return (
    <div className={`categorias-container ${modoOscuro ? 'modo-oscuro' : ''}`}>
      <h1 className="categorias-titulo">Explorar Productos</h1>

      <div className="categorias-principales-grid">
        {categoriasPrincipales.map((categoria) => (
          <div
            key={categoria.id}
            className="categoria-principal"
            style={{ '--categoria-color': categoria.color }}
            onClick={() => handleCategoriaClick(categoria.nombre)}
          >
            <div className="categoria-icono material-icon">
              {categoria.icono}
            </div>
            <h3 className="categoria-nombre">{categoria.nombre}</h3>
          </div>
        ))}
      </div>

      <div className="otras-categorias">
        <h3 className="otras-categorias-titulo">Otras categorías</h3>
        <div className="mini-categorias-grid">
          {otrasCategorias.map((categoria) => (
            <div
              key={categoria.id}
              className="mini-categoria-item"
              onClick={() => handleCategoriaClick(categoria.nombre)}
            >
              <div className="mini-icono material-icon">
                {categoria.icono}
              </div>
              <span className="mini-nombre">{categoria.nombre}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriasBox;
