import { useEffect, useState } from "react";
import { Card, Spinner } from "react-bootstrap";
import { getReviewsByProduct, getAverageRating } from "../services/reviewService.js";

const ReviewsList = ({ productId, refreshTrigger }) => {
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const [reviewsData, avgData] = await Promise.all([
          getReviewsByProduct(productId),
          getAverageRating(productId),
        ]);
        setReviews(reviewsData);
        setAverage(avgData.averageRating || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, [productId, refreshTrigger]);

  if (loading) return <Spinner animation="border" />;

  return (
    <div className="mt-4">
      <h4>Reseñas</h4>
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
