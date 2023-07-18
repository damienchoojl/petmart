import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../ItemDetailsPage/ItemDetailsPage.css";

export default function ItemDetailsPage({ user }) {
  const [item, setItem] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { name } = useParams();

  useEffect(() => {
    fetchItem(name);
  }, [name]);

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  const fetchItem = async (itemName) => {
    try {
      const response = await fetch(
        `/api/items?name=${encodeURIComponent(itemName)}`
      );
      if (response.ok) {
        const data = await response.json();
        const selectedItem = data.items.find((item) => item.name === itemName);
        setItem(selectedItem);
      } else {
        console.error("Failed to fetch item details");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToCart = async () => {
    try {
      const response = await fetch("/api/accounts/add-to-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          itemId: item._id,
          quantity: quantity,
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

  const handleIncrement = () => {
    if (quantity < item.remainStock) {
      setQuantity((prevQuantity) => prevQuantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  return (
    <div>
      {item ? (
        <div className="item-details-container">
          <img src={item.image1} alt={item.name} className="item-image" />
          <div className="item-details">
            <h2 className="item-name">{item.name}</h2>
            <p className="item-price">Price: ${item.price.toFixed(2)}</p>
            <div className="quantity-container">
              Quantity
              <button
                className="quantity-button"
                onClick={handleDecrement}
                disabled={quantity === 1}
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                className="quantity-button"
                onClick={handleIncrement}
                disabled={quantity === item.remainStock}
              >
                +
              </button>
              <button
                className="add-to-cart-button"
                onClick={handleAddToCart}
                disabled={item.remainStock <= 0}
              >
                Add to Cart
              </button>
            </div>
            {item.remainStock <= 0 && <p>Out of Stock</p>}
            {addedToCart && <p>Added to cart successfully</p>}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <hr></hr>
      {item && (
        <div className="product-details-container">
          <div className="product-details">
            <h3>Details:</h3>
            <p>{item.details[0].details}</p>
          </div>
          <div className="product-details">
            <h3>Ingredients:</h3>
            <p>
              {Array.isArray(item.details[0].ingredients)
                ? item.details[0].ingredients.join(", ")
                : item.details[0].ingredients}
            </p>
          </div>
        </div>
      )}
      <hr></hr>
      {item && item.comments.length > 0 && (
        <div className="comments-container">
          <h3>Comments:</h3>
          <Slider {...carouselSettings}>
            {item.comments.map((comment) => (
              <div key={comment._id}>
                <p>User ID: {comment.userId._id}</p>
                <p>Rating: {comment.rating}</p>
                <p>Comment: {comment.comment}</p>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
}
