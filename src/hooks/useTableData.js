import { useState, useCallback } from "react";
import clientAxios from "../utils/clientAxios";
import { TABLE_CONFIG } from "../config/adminConfig";
import Swal from "sweetalert2";
import { useStore } from "./useStore";
import { subirArchivo } from "../services/uploadService";

export const useTableData = (section, options = {}) => {
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const config = TABLE_CONFIG[section];

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
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

  const handleSave = useCallback(
    async (id) => {
      try {
        if (config.validate) {
          const validationError = config.validate(editedData);
          if (validationError) {
            Swal.fire({
              icon: "error",
              title: "Error de validación",
              text: validationError,
              confirmButtonColor: "#D4AF37",
              background: "#1e1e1e",
              color: "#fff",
            });
            return;
          }
        }

        const endpoint = config.updateEndpoint.replace(":id", id);

        const dataToSend = { ...editedData };
        Object.keys(dataToSend).forEach((key) => {
          const value = dataToSend[key];
          if (
            value &&
            typeof value === "object" &&
            !Array.isArray(value) &&
            !(value instanceof File) &&
            (value._id || value.id)
          ) {
            dataToSend[key] = value._id || value.id;
          }
        });

        await clientAxios.put(endpoint, dataToSend);

        setData((prev) =>
          prev.map((item) => {
            if (item._id === id) {
              return { ...item, ...editedData };
            }
            return item;
          })
        );

        setEditingId(null);
        setEditedData({});
      } catch (err) {
        const responseData = err.response?.data;

        if (responseData?.errors) {
          const errorMessages = responseData.errors
            .map((e) => `<li>${e.message}</li>`)
            .join("");

          Swal.fire({
            icon: "error",
            title: "Errores de validación",
            html: `<ul style="text-align: left;">${errorMessages}</ul>`,
            confirmButtonColor: "#D4AF37",
            background: "#1e1e1e",
            color: "#fff",
          });
        } else {
          const message =
            responseData?.message || "Error al guardar: " + err.message;
          Swal.fire({
            icon: "error",
            title: "Error",
            text: message,
            confirmButtonColor: "#D4AF37",
            background: "#1e1e1e",
            color: "#fff",
          });
        }
        console.error("Error saving data:", err);
      }
    },
    [editedData, config]
  );

  const handleRestore = useCallback(
    async (id) => {
      if (!config.restoreEndpoint) {
        setError("No se puede restaurar este tipo de elemento");
        return;
      }

      const result = await Swal.fire({
        title: "¿Restaurar elemento?",
        text: "El elemento volverá a estar activo",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#D4AF37",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, restaurar",
        cancelButtonText: "Cancelar",
        background: "#1e1e1e",
        color: "#fff",
      });
      if (!result.isConfirmed) {
        return;
      }

      try {
        const endpoint = config.restoreEndpoint.replace(":id", id);
        const { data: responseData } = await clientAxios.patch(endpoint);

        const restoredItem =
          responseData.producto ||
          responseData.usuario ||
          responseData.promocion ||
          responseData.review ||
          responseData.contacto ||
          responseData;

        setData((prev) =>
          prev.map((item) =>
            item._id === id
              ? restoredItem || {
                  ...item,
                  isDeleted: false,
                  ...(section === "Productos"
                    ? { disponible: true, deletedBy: null, deletedAt: null }
                    : {}),
                }
              : item
          )
        );

        Swal.fire({
          title: "¡Restaurado!",
          text: "El elemento ha sido restaurado correctamente",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          iconColor: "#D4AF37",
          background: "#1e1e1e",
          color: "#fff",
        });
      } catch (err) {
        setError("Error al restaurar: " + err.message);
        console.error("Error restoring:", err);
      }
    },
    [section, config.restoreEndpoint]
  );

  const handleSoftDelete = useCallback(
    async (id) => {
      if (section === "Usuarios") {
        const currentUser = useStore.getState().user;
        console.log("Current user ID:", currentUser?._id, "Target ID:", id);
        if (currentUser && (currentUser._id === id || currentUser.id === id)) {
          Swal.fire({
            icon: "question",
            title: "¿En serio?",
            html: `
    <div style="text-align: center;">
      <p>Estás a punto de realizar un <strong>auto-borrado</strong>.</p>
      <p style="color: #666; font-style: italic;">
        "La auto-preservación es la primera ley de la naturaleza."
      </p>
    </div>
  `,
            focusConfirm: false,
            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Vale, me quedo',
            confirmButtonColor: "#4CAF50",
            showClass: {
              popup: "animate__animated animate__fadeInDown",
            },
            hideClass: {
              popup: "animate__animated animate__fadeOutUp",
            },
            footer:
              '<a target="_blank" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" style="color: #D4AF37;">¿Necesitas ayuda con tu cuenta?</a>',
            background: "#1e1e1e",
            color: "#fff",
          });
          return;
        }
      }

      try {
        const endpoint =
          config.softDeleteEndpoint?.replace(":id", id) ||
          config.updateEndpoint.replace(":id", id);

        const { data: productoActualizado } = await clientAxios.delete(
          endpoint
        );

        const currentUser = useStore.getState().user;

        setData((prev) =>
          prev.map((item) =>
            item._id === id
              ? productoActualizado.producto || {
                  ...item,
                  isDeleted: true,
                  deletedBy: currentUser,
                  deletedAt: new Date(),
                  ...(section === "Productos" ? { disponible: false } : {}),
                }
              : item
          )
        );
      } catch (err) {
        const message =
          err.response?.data?.message || "Error al eliminar: " + err.message;
        Swal.fire({
          icon: "error",
          title: "Error",
          text: message,
          confirmButtonColor: "#D4AF37",
        });
        console.error("Error soft deleting:", err);
      }
    },
    [config.softDeleteEndpoint, config.updateEndpoint, section]
  );

  const handleHardDelete = useCallback(
    async (id) => {
      if (section === "Usuarios") {
        const currentUser = useStore.getState().user;
        console.log(
          "Hard delete - Current user ID:",
          currentUser?._id,
          "Target ID:",
          id
        );
        if (currentUser && (currentUser._id === id || currentUser.id === id)) {
          Swal.fire({
            icon: "error",
            title: "Acción no permitida",
            text: "No puedes eliminar tu propia cuenta",
            confirmButtonColor: "#D4AF37",
            background: "#1e1e1e",
            color: "#fff",
          });
          return;
        }
      }

      try {
        const endpoint = config.deleteEndpoint?.replace(":id", id);
        if (!endpoint) {
          throw new Error(
            "No hay endpoint configurado para eliminar permanentemente"
          );
        }
        await clientAxios.delete(endpoint);

        setData((prev) => prev.filter((item) => item._id !== id));
      } catch (err) {
        const message =
          err.response?.data?.message ||
          "Error al eliminar permanentemente: " + err.message;
        Swal.fire({
          icon: "error",
          title: "Error",
          text: message,
          confirmButtonColor: "#D4AF37",
          background: "#1e1e1e",
          color: "#fff",
        });
        console.error("Error hard deleting:", err);
      }
    },
    [config.deleteEndpoint, section]
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

    onEdit: handleEdit,
    handleSave,
    handleCancel,
    handleFieldChange,
    handleRestore,
    handleSoftDelete,
    handleHardDelete,
    handleCreate: async (newItem) => {
      try {
        let itemToCreate = { ...newItem };

        const fileFields = Object.keys(newItem).filter(
          (key) => newItem[key] instanceof File
        );

        if (fileFields.length > 0) {
          Swal.fire({
            title: "Subiendo archivos...",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
            background: "#1e1e1e",
            color: "#fff",
          });

          for (const field of fileFields) {
            const file = newItem[field];

            const directorio = section.toLowerCase();
            const url = await subirArchivo(file, directorio);

            if (field === "imagenes") {
              itemToCreate[field] = [url];
            } else {
              itemToCreate[field] = url;
            }
          }
        }

        const endpoint = config.endpoint;
        const { data: createdItem } = await clientAxios.post(
          endpoint,
          itemToCreate
        );

        setData((prev) => [...prev, createdItem]);
        Swal.fire({
          icon: "success",
          title: "¡Creado!",
          text: "El elemento ha sido creado correctamente",
          confirmButtonColor: "#D4AF37",
          background: "#1e1e1e",
          color: "#fff",
        });
      } catch (err) {
        const responseData = err.response?.data;

        if (responseData?.errors) {
          const errorMessages = responseData.errors
            .map((e) => `<li>${e.message}</li>`)
            .join("");

          Swal.fire({
            icon: "error",
            title: "Errores de validación",
            html: `<ul style="text-align: left;">${errorMessages}</ul>`,
            confirmButtonColor: "#D4AF37",
            background: "#1e1e1e",
            color: "#fff",
          });
        } else {
          const message =
            responseData?.message || "Error al crear: " + err.message;
          Swal.fire({
            icon: "error",
            title: "Error",
            text: message,
            confirmButtonColor: "#D4AF37",
            background: "#1e1e1e",
            color: "#fff",
          });
        }
        console.error("Error creating item:", err);
      }
    },
    handleUpdateImage: async (id, field, value, directory) => {
      try {
        let url = value;

        if (value instanceof File) {
          Swal.fire({
            title: "Subiendo imagen...",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
            background: "#1e1e1e",
            color: "#fff",
          });

          url = await subirArchivo(value, directory);
        }

        const dataToUpdate = {};
        if (field === "imagenes") {
          dataToUpdate[field] = [url];
        } else {
          dataToUpdate[field] = url;
        }

        const endpoint = config.updateEndpoint.replace(":id", id);
        await clientAxios.put(endpoint, dataToUpdate);

        setData((prev) =>
          prev.map((item) => {
            if (item._id === id) {
              return { ...item, ...dataToUpdate };
            }
            return item;
          })
        );

        Swal.fire({
          icon: "success",
          title: "¡Imagen actualizada!",
          showConfirmButton: false,
          timer: 1500,
          background: "#1e1e1e",
          color: "#fff",
        });
      } catch (err) {
        console.error("Error updating image:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo actualizar la imagen",
          confirmButtonColor: "#D4AF37",
          background: "#1e1e1e",
          color: "#fff",
        });
      }
    },
    setEditingId,
  };
};
