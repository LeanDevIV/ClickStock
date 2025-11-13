import { useForm } from "react-hook-form";
import { Button, Form } from "react-bootstrap";
import { createReview } from "../services/reviewService.js";

const ReviewForm = ({ productId, onReviewAdded }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      user: "",
      rating: 5,
      comment: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await createReview({ ...data, productId });
      reset(); // limpia el formulario
      onReviewAdded();
    } catch (error) {
      alert("Error al enviar la reseña");
      console.error(error);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="mt-4">
      <h5>Agregar una reseña</h5>

      <Form.Group className="mb-2">
        <Form.Label>Tu nombre</Form.Label>
        <Form.Control
          type="text"
          {...register("user", { required: "El nombre es obligatorio" })}
          isInvalid={!!errors.user}
        />
        <Form.Control.Feedback type="invalid">
          {errors.user?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Puntaje</Form.Label>
        <Form.Select {...register("rating", { required: true })}>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n} ⭐
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Comentario</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          {...register("comment", { required: "El comentario es obligatorio" })}
          isInvalid={!!errors.comment}
        />
        <Form.Control.Feedback type="invalid">
          {errors.comment?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Enviar reseña"}
      </Button>
    </Form>
  );
};

export default ReviewForm;
