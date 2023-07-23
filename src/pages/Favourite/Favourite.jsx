import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Favourite.css";

export default function Favourite({ user }) {
  const [favouriteItems, setFavouriteItems] = useState([]);

  useEffect(() => {
    fetchFavouriteItems();
  }, []);

  const fetchFavouriteItems = async () => {
    try {
      const response = await fetch("/api/accounts/get-favourite-items", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFavouriteItems(data.favouriteItems);
      } else {
        console.error("Failed to fetch favourite items");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToCart = async (itemId) => {
    try {
      const response = await fetch("/api/accounts/add-to-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: user._id,
          itemId: itemId,
          quantity: 1,
        }),
      });

      if (response.ok) {
        console.log("Item added to cart successfully");
      } else {
        console.error("Failed to add item to cart");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="favourite-container">
      <h2>My Favourites: {favouriteItems.length}</h2>
      <div className="favourite-items">
        {favouriteItems.length > 0 ? (
          favouriteItems.map((item) => (
            <div className="favourite-item" key={item._id}>
              <img src={item.image1} alt={item.name} />
              <h3>{item.name}</h3>
              <p>Price: ${item.price.toFixed(2)}</p>
              <button onClick={() => handleAddToCart(item._id)}>
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p>No favourite items yet</p>
        )}
      </div>
    </div>
  );
}
