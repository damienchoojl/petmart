import React, { useState, useEffect } from "react";
import "../Cart/Cart.css";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/accounts/get-cart-items", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch cart items");
        }
        return response.json();
      })
      .then((data) => {
        // Create a map to track the quantity of each item
        const itemQuantityMap = new Map();
        data.forEach((item) => {
          const itemId = item._id;
          if (itemQuantityMap.has(itemId)) {
            itemQuantityMap.set(itemId, itemQuantityMap.get(itemId) + 1);
          } else {
            itemQuantityMap.set(itemId, 1);
          }
        });

        // Map the cart items to include quantity and remove duplicates
        const uniqueItems = Array.from(new Set(data.map((item) => item._id)));
        const itemsWithQuantity = uniqueItems.map((itemId) => ({
          ...data.find((item) => item._id === itemId),
          quantity: itemQuantityMap.get(itemId),
        }));

        setCartItems(itemsWithQuantity);
        setError(null);
      })
      .catch((error) => {
        console.error("Failed to fetch cart items:", error);
        setError(error.message || "Failed to fetch cart items");
      });
  }, []);

  return (
    <div>
      <h2>Cart</h2>
      {error ? (
        <p>Error: {error}</p>
      ) : cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-table">
          {/* Table header */}
          <div className="cart-table-header">
            <div className="table-header-item">Product</div>
            <div className="table-header-item">Qty</div>
            <div className="table-header-item">Price</div>
          </div>
          {/* Table rows */}
          {cartItems.map((item) => (
            <div key={item._id} className="cart-table-row">
              {/* Product image and name */}
              <div className="table-row-item">
                <img
                  src={item.image1}
                  alt={item.image1}
                  style={{ width: "100px" }}
                />
                <p>{item.name}</p>
              </div>
              {/* Quantity */}
              <div className="table-row-item table-row-qty">
                {item.quantity}
              </div>
              {/* Price */}
              <div className="table-row-item table-row-price">
                ${item.price * item.quantity}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
