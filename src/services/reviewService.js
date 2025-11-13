import clientAxios from "../utils/clientAxios";

export const getReviewsByProduct = async (productId) => {
  const { data } = await clientAxios.get(`/reviews/${productId}`);
  return data;
};

export const createReview = async (reviewData) => {
  const { data } = await clientAxios.post("/reviews", reviewData);
  return data;
};

export const getAverageRating = async (productId) => {
  const { data } = await clientAxios.get(`/reviews/average/${productId}`);
  return data;
};
