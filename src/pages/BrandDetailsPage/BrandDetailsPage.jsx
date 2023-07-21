import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./BrandDetailsPage.css";

export default function BrandDetailsPage() {
  const { name } = useParams();
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/items");
      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }
      const data = await response.json();
      setItems(data.items.filter((item) => item.brand === name));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [name]);

  // Function to calculate the average rating for items with comments
  const calculateAverageRating = (item) => {
    const totalRatings = item.comments.reduce(
      (sum, comment) => sum + comment.rating,
      0
    );
    const averageRating = totalRatings / item.comments.length;
    return averageRating.toFixed(1);
  };

  return (
    <div className="brand-details-container">
      <h2>Items for {name}</h2>
      <div className="items-container">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item._id} className="brand-item">
              <Link to={`/items/${encodeURIComponent(item.name)}`}>
                <div className="item-card">
                  <img
                    src={item.image1}
                    alt={item.name}
                    style={{ width: "100px", height: "100px" }}
                  />
                  <h3>{item.name}</h3>
                  <p>Price: ${item.price.toFixed(2)}</p>
                  {item.comments.length > 0 ? (
                    <p>Average Rating: {calculateAverageRating(item)}</p>
                  ) : (
                    <p>No ratings yet.</p>
                  )}
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p className="no-items-message">No items for this brand.</p>
        )}
      </div>
    </div>
  );
}
