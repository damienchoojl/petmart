import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./PurchasedHistory.css";

export default function PurchasedHistory() {
  const [purchasedHistory, setPurchasedHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch the purchased history
    const fetchPurchasedHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("User token not found. Please log in first.");
          return;
        }

        const response = await axios.get(
          "/api/accounts/get-purchased-history",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Combine duplicate items within each order
        const combinedHistory = response.data.map((order) => ({
          ...order,
          items: combineDuplicateItems(order.items),
        }));

        setPurchasedHistory(combinedHistory);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch purchased history:", error);
        setError("Failed to fetch purchased history");
      }
    };

    fetchPurchasedHistory();
  }, []);

  // Helper function to combine duplicate items within an order
  const combineDuplicateItems = (items) => {
    const combinedItems = [];
    const itemMap = new Map();

    items.forEach((item) => {
      const itemId = item.itemId["$oid"];
      const itemName = item.name;
      const key = `${itemId}-${itemName}`;

      if (itemMap.has(key)) {
        const existingItem = itemMap.get(key);
        existingItem.quantity += item.quantity;
        existingItem.totalPrice += item.price * item.quantity;
      } else {
        itemMap.set(key, { ...item });
      }
    });

    itemMap.forEach((value) => combinedItems.push(value));
    return combinedItems;
  };

  return (
    <div className="purchased-history-container">
      <h1>My Purchased History</h1>
      {error ? (
        <p>Error: {error}</p>
      ) : purchasedHistory.length === 0 ? (
        <p>No items in purchased history.</p>
      ) : (
        <div>
          {/* Display purchased history items */}
          <ul className="order-list">
            {purchasedHistory.map((order) => (
              <li key={order.orderId} className="order-item">
                <div className="order-details">
                  <p>Order ID: {order.orderId}</p>
                  <table className="item-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={`${order.orderId}-${item.itemId["$oid"]}`}>
                          <td className="item-details">
                            <img
                              src={item.itemImage}
                              alt={item.name}
                              className="item-image"
                            />
                            <p className="item-name">{item.name}</p>
                          </td>
                          <td className="item-quantity">{item.quantity}</td>
                          <td className="item-amount">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <br />
      <Link to={"/mainpage"}>
        <div className="return-main-button">
          <button>Return to Main</button>
        </div>
      </Link>
    </div>
  );
}
