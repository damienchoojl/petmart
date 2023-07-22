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

        setPurchasedHistory(response.data);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch purchased history:", error);
        setError("Failed to fetch purchased history");
      }
    };

    fetchPurchasedHistory();
  }, []);

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
                        <tr key={item.itemId}>
                          <td className="item-details">
                            <img
                              src={item.image1}
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
