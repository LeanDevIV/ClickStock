import { useState, useCallback } from "react";
import clientAxios from "../utils/clientAxios";
import { TABLE_CONFIG } from "../config/adminConfig";

export const useTableData = (section, options = {}) => {
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
      // Construir query params según opciones (admin quiere ver también eliminados/no disponibles)
      const { includeDeleted = false, includeUnavailable = false } = options;
      const params = new URLSearchParams();
      if (includeDeleted) params.append("includeDeleted", "true");
      if (includeUnavailable) params.append("includeUnavailable", "true");

      const endpoint = params.toString()
        ? `${config.endpoint}?${params.toString()}`
        : config.endpoint;

      const { data: responseData } = await clientAxios.get(endpoint);
      setData(responseData);
    } catch (err) {
      setError("Error al cargar los datos: " + err.message);
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, [config.endpoint, options]);

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
  const handleSave = useCallback(
    async (id) => {
      try {
        const endpoint = config.updateEndpoint.replace(":id", id);
        await clientAxios.put(endpoint, editedData);

        setData((prev) =>
          prev.map((item) => (item._id === id ? editedData : item))
        );

        setEditingId(null);
        setEditedData({});
      } catch (err) {
        setError("Error al guardar: " + err.message);
        console.error("Error saving data:", err);
      }
    },
    [editedData, config.updateEndpoint]
  );

  // Restaurar elemento eliminado
  const handleRestore = useCallback(
    async (id) => {
      if (!config.restoreEndpoint) {
        setError("No se puede restaurar este tipo de elemento");
        return;
      }

      try {
        const endpoint = config.restoreEndpoint.replace(":id", id);
        const { data: productoRestaurado } = await clientAxios.patch(endpoint);

        setData((prev) =>
          prev.map((item) =>
            item._id === id
              ? productoRestaurado.producto || {
                  ...item,
                  isDeleted: false,
                  ...(section === "Productos"
                    ? { disponible: true, deletedBy: null, deletedAt: null }
                    : {}),
                }
              : item
          )
        );

      } catch (err) {
        setError("Error al restaurar: " + err.message);
        console.error("Error restoring:", err);
      }
    },
    [section, config.restoreEndpoint]
  );

  // Soft Delete (marcar como eliminado)
  const handleSoftDelete = useCallback(
    async (id) => {
      try {
        const endpoint =
          config.softDeleteEndpoint?.replace(":id", id) ||
          config.updateEndpoint.replace(":id", id);
        // Usar DELETE para soft delete (el backend captura el usuario desde el token)
        const { data: productoActualizado } = await clientAxios.put(endpoint);

        // Usar la respuesta del servidor que incluye deletedBy y deletedAt
        setData((prev) =>
          prev.map((item) =>
            item._id === id
              ? productoActualizado.producto || {
                  ...item,
                  isDeleted: true,
                  ...(section === "Productos" ? { disponible: false } : {}),
                }
              : item
          )
        );
      } catch (err) {
        setError("Error al eliminar: " + err.message);
        console.error("Error soft deleting:", err);
      }
    },
    [config.softDeleteEndpoint, config.updateEndpoint, section]
  );

  // Hard Delete (eliminar permanentemente)
  const handleHardDelete = useCallback(
    async (id) => {
      try {
        // Usar deleteEndpoint configurado en TABLE_CONFIG
        const endpoint = config.deleteEndpoint?.replace(":id", id);
        if (!endpoint) {
          throw new Error(
            "No hay endpoint configurado para eliminar permanentemente"
          );
        }
        await clientAxios.delete(endpoint);

        setData((prev) => prev.filter((item) => item._id !== id));

      } catch (err) {
        setError("Error al eliminar permanentemente: " + err.message);
        console.error("Error hard deleting:", err);
      }
    },
    [config.deleteEndpoint]
  );

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
    handleSoftDelete,
    handleHardDelete,
    setEditingId,
  };
};
