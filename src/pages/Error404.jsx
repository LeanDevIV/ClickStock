import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

// Página 404 elegante para un comercio, usando React Bootstrap y toda la paleta de colores
export default function NotFound404() {
  const colors = {
    black: '#000000',
    whiteSmoke: '#F5F5F5',
    cornellRed: '#B91C1C',
    gold: '#D4AF37',
    onyx: '#404040',
  };

  return (
    <div
      style={{
        background: `linear-gradient(180deg, ${colors.black} 0%, ${colors.onyx} 100%)`,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        color: colors.whiteSmoke,
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card
              className="text-center shadow-lg p-5"
              style={{
                backgroundColor: colors.whiteSmoke,
                border: `2px solid ${colors.gold}`,
                borderRadius: '1.5rem',
              }}
            >
              <Card.Body>
                <h1
                  className="display-1 fw-bold mb-3"
                  style={{
                    color: colors.cornellRed,
                    textShadow: `2px 2px ${colors.gold}`,
                  }}
                >
                  404
                </h1>
                <h2 className="fw-semibold mb-3" style={{ color: colors.onyx }}>
                  Página no encontrada
                </h2>
                <p className="mb-4" style={{ color: colors.onyx }}>
                  Lo sentimos, no pudimos encontrar la página que buscas. Puede haber sido movida o ya no existe.
                </p>

                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <Link to="/">
                    <Button
                      variant="dark"
                      style={{
                        backgroundColor: colors.cornellRed,
                        border: `1px solid ${colors.gold}`,
                        color: '#fff',
                      }}
                      onMouseOver={(e) => (e.target.style.backgroundColor = colors.gold)}
                      onMouseOut={(e) => (e.target.style.backgroundColor = colors.cornellRed)}
                    >
                      Volver al inicio
                    </Button>
                  </Link>

                  <Link to="/productos">
                    <Button
                      variant="outline-dark"
                      style={{
                        borderColor: colors.cornellRed,
                        color: colors.cornellRed,
                        backgroundColor: colors.whiteSmoke,
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = colors.gold;
                        e.target.style.color = colors.black;
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = colors.whiteSmoke;
                        e.target.style.color = colors.cornellRed;
                      }}
                    >
                      Ver productos
                    </Button>
                  </Link>
                </div>

                <div
                  className="mt-5 p-3 rounded"
                  style={{
                    backgroundColor: colors.black,
                    color: colors.whiteSmoke,
                    border: `1px solid ${colors.gold}`,
                  }}
                >
                  <p className="mb-1 fw-semibold" style={{ color: colors.gold }}>
                    ¿Buscás algo especial?
                  </p>
                  <p className="small mb-0" style={{ color: colors.whiteSmoke }}>
                    Explora nuestras categorías premium con ofertas exclusivas.
                  </p>
                </div>

                <div className="mt-5">
                  <hr style={{ borderColor: colors.gold, opacity: 0.8 }} />
                  <p className="mt-3 small" style={{ color: colors.onyx }}>
                    © {new Date().getFullYear()} — Tienda Online | Inspirado en elegancia, urgencia y exclusividad.
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
