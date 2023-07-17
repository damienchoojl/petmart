import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Brand() {
  const [items, setItems] = useState([]);

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

  useEffect(() => {
    fetchItems();
  }, []);

  // Function to remove duplicate brands from the items
  const getUniqueBrands = (items) => {
    const uniqueBrands = new Set();
    const uniqueItems = [];
    items.forEach((item) => {
      if (!uniqueBrands.has(item.brand)) {
        uniqueBrands.add(item.brand);
        uniqueItems.push(item);
      }
    });
    return uniqueItems;
  };

  const uniqueItems = getUniqueBrands(items);

  return (
    <div>
      <h2>All Brands Are Shown Here</h2>
      {uniqueItems.map((item) => (
        <Link key={item._id} to={`/brands/${encodeURIComponent(item.brand)}`}>
          <img
            src={item.brandImage}
            alt={item.brand}
            style={{ width: "100px", height: "100px" }}
          />
        </Link>
      ))}
    </div>
  );
}
