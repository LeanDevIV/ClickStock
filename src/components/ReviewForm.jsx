import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { createReview } from "../services/reviewService.js";

const ReviewForm = ({ productId, onReviewAdded }) => {
  const [formData, setFormData] = useState({
    user: "",
    rating: 5,
    comment: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createReview({ ...formData, productId });
      setFormData({ user: "", rating: 5, comment: "" });
      onReviewAdded(); // para refrescar lista
    } catch (err) {
      console.error(err);
      alert("Error al enviar la reseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mt-4">
      <h5>Agregar una reseña</h5>
      <Form.Group className="mb-2">
        <Form.Label>Tu nombre</Form.Label>
        <Form.Control
          type="text"
          name="user"
          value={formData.user}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Puntaje</Form.Label>
        <Form.Select name="rating" value={formData.rating} onChange={handleChange}>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n} ⭐</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Comentario</Form.Label>
        <Form.Control
          as="textarea"
          name="comment"
          rows={3}
          value={formData.comment}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Button type="submit" disabled={loading}>
        {loading ? "Enviando..." : "Enviar reseña"}
      </Button>
    </Form>
  );
};

export default ReviewForm;
