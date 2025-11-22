import { useForm, Controller } from "react-hook-form";
import { TextField, Button, MenuItem, Box, Typography } from "@mui/material";
import toast from "react-hot-toast";
import { createReview } from "../services/reviewService.js";

const badWords = ["puta", "puto", "mierda", "fuck", "pedo"];
const onlyValidCharsRegex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,!?\s-]+$/;
const noEmojiRegex = /^[^\p{Emoji}]+$/u;
const noRepetitionsRegex = /(.)\1{3,}/;

const ReviewForm = ({ productId, onReviewAdded }) => {
  const { handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      user: "",
      rating: 5,
      comment: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await createReview({
        ...data,
        user: data.user.trim(),
        comment: data.comment.trim(),
        productId,
      });

      reset();
      toast.success("Reseña enviada correctamente");
      onReviewAdded();
    } catch (error) {
      console.error(error);
      toast.error("Error al enviar la reseña");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} mt={3}>
      <Typography variant="h6" mb={2}>Agregar una reseña</Typography>

      {/* Nombre */}
      <Controller
        name="user"
        control={control}
        rules={{
          required: "El nombre es obligatorio",
          minLength: { value: 3, message: "Mínimo 3 caracteres" },
          maxLength: { value: 25, message: "Máximo 25 caracteres" },
          validate: (v) => {
            const value = v.trim();

            if (!onlyValidCharsRegex.test(value)) return "Caracteres inválidos";
            if (!noEmojiRegex.test(value)) return "No se permiten emojis";
            if (badWords.some((b) => value.toLowerCase().includes(b)))
              return "Lenguaje inapropiado";
            if (noRepetitionsRegex.test(value))
              return "No repitas caracteres más de 3 veces";

            return true;
          }
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Tu nombre"
            fullWidth
            margin="normal"
            error={!!errors.user}
            helperText={errors.user?.message}
          />
        )}
      />

      {/* Rating */}
      <Controller
        name="rating"
        control={control}
        rules={{
          required: "El puntaje es obligatorio",
          min: { value: 1, message: "El mínimo es 1" },
          max: { value: 5, message: "El máximo es 5" }
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Puntaje"
            select
            fullWidth
            margin="normal"
            error={!!errors.rating}
            helperText={errors.rating?.message}
          >
            {[1,2,3,4,5].map((n) => (
              <MenuItem key={n} value={n}>{n} ⭐</MenuItem>
            ))}
          </TextField>
        )}
      />

      {/* Comentario */}
      <Controller
        name="comment"
        control={control}
        rules={{
          required: "El comentario es obligatorio",
          minLength: { value: 10, message: "Mínimo 10 caracteres" },
          maxLength: { value: 300, message: "Máximo 300 caracteres" },
          validate: (v) => {
            const value = v.trim();

            if (!onlyValidCharsRegex.test(value))
              return "Caracteres inválidos";
            if (!noEmojiRegex.test(value))
              return "No se permiten emojis";
            if (noRepetitionsRegex.test(value))
              return "No repitas caracteres más de 3 veces";
            if (badWords.some((b) => value.toLowerCase().includes(b)))
              return "Lenguaje inapropiado";

            return true;
          }
        }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Comentario"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            error={!!errors.comment}
            helperText={errors.comment?.message}
          />
        )}
      />

      <Button type="submit" variant="contained" color="error" disabled={isSubmitting} sx={{ mt: 2 }}>
        {isSubmitting ? "Enviando..." : "Enviar reseña"}
      </Button>
    </Box>
  );
};

export default ReviewForm;
