// components/PedidosList.jsx
import { useState, useEffect } from 'react';
import CrearPedidoModal from './CrearPedidoModal.jsx';

function PedidosList() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('todos');

  // Obtener pedidos
  useEffect(() => {
    obtenerPedidos();
  }, []);

  const obtenerPedidos = async () => {
    try {
      setCargando(true);
      const response = await fetch('http://localhost:5000/api/pedidos');
      
      if (!response.ok) {
        throw new Error('Error al cargar pedidos');
      }
      
      const data = await response.json();
      setPedidos(data.pedidos || data);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setCargando(false);
    }
  };

  // Actualizar estado del pedido
  const actualizarEstadoPedido = async (pedidoId, nuevoEstado) => {
    try {
      console.log('Actualizando estado:', pedidoId, nuevoEstado);
      
      const response = await fetch(`http://localhost:5000/api/pedidos/${pedidoId}/estado`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          estado: nuevoEstado 
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar');
      }
      
      const pedidoActualizado = await response.json();
      
      // Actualiza solo el estado en la lista local
      setPedidos(pedidos.map(pedido => 
        pedido._id === pedidoId ? { ...pedido, estado: nuevoEstado } : pedido
      ));
      
      alert(`✅ Estado actualizado a: ${nuevoEstado}`);
    } catch (err) {
      console.error('Error completo:', err);
      alert('❌ Error: ' + err.message);
    }
  };

  // Eliminar pedido
  const eliminarPedido = async (pedidoId) => {
    if (!confirm('¿Estás seguro de eliminar este pedido?')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/pedidos/${pedidoId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Error al eliminar');
      
      setPedidos(pedidos.filter(pedido => pedido._id !== pedidoId));
      alert('✅ Pedido eliminado correctamente');
    } catch (err) {
      alert('❌ Error: ' + err.message);
    }
  };

  // Cuando se crea un nuevo pedido
  const manejarPedidoCreado = (nuevoPedido) => {
    setPedidos([nuevoPedido, ...pedidos]);
    setModalAbierto(false);
  };

  // Filtrar pedidos por estado
  const pedidosFiltrados = filtroEstado === 'todos' 
    ? pedidos 
    : pedidos.filter(pedido => pedido.estado === filtroEstado);

  // Render estados
  if (cargando) return <div>🔄 Cargando pedidos...</div>;
  if (error) return <div>❌ Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>📦 Gestión de Pedidos</h1>
      
      {/* Controles superiores */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        {/* Botón crear nuevo pedido */}
        <button 
          onClick={() => setModalAbierto(true)}
          style={{ 
            padding: '10px 20px', 
            background: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ➕ Crear Nuevo Pedido
        </button>

        {/* Filtro por estado */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label><strong>Filtrar por estado:</strong></label>
          <select 
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            style={{ 
              padding: '8px 12px', 
              border: '1px solid #ccc', 
              borderRadius: '5px' 
            }}
          >
            <option value="todos">Todos los estados</option>
            <option value="pendiente">⏳ Pendiente</option>
            <option value="procesando">🔄 Procesando</option>
            <option value="enviado">🚚 Enviado</option>
            <option value="entregado">📦 Entregado</option>
            <option value="cancelado">❌ Cancelado</option>
          </select>
        </div>

        {/* Contador */}
        <div style={{ color: '#666', fontWeight: 'bold' }}>
          {pedidosFiltrados.length} de {pedidos.length} pedidos
        </div>
      </div>

      {/* Modal de crear pedido */}
      <CrearPedidoModal 
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onPedidoCreado={manejarPedidoCreado}
      />

      {/* Lista de pedidos */}
      {pedidosFiltrados.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#666',
          border: '2px dashed #ddd',
          borderRadius: '10px'
        }}>
          <h3>📭 No hay pedidos</h3>
          <p>No se encontraron pedidos {filtroEstado !== 'todos' ? `con estado "${filtroEstado}"` : ''}</p>
          {filtroEstado !== 'todos' && (
            <button 
              onClick={() => setFiltroEstado('todos')}
              style={{ 
                marginTop: '10px',
                padding: '8px 16px', 
                background: '#17a2b8', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Ver todos los pedidos
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {pedidosFiltrados.map(pedido => (
            <div 
              key={pedido._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#f9f9f9',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
                {/* Información del pedido */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0 }}>Pedido ID: {pedido._id?.slice(-6)}...</h3>
                    <span 
                      style={{ 
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: 'white',
                        backgroundColor: 
                          pedido.estado === 'entregado' ? '#28a745' :
                          pedido.estado === 'cancelado' ? '#dc3545' :
                          pedido.estado === 'enviado' ? '#17a2b8' :
                          pedido.estado === 'procesando' ? '#ffc107' : '#6c757d'
                      }}
                    >
                      {pedido.estado}
                    </span>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '15px' }}>
                    <div>
                      <strong>👤 Cliente:</strong>
                      <p style={{ margin: '5px 0' }}>{pedido.usuario?.nombreUsuario || pedido.usuario?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <strong>💰 Total:</strong>
                      <p style={{ margin: '5px 0', fontWeight: 'bold', color: '#28a745' }}>${pedido.total}</p>
                    </div>
                    <div>
                      <strong>📅 Fecha:</strong>
                      <p style={{ margin: '5px 0' }}>{new Date(pedido.fechaCreacion).toLocaleDateString()}</p>
                    </div>
                    {pedido.direccionEnvio && (
                      <div>
                        <strong>🏠 Dirección:</strong>
                        <p style={{ margin: '5px 0', fontSize: '14px' }}>{pedido.direccionEnvio}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Productos */}
                  <div>
                    <strong>🛍️ Productos:</strong>
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                      gap: '8px',
                      marginTop: '8px'
                    }}>
                      {pedido.productos?.map((item, index) => (
                        <div 
                          key={index}
                          style={{
                            padding: '8px',
                            background: 'white',
                            border: '1px solid #eee',
                            borderRadius: '5px',
                            fontSize: '14px'
                          }}
                        >
                          <strong>{item.producto?.nombre || 'Producto'}</strong>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                            <span>Cantidad: {item.cantidad}</span>
                            {item.precioUnitario && <span>${item.precioUnitario} c/u</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Controles CRUD */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '200px' }}>
                  {/* Selector de estado */}
                  <div>
                    <label><strong>Cambiar estado:</strong></label>
                    <select 
                      value={pedido.estado} 
                      onChange={(e) => actualizarEstadoPedido(pedido._id, e.target.value)}
                      style={{ 
                        width: '100%', 
                        padding: '8px', 
                        borderRadius: '4px', 
                        border: '1px solid #ccc',
                        marginTop: '5px',
                        backgroundColor: 'white'
                      }}
                    >
                      <option value="pendiente">⏳ Pendiente</option>
                      <option value="procesando">🔄 Procesando</option>
                      <option value="enviado">🚚 Enviado</option>
                      <option value="entregado">📦 Entregado</option>
                      <option value="cancelado">❌ Cancelado</option>
                    </select>
                  </div>
                  
                  {/* Botones de acción */}
                  <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                    <button 
                      onClick={() => {/* Lógica para editar detalles */}}
                      style={{ 
                        padding: '8px 12px', 
                        background: '#17a2b8', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        cursor: 'pointer',
                        flex: 1,
                        fontSize: '14px'
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      onClick={() => eliminarPedido(pedido._id)}
                      style={{ 
                        padding: '8px 12px', 
                        background: '#dc3545', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        cursor: 'pointer',
                        flex: 1,
                        fontSize: '14px'
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PedidosList;