import React, { useState, useEffect } from "react";
import "../Cart/Cart.css";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useNavigate } from "react-router";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  // Function to calculate the subtotal
  const calculateSubtotal = () => {
    let subtotal = 0;
    cartItems.forEach((item) => {
      subtotal += item.price * item.quantity;
    });
    return subtotal.toFixed(2);
  };

  // Function to handle deleting an item from the cart
  const deleteCartItem = async (itemId) => {
    console.log("Deleting item with ID:", itemId);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("User token not found. Please log in first.");
        return;
      }

      const response = await axios.delete("/api/accounts/delete-cart-item", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { itemId },
      });

      console.log(response.data.message);

      setCartItems((prevItems) =>
        prevItems.filter((item) => item._id !== itemId)
      );
    } catch (error) {
      console.error("Error deleting item from cart:", error);
    }
  };

  async function handleCheckOut() {
    console.log("Checkout");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("User token not found. Please log in first.");
        return;
      }

      const response = await axios.post("/api/accounts/checkout", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { orderId } = response.data;
      navigate("../cart/confirmation", {
        state: {
          orderId: orderId,
          items: cartItems,
        },
        search: `?orderId=${orderId}`,
      });
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  }

  return (
    <div>
      <h2>Cart</h2>
      {error ? (
        <p>Error: {error}</p>
      ) : cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {/* Cart table */}
          <table className="cart-table">
            <thead>
              <tr className="cart-table-header">
                <th className="table-header-item">Product</th>
                <th className="table-header-item">Quantity</th>
                <th className="table-header-item">Price</th>
                <th className="table-header-item">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item._id} className="cart-table-row">
                  {/* Product image and name */}
                  <td className="table-row-item">
                    <img
                      src={item.image1}
                      alt={item.name}
                      style={{ width: "100px", height: "auto" }}
                    />
                    <div>
                      <p>{item.name}</p>
                    </div>
                  </td>
                  {/* Quantity */}
                  <td className="table-row-item table-row-qty">
                    {item.quantity}
                  </td>
                  {/* Price */}
                  <td className="table-row-item table-row-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                  {/* Delete button */}
                  <td className="table-row-item">
                    <button
                      onClick={() => deleteCartItem(item._id)}
                      className="delete-button"
                    >
                      <DeleteIcon
                        sx={{ color: "grey" }}
                        style={{
                          width: "20px",
                          height: "20px",
                          marginRight: "5px",
                        }}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr />

          {/* Total table */}
          <div className="total-table">
            <div className="total-table-row">
              <div className="total-table-item">
                <LocalMallIcon
                  sx={{ color: "grey" }}
                  style={{
                    width: "20px",
                    height: "20px",
                    marginRight: "5px",
                  }}
                />
                Sub Total ({cartItems.length} items)
              </div>
              <div className="total-table-item">
                Total Amount: ${calculateSubtotal()}
              </div>
              {/* Checkout button */}
              <div className="checkout-button">
                <button onClick={handleCheckOut}>Checkout</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
