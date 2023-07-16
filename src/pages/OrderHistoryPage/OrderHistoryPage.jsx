import React, { useState, useEffect } from "react";
import axios from "axios";
import { checkToken } from "../../utilities/users-service";

export default function OrderHistoryPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  async function fetchOrderHistory() {
    try {
      const response = await axios.get("/api/items"); // Replace with your server endpoint
      setItems(response.data.items);
    } catch (error) {
      console.error("Failed to fetch order history:", error);
    }
  }

  // function handleCheckToken() {
  //   const expDate = checkToken();
  //   console.log(expDate);
  // }

  return (
    <div>
      <h1>Order History</h1>
      {/* <button onClick={handleCheckToken}>Check When My Login Expires</button> */}
      <div>
        {items.map((item) => (
          <div key={item._id}>
            <h2>{item.name}</h2>
            <p>Pet Type: {item.petType}</p>
            <p>Food Type: {item.foodType}</p>
            <p>Category Type: {item.categoryType}</p>
            <p>Details: {item.details[0].details}</p>
            <p>
              Ingredients:{" "}
              {Array.isArray(item.details[0].ingredients)
                ? item.details[0].ingredients.join(", ")
                : item.details[0].ingredients}
            </p>
            <p>Price: {item.price}</p>
            <img src={item.image1} alt={item.name} />
            {item.comments.length > 0 && (
              <div>
                <h3>Comments:</h3>
                {item.comments.map((comment) => (
                  <div key={comment._id}>
                    <p>User ID: {comment.userId._id}</p>{" "}
                    {/* Render the user ID */}
                    <p>Rating: {comment.rating}</p>
                    <p>Comment: {comment.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
