import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Spinner, Alert } from "react-bootstrap";
import clientAxios from "../utils/clientAxios";
import ReviewForm from "../components/ReviewForm";
import ReviewsList from "../components/ReviewsList";
import "../css/productDetail.css"; // tus estilos personalizados

const ProductDetail = () => {
  const { id } = useParams(); // 👈 Obtiene el ID desde la URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);

  const handleReviewAdded = () => setRefresh((prev) => prev + 1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await clientAxios.get(`/productos/${id}`); // 👈 Petición real
        setProduct(data.producto || data); // depende de cómo responde tu backend
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el producto.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (error)
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  if (!product)
    return (
      <Container className="mt-4">
        <Alert variant="warning">Producto no encontrado.</Alert>
      </Container>
    );

  return (
    <Container className="mt-4">
      <div className="product-detail-container d-flex flex-column flex-md-row align-items-center">
        <img
          src={
            product.imagenes?.[0] ||
            "https://via.placeholder.com/300x200?text=Sin+imagen"
          }
          alt={product.nombre}
          className="product-detail-image"
        />
        <div className="product-info ms-md-4 mt-3 mt-md-0">
          <h3>{product.nombre}</h3>
          <p className="price">${product.precio}</p>
          <p>{product.descripcion || "Sin descripción disponible."}</p>
          <p>
            <strong>Stock:</strong> {product.stock}
          </p>
        </div>
      </div>

      {/* Reseñas */}
      <div className="reviews-section mt-5">
        <ReviewForm productId={product._id} onReviewAdded={handleReviewAdded} />
        <ReviewsList productId={product._id} refreshTrigger={refresh} />
      </div>
    </Container>
  );
};

export default ProductDetail;
