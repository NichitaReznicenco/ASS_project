import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import api from "../axios";
import CheckoutPopup from "./CheckoutPopup";
import { Button } from "react-bootstrap";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const response = await api.get("/products");
        const backendIds = response.data.map((p) => p.id);

        const validItems = cart.filter((c) => backendIds.includes(c.id));

        const itemsWithImages = await Promise.all(
          validItems.map(async (item) => {
            try {
              const imgResponse = await api.get(`/product/${item.id}/image`, {
                responseType: "blob",
              });

              const imageUrl = URL.createObjectURL(imgResponse.data);
              return { ...item, imageUrl };
            } catch {
              return { ...item, imageUrl: null };
            }
          })
        );

        setCartItems(itemsWithImages);
      } catch (err) {
        console.error("Error loading cart products:", err);
      }
    };

    if (cart.length) loadCartItems();
  }, [cart]);

  useEffect(() => {
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cartItems]);

  const handleIncreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity < item.stockQuantity
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      )
    );
  };

  const handleRemoveFromCart = (id) => {
    removeFromCart(id);
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = async () => {
    try {
      for (const item of cartItems) {
        const updatedStock = item.stockQuantity - item.quantity;

        const productData = {
          ...item,
          stockQuantity: updatedStock,
        };

        const formData = new FormData();
        formData.append(
          "product",
          new Blob([JSON.stringify(productData)], { type: "application/json" })
        );

        await api.put(`/product/${item.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      clearCart();
      setCartItems([]);
      setShowModal(false);
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  return (
    <div className="cart-container">
      <div className="shopping-cart">
        <div className="title">Shopping Bag</div>

        {cartItems.length === 0 ? (
          <div className="empty" style={{ padding: "2rem" }}>
            <h4>Your cart is empty</h4>
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <div className="item" style={{ display: "flex" }}>
                  <div>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="cart-item-image"
                    />
                  </div>

                  <div className="description">
                    <span>{item.brand}</span>
                    <span>{item.name}</span>
                  </div>

                  <div className="quantity">
                    <button
                      className="plus-btn"
                      onClick={() => handleIncreaseQuantity(item.id)}
                    >
                      <i className="bi bi-plus-square-fill"></i>
                    </button>
                    <input type="button" value={item.quantity} readOnly />
                    <button
                      className="minus-btn"
                      onClick={() => handleDecreaseQuantity(item.id)}
                    >
                      <i className="bi bi-dash-square-fill"></i>
                    </button>
                  </div>

                  <div className="total-price">
                    ${item.price * item.quantity}
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveFromCart(item.id)}
                  >
                    <i className="bi bi-trash3-fill"></i>
                  </button>
                </div>
              </li>
            ))}

            <div className="total">Total: ${totalPrice}</div>

            <Button style={{ width: "100%" }} onClick={() => setShowModal(true)}>
              Checkout
            </Button>
          </>
        )}
      </div>

      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
        handleCheckout={handleCheckout}
      />
    </div>
  );
};

export default Cart;
