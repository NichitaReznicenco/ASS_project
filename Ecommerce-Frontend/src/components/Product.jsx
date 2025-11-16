import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import API from "../axios";

const Product = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, refreshData } = useContext(AppContext);

  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await API.get(`/product/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    loadProduct();
  }, [id]);

  useEffect(() => {
    if (product && product.imageName) fetchImage();
  }, [product]);

  const fetchImage = async () => {
    try {
      const response = await API.get(`/product/${id}/image`, {
        responseType: "blob",
      });
      setImageUrl(URL.createObjectURL(response.data));
    } catch (err) {
      console.error("Error fetching image:", err);
    }
  };

  const deleteProduct = async () => {
    try {
      await API.delete(`/product/${id}`);
      removeFromCart(id);
      alert("Product deleted");
      refreshData();
      navigate("/");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const handleAddToCart = () => {
    addToCart(product);
    alert("Added to cart");
  };

  if (!product) {
    return (
      <h2 className="text-center" style={{ padding: "10rem" }}>
        Loading...
      </h2>
    );
  }

  return (
    <div className="product-container" style={{ display: "flex" }}>
      <img
        className="product-image"
        src={imageUrl}
        alt={product.imageName}
        style={{ width: "50%", height: "auto" }}
      />

      <div className="product-details" style={{ width: "50%" }}>
        <div className="product-description">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "1.2rem" }}>{product.category}</span>

            <h6>
              Listed:
              <span>
                {" "}
                <i>
                  {product.releaseDate
                    ? new Date(product.releaseDate).toLocaleDateString()
                    : ""}
                </i>
              </span>
            </h6>
          </div>

          <h1
            style={{
              fontSize: "2rem",
              marginBottom: "0.5rem",
              textTransform: "capitalize",
              letterSpacing: "1px",
            }}
          >
            {product.name}
          </h1>

          <i>{product.brand}</i>

          <p style={{ fontWeight: "bold", marginTop: "1rem" }}>
            PRODUCT DESCRIPTION:
          </p>
          <p>{product.description}</p>
        </div>

        <div className="product-price">
          <span style={{ fontSize: "2rem", fontWeight: "bold" }}>
            ${product.price}
          </span>

          <button
            className="cart-btn"
            onClick={handleAddToCart}
            disabled={!product.productAvailable}
            style={{
              padding: "1rem 2rem",
              fontSize: "1rem",
              backgroundColor: product.productAvailable ? "#007bff" : "#999",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: product.productAvailable ? "pointer" : "not-allowed",
              marginBottom: "1rem",
            }}
          >
            {product.productAvailable ? "Add to Cart" : "Out of Stock"}
          </button>

          <h6>
            Stock Available:{" "}
            <i style={{ color: "green", fontWeight: "bold" }}>
              {product.stockQuantity}
            </i>
          </h6>
        </div>

        <div
          className="action-buttons"
          style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}
        >
          <button
            className="btn btn-primary"
            onClick={handleEditClick}
            style={{ padding: "1rem 2rem" }}
          >
            Update
          </button>

          <button
            className="btn btn-danger"
            onClick={deleteProduct}
            style={{ padding: "1rem 2rem" }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
