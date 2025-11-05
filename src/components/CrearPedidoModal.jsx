// components/CrearPedidoModal.jsx
import { useState, useEffect } from 'react';

function CrearPedidoModal({ isOpen, onClose, onPedidoCreado }) {
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [formData, setFormData] = useState({
    usuarioId: '',
    direccionEnvio: ''
  });
  const [cargando, setCargando] = useState(false);
  const [errorUsuarios, setErrorUsuarios] = useState('');
  const [errorProductos, setErrorProductos] = useState('');

  // Cargar usuarios y productos disponibles
  useEffect(() => {
    if (isOpen) {
      cargarUsuarios();
      cargarProductos();
      // Resetear estados al abrir
      setCarrito([]);
      setFormData({ usuarioId: '', direccionEnvio: '' });
    }
  }, [isOpen]);

  const cargarUsuarios = async () => {
    try {
      setErrorUsuarios('');
      const response = await fetch('http://localhost:5000/api/usuarios');
      
      if (response.status === 401) {
        throw new Error('No autorizado. Inicia sesión primero.');
      }
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // ✅ Manejar diferentes formatos de respuesta
      if (Array.isArray(data)) {
        setUsuarios(data);
      } else if (data.usuarios && Array.isArray(data.usuarios)) {
        setUsuarios(data.usuarios);
      } else {
        console.warn('Formato de usuarios inesperado:', data);
        setUsuarios([]);
      }
      
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setErrorUsuarios(error.message);
      setUsuarios([]);
      
      // ✅ Datos de prueba si la API falla
      const usuariosMock = [
        { _id: '1', nombreUsuario: 'sofia_admin', email: 'sofia@clickstock.com' },
        { _id: '2', nombreUsuario: 'carlos_cliente', email: 'carlos@example.com' },
        { _id: '3', nombreUsuario: 'ana_usuario', email: 'ana@example.com' }
      ];
      setUsuarios(usuariosMock);
    }
  };

  const cargarProductos = async () => {
    try {
      setErrorProductos('');
      const response = await fetch('http://localhost:5000/api/productos');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // ✅ Manejar diferentes formatos de respuesta
      if (Array.isArray(data)) {
        setProductos(data);
      } else if (data.productos && Array.isArray(data.productos)) {
        setProductos(data.productos);
      } else {
        console.warn('Formato de productos inesperado:', data);
        setProductos([]);
      }
      
    } catch (error) {
      console.error('Error cargando productos:', error);
      setErrorProductos(error.message);
      setProductos([]);
      
      // ✅ Datos de prueba si la API falla
      const productosMock = [
        { _id: '1', nombre: 'Mouse Gamer 8600 DPI', precio: 25.99, stock: 50 },
        { _id: '2', nombre: 'Teclado Mecánico RGB', precio: 89.99, stock: 30 },
        { _id: '3', nombre: 'Monitor 24" Full HD', precio: 199.99, stock: 15 },
        { _id: '4', nombre: 'Auriculares Inalámbricos', precio: 59.99, stock: 25 },
        { _id: '5', nombre: 'Webcam 1080p', precio: 45.50, stock: 40 }
      ];
      setProductos(productosMock);
    }
  };

  // Agregar producto al carrito
  const agregarAlCarrito = (producto) => {
    // Verificar stock
    if (producto.stock <= 0) {
      alert('❌ Producto sin stock disponible');
      return;
    }

    const existe = carrito.find(item => item.producto._id === producto._id);
    
    if (existe) {
      // Verificar que no exceda el stock
      if (existe.cantidad >= producto.stock) {
        alert(`❌ No hay suficiente stock. Máximo: ${producto.stock}`);
        return;
      }
      setCarrito(carrito.map(item =>
        item.producto._id === producto._id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setCarrito([...carrito, {
        producto,
        cantidad: 1,
        precioUnitario: producto.precio
      }]);
    }
  };

  // Remover producto del carrito
  const removerDelCarrito = (productoId) => {
    setCarrito(carrito.filter(item => item.producto._id !== productoId));
  };

  // Actualizar cantidad
  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1) {
      removerDelCarrito(productoId);
      return;
    }

    // Encontrar el producto para verificar stock
    const item = carrito.find(item => item.producto._id === productoId);
    if (item && nuevaCantidad > item.producto.stock) {
      alert(`❌ No hay suficiente stock. Máximo: ${item.producto.stock}`);
      return;
    }

    setCarrito(carrito.map(item =>
      item.producto._id === productoId
        ? { ...item, cantidad: nuevaCantidad }
        : item
    ));
  };

  // Calcular total
  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.precioUnitario * item.cantidad), 0);
  };

  // Crear pedido
  const crearPedido = async () => {
    if (!formData.usuarioId) {
      alert('❌ Selecciona un cliente');
      return;
    }

    if (carrito.length === 0) {
      alert('❌ Agrega al menos un producto al carrito');
      return;
    }

    setCargando(true);
    try {
      const pedidoData = {
        usuario: formData.usuarioId,
        productos: carrito.map(item => ({
          producto: item.producto._id,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario
        })),
        total: calcularTotal(),
        direccionEnvio: formData.direccionEnvio || 'Dirección no especificada',
        estado: 'pendiente'
      };

      console.log('Enviando pedido:', pedidoData);

      const response = await fetch('http://localhost:5000/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidoData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear pedido');
      }

      const nuevoPedido = await response.json();
      alert('✅ Pedido creado exitosamente');
      onPedidoCreado(nuevoPedido);
      
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al crear pedido: ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '10px',
        width: '90%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>➕ Crear Nuevo Pedido</h2>
          <button 
            onClick={onClose}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '24px', 
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ✕
          </button>
        </div>

        {/* Selección de Usuario */}
        <div style={{ marginBottom: '20px' }}>
          <label><strong>Seleccionar Cliente:</strong></label>
          <select 
            value={formData.usuarioId}
            onChange={(e) => setFormData({...formData, usuarioId: e.target.value})}
            style={{ 
              width: '100%', 
              padding: '10px', 
              marginTop: '5px', 
              border: '1px solid #ccc', 
              borderRadius: '5px' 
            }}
          >
            <option value="">Selecciona un cliente</option>
            {usuarios && usuarios.length > 0 ? (
              usuarios.map(usuario => (
                <option key={usuario._id} value={usuario._id}>
                  {usuario.nombreUsuario} - {usuario.email}
                </option>
              ))
            ) : (
              <option value="" disabled>
                {errorUsuarios ? '❌ Error cargando usuarios' : 'Cargando usuarios...'}
              </option>
            )}
          </select>
          {errorUsuarios && (
            <small style={{ color: 'orange', marginTop: '5px', display: 'block' }}>
              ⚠️ {errorUsuarios} - Usando datos de prueba
            </small>
          )}
        </div>

        {/* Dirección de Envío */}
        <div style={{ marginBottom: '20px' }}>
          <label><strong>Dirección de Envío:</strong></label>
          <input 
            type="text"
            value={formData.direccionEnvio}
            onChange={(e) => setFormData({...formData, direccionEnvio: e.target.value})}
            placeholder="Ingresa la dirección de envío completa"
            style={{ 
              width: '100%', 
              padding: '10px', 
              marginTop: '5px', 
              border: '1px solid #ccc', 
              borderRadius: '5px' 
            }}
          />
        </div>

        {/* Productos Disponibles */}
        <div style={{ marginBottom: '20px' }}>
          <h3>🛍️ Productos Disponibles</h3>
          {errorProductos && (
            <div style={{ 
              background: '#fff3cd', 
              border: '1px solid #ffeaa7', 
              padding: '10px', 
              borderRadius: '5px',
              marginBottom: '10px'
            }}>
              <small>⚠️ {errorProductos} - Usando datos de prueba</small>
            </div>
          )}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '10px',
            maxHeight: '200px',
            overflow: 'auto',
            padding: '10px',
            border: '1px solid #eee',
            borderRadius: '5px'
          }}>
            {productos && productos.length > 0 ? (
              productos.map(producto => (
                <div 
                  key={producto._id} 
                  style={{
                    border: '1px solid #ddd',
                    padding: '10px',
                    borderRadius: '5px',
                    cursor: producto.stock > 0 ? 'pointer' : 'not-allowed',
                    backgroundColor: producto.stock > 0 ? 'white' : '#f8f9fa',
                    opacity: producto.stock > 0 ? 1 : 0.6
                  }} 
                  onClick={() => producto.stock > 0 && agregarAlCarrito(producto)}
                >
                  <strong>{producto.nombre}</strong>
                  <p style={{ margin: '5px 0', fontWeight: 'bold', color: '#28a745' }}>
                    ${producto.precio}
                  </p>
                  <small style={{ color: producto.stock > 0 ? '#666' : '#dc3545' }}>
                    Stock: {producto.stock}
                  </small>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#666', gridColumn: '1 / -1' }}>
                {errorProductos ? '❌ Error cargando productos' : 'Cargando productos...'}
              </div>
            )}
          </div>
        </div>

        {/* Carrito */}
        <div style={{ marginBottom: '20px' }}>
          <h3>🛒 Carrito de Compra</h3>
          {carrito.length === 0 ? (
            <p style={{ 
              color: '#666', 
              textAlign: 'center', 
              padding: '20px',
              border: '2px dashed #ddd',
              borderRadius: '5px'
            }}>
              No hay productos en el carrito
            </p>
          ) : (
            <div>
              {carrito.map(item => (
                <div key={item.producto._id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '15px',
                  border: '1px solid #eee',
                  marginBottom: '8px',
                  borderRadius: '5px',
                  backgroundColor: 'white'
                }}>
                  <div style={{ flex: 1 }}>
                    <strong>{item.producto.nombre}</strong>
                    <p style={{ margin: '5px 0', color: '#666' }}>
                      ${item.precioUnitario} c/u
                    </p>
                    <small style={{ color: '#28a745' }}>
                      Stock disponible: {item.producto.stock}
                    </small>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button 
                        onClick={() => actualizarCantidad(item.producto._id, item.cantidad - 1)}
                        style={{ 
                          padding: '5px 12px', 
                          border: '1px solid #ccc',
                          background: 'white',
                          borderRadius: '3px',
                          cursor: 'pointer'
                        }}
                      >
                        -
                      </button>
                      <span style={{ 
                        padding: '5px 15px', 
                        border: '1px solid #ddd',
                        borderRadius: '3px',
                        minWidth: '40px',
                        textAlign: 'center'
                      }}>
                        {item.cantidad}
                      </span>
                      <button 
                        onClick={() => actualizarCantidad(item.producto._id, item.cantidad + 1)}
                        style={{ 
                          padding: '5px 12px', 
                          border: '1px solid #ccc',
                          background: 'white',
                          borderRadius: '3px',
                          cursor: 'pointer'
                        }}
                      >
                        +
                      </button>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: '80px' }}>
                      <strong>${(item.precioUnitario * item.cantidad).toFixed(2)}</strong>
                    </div>
                    <button 
                      onClick={() => removerDelCarrito(item.producto._id)}
                      style={{ 
                        background: '#dc3545', 
                        color: 'white', 
                        border: 'none', 
                        padding: '8px 12px', 
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Total */}
              <div style={{
                padding: '20px',
                background: '#f8f9fa',
                borderRadius: '5px',
                marginTop: '15px',
                textAlign: 'right',
                border: '2px solid #28a745'
              }}>
                <h3 style={{ margin: 0, color: '#28a745' }}>
                  Total: ${calcularTotal().toFixed(2)}
                </h3>
              </div>
            </div>
          )}
        </div>

        {/* Botones */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button 
            onClick={onClose}
            disabled={cargando}
            style={{ 
              padding: '12px 24px', 
              background: '#6c757d', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px',
              cursor: cargando ? 'not-allowed' : 'pointer',
              opacity: cargando ? 0.6 : 1
            }}
          >
            Cancelar
          </button>
          <button 
            onClick={crearPedido}
            disabled={cargando || carrito.length === 0 || !formData.usuarioId}
            style={{ 
              padding: '12px 24px', 
              background: (carrito.length === 0 || !formData.usuarioId) ? '#ccc' : '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px',
              cursor: (carrito.length === 0 || !formData.usuarioId || cargando) ? 'not-allowed' : 'pointer',
              opacity: cargando ? 0.6 : 1
            }}
          >
            {cargando ? '🔄 Creando...' : '✅ Crear Pedido'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CrearPedidoModal;