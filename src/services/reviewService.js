const API_URL = "http://localhost:5000/api/reviews";

export const getReviewsByProduct = async (productId) => {
  const res = await fetch(`${API_URL}/${productId}`);
  if (!res.ok) throw new Error("Error al obtener reseñas");
  return res.json();
};

export const createReview = async (reviewData) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewData),
  });
  if (!res.ok) throw new Error("Error al crear reseña");
  return res.json();
};

export const getAverageRating = async (productId) => {
  const res = await fetch(`${API_URL}/average/${productId}`);
  if (!res.ok) throw new Error("Error al obtener promedio");
  return res.json();
};
