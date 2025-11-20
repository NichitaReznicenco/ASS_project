import React from "react";
import { Modal, Button } from "react-bootstrap";

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice, handleCheckout }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Checkout</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="checkout-items">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="checkout-item"
              style={{
                display: "flex",
                marginBottom: "12px",
                alignItems: "center",
              }}
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  marginRight: "12px",
                }}
              />

              <div>
                <p style={{ margin: 0, fontWeight: "bold" }}>{item.name}</p>
                <p style={{ margin: "4px 0" }}>Quantity: {item.quantity}</p>
                <p style={{ margin: "4px 0" }}>
                  Price: ${item.price * item.quantity}
                </p>
              </div>
            </div>
          ))}

          <h5
            style={{
              color: "black",
              textAlign: "center",
              marginTop: "10px",
              fontSize: "1.3rem",
              fontWeight: "bold",
            }}
          >
            Total: ${totalPrice}
          </h5>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>

        <Button variant="primary" onClick={handleCheckout}>
          Confirm Purchase
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CheckoutPopup;
