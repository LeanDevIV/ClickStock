import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Rating,
  Paper,
} from "@mui/material";
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

  const handleRatingChange = (_, value) => {
    setFormData({ ...formData, rating: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await createReview({ ...formData, productId });
      setFormData({ user: "", rating: 5, comment: "" });
      onReviewAdded();
    } catch {
      alert("Error al enviar la reseña");
    } finally {
      setLoading(false);
    }
  };

  const textFieldStyles = {
    mb: 2,
    input: { color: "white" },
    textarea: { color: "white" },

    "& label": { color: "#cccccc" },
    "& label.Mui-focused": { color: "#fff" },

    "& .MuiOutlinedInput-root": {
      transition: "0.25s ease",
      "& fieldset": {
        borderColor: "#696969",
        transition: "0.25s",
      },
      "&:hover fieldset": {
        borderColor: "#f5d76e",
        boxShadow: "0 0 8px #f5d76e",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#ffeb3b",
        boxShadow: "0 0 12px #ffeb3b",
      },
    },
  };

  return (
    <Paper
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 3,
        backgroundColor: "#121212",
        color: "white",
        boxShadow: "0 0 25px rgba(255, 255, 255, 0.08)",
        border: "1px solid rgba(255,255,255,0.15)",
      }}
      elevation={6}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        gutterBottom
        sx={{
          textShadow: "0 0 10px #ffffff77",
        }}
      >
        Agregar una reseña
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Tu nombre"
          name="user"
          fullWidth
          required
          sx={textFieldStyles}
          value={formData.user}
          onChange={handleChange}
        />

        <Box sx={{ mb: 2 }}>
          <Typography sx={{ color: "#fff", textShadow: "0 0 8px #ffffff55" }}>
            Puntaje
          </Typography>

          <Rating
            value={formData.rating}
            onChange={handleRatingChange}
            precision={1}
            sx={{
              "& .MuiRating-iconFilled": {
                color: "#ffeb3b",
                filter: "drop-shadow(0 0 4px #ffeb3b)",
              },
              "& .MuiRating-iconHover": {
                filter: "drop-shadow(0 0 6px #ffea00)",
              },
            }}
          />
        </Box>

        <TextField
          label="Comentario"
          name="comment"
          fullWidth
          required
          multiline
          rows={3}
          sx={textFieldStyles}
          value={formData.comment}
          onChange={handleChange}
        />

        <Button
          variant="contained"
          type="submit"
          disabled={loading}
          sx={{
            mt: 1,
            backgroundColor: "#f5d76e",
            color: "#000",
            fontWeight: "bold",
            transition: "0.25s",
            "&:hover": {
              backgroundColor: "#ffe27a",
              boxShadow: "0 0 12px #ffe27a",
            },
          }}
        >
          {loading ? "Enviando..." : "Enviar reseña"}
        </Button>
      </Box>
    </Paper>
  );
};

export default ReviewForm;
