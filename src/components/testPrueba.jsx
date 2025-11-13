// ( este es un archivo temporal)
import React from 'react';
import BotonCompartir from '../components/BotonCompartir.jsx';

const TestCompartir = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Prueba del Botón de Compartir</h1>
      
      <BotonCompartir 
        idProducto="test-123"
        nombreProducto="Producto de Prueba"
      />
      
      <div style={{ marginTop: '20px' }}>
        <h3>Para probar:</h3>
        <ol>
          <li>Haz clic en "Compartir producto"</li>
          <li>El botón debe cambiar a "¡Enlace copiado!"</li>
          <li>Pega (Ctrl+V) en un bloc de notas para verificar</li>
          <li>Prueba las "Más opciones"</li>
        </ol>
      </div>
    </div>
  );
};

export default TestCompartir;