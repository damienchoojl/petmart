import React from "react";
import { Link } from "react-router-dom";
import "./Cat.css";

export default function Cat() {
  return (
    <div className="cat-container">
      <h2>Shop by Categories</h2>
      <div className="category-buttons">
        <Link to="/cat/food">
          <button className="category-button">
            <img
              src="https://cdn.shopify.com/s/files/1/1149/5008/files/cat-dry-food.png"
              alt="Food"
            />
            <span>Food</span>
          </button>
        </Link>
        <Link to="/cat/treat">
          <button className="category-button">
            <img
              src="https://cdn.shopify.com/s/files/1/1149/5008/files/Mini_Homepage_Icons_3.png"
              alt="Treats"
            />
            <span>Treats</span>
          </button>
        </Link>
        <Link to="/cat/healthcare">
          <button className="category-button">
            <img
              src="https://cdn.shopify.com/s/files/1/1149/5008/files/cat-dental-care.png"
              alt="Healthcare"
            />
            <span>Healthcare</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
