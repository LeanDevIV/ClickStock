// src/pages/ProductDetail.jsx
import { Container, Card } from "react-bootstrap";
import ReviewForm from "../components/ReviewForm";
import ReviewsList from "../components/ReviewsList";
import { useState } from "react";
import "../css/productDetail.css"; // 👈 importa los estilos

const ProductDetail = () => {
  const product = {
    _id: "6728a1e1c2b3d6f49c3d8b12",
    name: "Camiseta React Dev",
    price: 59.99,
    description: "Camiseta oficial para desarrolladores React 🧠",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
  };

  const [refresh, setRefresh] = useState(0);
  const handleReviewAdded = () => setRefresh((prev) => prev + 1);

  return (
    <Container className="mt-4">
      <div className="product-detail-container d-flex flex-column flex-md-row align-items-center">
        <img
          src={product.image}
          alt={product.name}
          className="product-detail-image"
        />
        <div className="product-info">
          <h3>{product.name}</h3>
          <p className="price">${product.price}</p>
          <p>{product.description}</p>
        </div>
      </div>

      <div className="reviews-section mt-4">
        <ReviewForm productId={product._id} onReviewAdded={handleReviewAdded} />
        <ReviewsList productId={product._id} refreshTrigger={refresh} />
      </div>
    </Container>
  );
};

export default ProductDetail;
