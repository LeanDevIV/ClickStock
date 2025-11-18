import { useState, useCallback } from 'react';
import clientAxios from '../utils/clientAxios';
import { TABLE_CONFIG } from '../config/adminConfig';

export const useTableData = (section) => {
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const config = TABLE_CONFIG[section];

  // Fetch de datos
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: responseData } = await clientAxios.get(config.endpoint);
      setData(responseData);
    } catch (err) {
      setError('Error al cargar los datos: ' + err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [config.endpoint]);

  // Manejo de edición
  const handleEdit = useCallback((item) => {
    setEditingId(item._id);
    setEditedData({ ...item });
  }, []);

  const handleCancel = useCallback(() => {
    setEditingId(null);
    setEditedData({});
  }, []);

  const handleFieldChange = useCallback((field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Guardar cambios
  const handleSave = useCallback(async (id) => {
    try {
      const endpoint = config.updateEndpoint.replace(':id', id);
      await clientAxios.put(endpoint, editedData);
      
      setData((prev) =>
        prev.map((item) => (item._id === id ? editedData : item))
      );
      
      setEditingId(null);
      setEditedData({});
      console.log('Datos guardados:', editedData);
    } catch (err) {
      setError('Error al guardar: ' + err.message);
      console.error('Error saving data:', err);
    }
  }, [editedData, config.updateEndpoint]);

  // Restaurar elemento eliminado
  const handleRestore = useCallback(async (id) => {
    if (!config.restoreEndpoint) {
      setError('No se puede restaurar este tipo de elemento');
      return;
    }

    try {
      const endpoint = config.restoreEndpoint.replace(':id', id);
      await clientAxios.patch(endpoint);
      
      setData((prev) =>
        prev.map((item) =>
          item._id === id
            ? { ...item, isDeleted: false, ...(section === 'Productos' ? { disponible: true } : {}) }
            : item
        )
      );
      
      console.log('Elemento restaurado:', id);
    } catch (err) {
      setError('Error al restaurar: ' + err.message);
      console.error('Error restoring:', err);
    }
  }, [section, config.restoreEndpoint]);

  return {
    data,
    setData,
    editingId,
    editedData,
    loading,
    error,
    fetchData,
    handleEdit,
    // backward-compatible alias: algunas partes del código esperan `onEdit`
    onEdit: handleEdit,
    handleSave,
    handleCancel,
    handleFieldChange,
    handleRestore,
    setEditingId,
  };
};
