import { useState } from "react";
import clientAxios from "../utils/clientAxios";
import { initMercadoPago } from "@mercadopago/sdk-react";

initMercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY, {
  locale: "es-AR",
});

export const useMercadoPago = () => {
  const [loading, setLoading] = useState(false);

  const crearPreferencia = async (productos, usuarioEmail, pedidoId) => {
    try {
      setLoading(true);

      const response = await clientAxios.post("/pagos/crear_preferencia", {
        productos: productos,
        usuario: {
          emailUsuario: usuarioEmail,
          pedidoId: pedidoId,
        },
      });

      if (response.data.init_point) {
        window.open(response.data.init_point, "_blank");
        return { success: true, url: response.data.init_point };
      } else {
        throw new Error("No se recibió init_point de Mercado Pago");
      }
    } catch (error) {
      let message = "Error inesperado. Intenta nuevamente.";

      if (error.response) {
        message = error.response.data.message || "No se pudo generar el pago";
      } else if (error.request) {
        message =
          "Error de conexión. Verifica que el servidor esté funcionando.";
      }

      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    crearPreferencia,
  };
};
