import { useForm, Controller } from "react-hook-form";
import { TextField, Button, MenuItem, Box, Typography } from "@mui/material";
import toast from "react-hot-toast";
import { createReview } from "../services/reviewService.js";

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
      await createReview({ ...data, productId });
      reset();
      toast.success("✅ Reseña enviada correctamente");
      onReviewAdded();
    } catch (error) {
      console.error(error);
      toast.error("❌ Error al enviar la reseña");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} mt={3}>
      <Typography variant="h6" mb={2}>Agregar una reseña</Typography>

      <Controller
        name="user"
        control={control}
        rules={{ required: "El nombre es obligatorio" }}
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

      <Controller
        name="rating"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Puntaje"
            select
            fullWidth
            margin="normal"
          >
            {[1,2,3,4,5].map((n) => (
              <MenuItem key={n} value={n}>{n} ⭐</MenuItem>
            ))}
          </TextField>
        )}
      />

      <Controller
        name="comment"
        control={control}
        rules={{ required: "El comentario es obligatorio" }}
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
