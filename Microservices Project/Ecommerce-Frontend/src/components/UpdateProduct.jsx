import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../axios";

const UpdateProduct = () => {
  const { id } = useParams();

  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    brand: "",
    price: 0,
    category: "",
    releaseDate: "",
    productAvailable: false,
    stockQuantity: 0,
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await API.get(`/product/${id}`);
        setUpdateProduct(response.data);

        const imgResponse = await API.get(`/product/${id}/image`, {
          responseType: "blob",
        });

        const file = await blobToFile(imgResponse.data, response.data.imageName);
        setImage(file);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    loadProduct();
  }, [id]);

  const blobToFile = async (blob, fileName) => {
    return new File([blob], fileName, { type: blob.type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("imageFile", image);
    form.append(
      "product",
      new Blob([JSON.stringify(updateProduct)], { type: "application/json" })
    );

    try {
      await API.put(`/product/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update product");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUpdateProduct({
      ...updateProduct,
      [name]:
        name === "price" || name === "stockQuantity"
          ? Number(value)
          : value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="update-product-container">
      <div className="center-container" style={{ marginTop: "7rem" }}>
        <h1>Update Product</h1>

        <form className="row g-3 pt-1" onSubmit={handleSubmit}>

          <div className="col-md-6">
            <label className="form-label"><h6>Name</h6></label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={updateProduct.name}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label"><h6>Brand</h6></label>
            <input
              type="text"
              className="form-control"
              name="brand"
              value={updateProduct.brand}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <label className="form-label"><h6>Description</h6></label>
            <input
              type="text"
              className="form-control"
              name="description"
              value={updateProduct.description}
              onChange={handleChange}
            />
          </div>

          <div className="col-5">
            <label className="form-label"><h6>Price</h6></label>
            <input
              type="number"
              className="form-control"
              name="price"
              value={updateProduct.price}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label"><h6>Category</h6></label>
            <select
              className="form-select"
              name="category"
              value={updateProduct.category}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              <option value="Laptop">Laptop</option>
              <option value="Headphone">Headphone</option>
              <option value="Mobile">Mobile</option>
              <option value="Electronics">Electronics</option>
              <option value="Toys">Toys</option>
              <option value="Fashion">Fashion</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label"><h6>Stock Quantity</h6></label>
            <input
              type="number"
              className="form-control"
              name="stockQuantity"
              value={updateProduct.stockQuantity}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-8">
            <label className="form-label"><h6>Image</h6></label>

            <img
              src={image ? URL.createObjectURL(image) : ""}
              alt=""
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                padding: "5px",
              }}
            />

            <input
              className="form-control"
              type="file"
              onChange={handleImageChange}
            />
          </div>

          <div className="col-12">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={updateProduct.productAvailable}
                onChange={(e) =>
                  setUpdateProduct({
                    ...updateProduct,
                    productAvailable: e.target.checked,
                  })
                }
              />
              <label className="form-check-label">Product Available</label>
            </div>
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
