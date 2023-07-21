import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CatItem.css";

export default function CatTreatItems() {
  const [items, setItems] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filter items based on the food type and search term
  const filteredItems = items.filter((item) => {
    const itemName = item.name.toLowerCase();
    const search = searchTerm.toLowerCase();
    return (
      item.foodType === "Treat" &&
      item.petType === "Cat" &&
      (filterType === "all" ||
        item.name.charAt(0).toLowerCase() === filterType) &&
      (itemName.includes(search) ||
        item.foodType.toLowerCase().includes(search))
    );
  });

  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleReset = () => {
    setFilterType("all");
    setSearchTerm("");
  };

  // Generate options for all alphabets
  const alphabets = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(97 + i)
  );

  // Calculate the average rating from the comments
  const calculateAverageRating = (comments) => {
    if (comments.length === 0) return 0;
    const totalRating = comments.reduce(
      (sum, comment) => sum + comment.rating,
      0
    );
    return totalRating / comments.length;
  };

  return (
    <div className="cat-food-container">
      <h2>Food Items</h2>
      <div className="filter-search-container">
        <div>
          <label htmlFor="filterType">Filter by Alphabet:</label>
          <select
            id="filterType"
            onChange={handleFilterChange}
            value={filterType}
            className="filter-dropdown"
          >
            <option value="all">All</option>
            {alphabets.map((alphabet) => (
              <option key={alphabet} value={alphabet}>
                {alphabet.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="searchTerm">Search by Item Name:</label>
          <input
            type="text"
            id="searchTerm"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Enter item name..."
            className="search-input"
          />
        </div>
        <div>
          <button onClick={handleReset} className="reset-button">
            Reset
          </button>
        </div>
      </div>
      <div className="items-container">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <Link key={item._id} to={`/items/${encodeURIComponent(item.name)}`}>
              <div className="item-card">
                <img src={item.image1} alt={item.name} />
                <h3>{item.name}</h3>
                <p>Price: ${item.price.toFixed(2)}</p>
                <p>Average Ratings: {calculateAverageRating(item.comments)}</p>
                {/* Add other item details you want to display */}
              </div>
            </Link>
          ))
        ) : (
          <p>No items matching the filters.</p>
        )}
      </div>
    </div>
  );
}
