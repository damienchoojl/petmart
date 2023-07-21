import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function DogFoodItems() {
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
      item.foodType === "Food" &&
      item.petType === "Dog" &&
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

  return (
    <div>
      <h2>Food Items</h2>
      <div>
        <div>
          <label htmlFor="filterType">Filter by Alphabet:</label>
          <select
            id="filterType"
            onChange={handleFilterChange}
            value={filterType}
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
          />
        </div>
        <div>
          <button onClick={handleReset}>Reset</button>
        </div>
      </div>
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
