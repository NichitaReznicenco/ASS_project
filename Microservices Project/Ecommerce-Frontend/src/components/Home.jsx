import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../axios";
import AppContext from "../Context/Context";
import unplugged from "../assets/unplugged.png";

const Home = ({ selectedCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const loadImages = async () => {
      const updated = await Promise.all(
        data.map(async (product) => {
          try {
            const response = await API.get(`/product/${product.id}/image`, {
              responseType: "blob",
            });

            const imageUrl = URL.createObjectURL(response.data);
            return { ...product, imageUrl };
          } catch {
            return { ...product, imageUrl: unplugged };
          }
        })
      );
      setProducts(updated);
    };

    loadImages();
  }, [data]);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  if (isError) {
    return (
      <h2 className="text-center" style={{ padding: "18rem" }}>
        <img src={unplugged} alt="Error" style={{ width: 100, height: 100 }} />
      </h2>
    );
  }

  return (
    <div
      className="grid"
      style={{
        marginTop: "64px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        padding: "20px",
      }}
    >
      {filteredProducts.length === 0 ? (
        <h2 style={{ textAlign: "center" }}>No Products Available</h2>
      ) : (
        filteredProducts.map((product) => (
          <div
            className="card mb-3"
            key={product.id}
            style={{
              width: "250px",
              height: "360px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              borderRadius: "10px",
              overflow: "hidden",
              backgroundColor: product.productAvailable ? "#fff" : "#ccc",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Link
              to={`/product/${product.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  padding: "5px",
                  borderRadius: "10px",
                }}
              />

              <div
                className="card-body"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  padding: "10px",
                }}
              >
                <div>
                  <h5 style={{ margin: "0 0 10px 0" }}>
                    {product.name.toUpperCase()}
                  </h5>
                  <i style={{ fontSize: "0.9rem", opacity: 0.7 }}>
                    ~ {product.brand}
                  </i>
                </div>

                <hr style={{ margin: "10px 0" }} />

                <div>
                  <h5 style={{ fontWeight: 600, marginBottom: 5 }}>
                    ${product.price}
                  </h5>
                </div>

                <button
                  className="btn btn-primary"
                  style={{ marginTop: "auto" }}
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(product);
                  }}
                  disabled={!product.productAvailable}
                >
                  {product.productAvailable ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;
