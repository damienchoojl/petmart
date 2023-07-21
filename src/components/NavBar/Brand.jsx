import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Brand.css";

export default function Brand() {
  const [items, setItems] = useState([]);
  const [filterAlphabet, setFilterAlphabet] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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

  // Function to filter brands based on the selected alphabet and search term
  const filteredBrands = getUniqueBrands(
    items.filter(
      (item) =>
        (filterAlphabet === "all" ||
          item.brand.charAt(0).toLowerCase() === filterAlphabet) &&
        item.brand.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Generate options for all alphabets
  const alphabets = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(97 + i)
  );

  const handleReset = () => {
    setFilterAlphabet("all");
    setSearchTerm("");
  };

  return (
    <div>
      <h2>Our Brands</h2>
      <h4>Best in business brands that offer quality products.</h4>
      <div className="filter-container">
        <label htmlFor="filterAlphabet">Filter by Alphabet:</label>
        <select
          id="filterAlphabet"
          onChange={(e) => setFilterAlphabet(e.target.value)}
          value={filterAlphabet}
        >
          <option value="all">All</option>
          {alphabets.map((alphabet) => (
            <option key={alphabet} value={alphabet}>
              {alphabet.toUpperCase()}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search by brand name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleReset}>Reset</button>
      </div>
      <div className="brand-buttons">
        {filteredBrands.map((item) => (
          <Link key={item._id} to={`/brand/${encodeURIComponent(item.brand)}`}>
            <div className="brand-button">
              <div className="image-box">
                <img src={item.brandImage} alt={item.brand} />
              </div>
              <span className="brand-name">{item.brand}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
