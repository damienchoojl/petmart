import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function CatTreatItems() {
  const [items, setItems] = useState([]);

  // Fetch items from the API when the component mounts
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/items");
      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }
      const data = await response.json();
      setItems(data.items);
    } catch (error) {
      console.error(error);
    }
  };

  // Filter items based on the food type
  const filteredItems = items.filter(
    (item) => item.foodType === "Treat" && item.petType === "Cat"
  );

  return (
    <div>
      <h2>Treat Items</h2>
      <div>
        {filteredItems.map((item) => (
          <Link key={item._id} to={`/items/${encodeURIComponent(item.name)}`}>
            <img
              src={item.image1}
              alt={item.name}
              style={{ width: "100px", height: "100px" }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
