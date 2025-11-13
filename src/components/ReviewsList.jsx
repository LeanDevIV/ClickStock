import { useEffect, useState } from "react";
import { Card, Spinner, Alert } from "react-bootstrap";
import { getReviewsByProduct, getAverageRating } from "../services/reviewService.js";

const ReviewsList = ({ productId, refreshTrigger }) => {
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const cargarReseñas = async () => {
      try {
        setLoading(true);
        setError("");
        const [dataReviews, dataPromedio] = await Promise.all([
          getReviewsByProduct(productId),
          getAverageRating(productId),
        ]);

        setReviews(Array.isArray(dataReviews) ? dataReviews : []);
        setAverage(dataPromedio?.averageRating || 0);
        setMensaje("✅ Reseña enviada correctamente.");
        setTimeout(() => setMensaje(""), 3000);
      } catch {
        setError("❌ No se pudieron cargar las reseñas. Intenta más tarde.");
      } finally {
        setLoading(false);
      }
    };

    cargarReseñas();
  }, [productId, refreshTrigger]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="mt-4">
      <h4>Reseñas</h4>
      {mensaje && <Alert variant="success">{mensaje}</Alert>}
      <p>⭐ Promedio: <strong>{average}</strong>/5</p>

      {reviews.length === 0 ? (
        <p>No hay reseñas aún. ¡Sé el primero en comentar!</p>
      ) : (
        reviews.map((r) => (
          <Card key={r._id} className="mb-2">
            <Card.Body>
              <Card.Title>{r.user}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                ⭐ {r.rating} — {new Date(r.createdAt).toLocaleDateString()}
              </Card.Subtitle>
              <Card.Text>{r.comment}</Card.Text>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default ReviewsList;
