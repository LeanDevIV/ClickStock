import { useEffect, useState } from "react";
import { Button, Container, Card, Spinner } from "react-bootstrap";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import axios from "axios";

const MercadoPago = () => {
  const [preferenceId, setPreferenceId] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(false);

  useEffect(() => {
    initMercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY);
  }, []);

  const handleCheckout = async () => {
    try {
      setLoadingPayment(true);

      const response = await axios.post(
        "http://localhost:5000/api/payment/create_preference",
        {
          items: [
            { title: "Auriculares Bluetooth", cantidad: 1, precio: 25000 },
            { title: "Teclado Mecánico RGB", cantidad: 1, precio: 45000 },
            { title: "Mouse Gamer Inalámbrico", cantidad: 2, precio: 18000 },
          ],
          user: { email: "test_user@example.com" },
          returnUrl: `${import.meta.env.VITE_FRONTEND_URL}/payments`,
        }
      );
      setPreferenceId(response.data.id);
    } catch (error) {
      console.error("Error creando preferencia:", error);
      alert("Ocurrió un error al generar el pago. Intenta nuevamente.");
    } finally {
      setLoadingPayment(false);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #007bff 0%, #6610f2 100%)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
      }}
    >
      <Container
        className="d-flex justify-content-center align-items-center flex-column"
        style={{
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <Card
          className="shadow-lg text-center"
          style={{
            borderRadius: "20px",
            padding: "2rem",
            width: "100%",
            backgroundColor: "white",
          }}
        >
          <Card.Body>
            <h3 className="fw-bold mb-3" style={{ color: "#343a40" }}>
              💳 Simulación de Pago
            </h3>
            <p style={{ color: "#6c757d" }}>
              Este es un entorno de prueba para generar una preferencia de pago
              con tres productos simulados.
            </p>

            <div
              style={{
                marginTop: "2rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {!preferenceId ? (
                loadingPayment ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted">Generando preferencia...</p>
                  </div>
                ) : (
                  <Button
                    className="checkout-button"
                    size="lg"
                    onClick={handleCheckout}
                    style={{
                      backgroundColor: "#007bff",
                      border: "none",
                      borderRadius: "12px",
                      padding: "0.75rem 2rem",
                      fontWeight: "600",
                      transition: "0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#0056b3")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#007bff")
                    }
                  >
                    Proceder al Pago
                  </Button>
                )
              ) : (
                <div
                  className="wallet-wrapper mt-4"
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Wallet initialization={{ preferenceId }} />
                </div>
              )}
            </div>

            <div className="mt-4 text-muted" style={{ fontSize: "0.9rem" }}>
              <i className="bi bi-shield-check me-2"></i> Pago 100% seguro con
              MercadoPago
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default MercadoPago;
