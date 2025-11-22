import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Alert,
  Typography,
  Box,
} from "@mui/material";
import {
  getReviewsByProduct,
  getAverageRating,
} from "../services/reviewService.js";

const ReviewsList = ({ productId, refreshTrigger }) => {
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      } catch {
        setError("❌ No se pudieron cargar las reseñas. Intenta más tarde.");
      } finally {
        setLoading(false);
      }
    };

    cargarReseñas();
  }, [productId, refreshTrigger]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Reseñas
      </Typography>
      <Typography variant="body1" gutterBottom>
        ⭐ Promedio: <strong>{average}</strong>/5
      </Typography>

      {reviews.length === 0 ? (
        <Typography variant="body2">
          No hay reseñas aún. ¡Sé el primero en comentar!
        </Typography>
      ) : (
        reviews.map((r) => (
          <Card key={r._id} sx={{ mb: 2 }}>
            <CardHeader
              title={r.user}
              subheader={`⭐ ${r.rating} — ${new Date(
                r.createdAt
              ).toLocaleDateString()}`}
            />
            <CardContent>
              <Typography variant="body2">{r.comment}</Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default ReviewsList;
