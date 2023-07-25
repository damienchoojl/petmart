import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Favourite.css";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Favourite({ user }) {
  const [favouriteItems, setFavouriteItems] = useState([]);
  const [addedToCart, setAddedToCart] = useState(false);

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
        setAddedToCart(true);
      } else {
        console.error("Failed to add item to cart");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteFromFavourites = async (itemId) => {
    try {
      const response = await fetch("/api/accounts/delete-from-favourites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: user._id,
          itemId: itemId,
        }),
      });

      if (response.ok) {
        console.log("Item removed from favourites successfully");
        // Refresh the list of favourite items after deletion
        fetchFavouriteItems();
      } else {
        console.error("Failed to remove item from favourites");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="favourite-container">
      <div className="favourite-title">
        <h2>My Favourites: {favouriteItems.length}</h2>
        <div className="favourite-items">
          {favouriteItems.length > 0 ? (
            favouriteItems.map((item) => (
              <div className="favourite-item" key={item._id}>
                <Link to={`/items/${encodeURIComponent(item.name)}`}>
                  <img src={item.image1} alt={item.name} />
                </Link>
                <h3>{item.name}</h3>
                <p>Price: ${item.price.toFixed(2)}</p>
                <div className="button-container">
                  <button onClick={() => handleAddToCart(item._id)}>
                    Add to Cart
                  </button>
                  <button onClick={() => handleDeleteFromFavourites(item._id)}>
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No favourite items yet</p>
          )}
        </div>
      </div>
      {addedToCart && <p>Added to cart successfully</p>}
    </div>
  );
}
