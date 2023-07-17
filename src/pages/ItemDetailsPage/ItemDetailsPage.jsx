import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ItemDetailsPage() {
  const [item, setItem] = useState(null);
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

  return (
    <div>
      {item ? (
        <div key={item._id}>
          <img src={item.image1} alt={item.name} />
          <h2>{item.name}</h2>
          <p>Pet Type: {item.petType}</p>
          <p>Food Type: {item.foodType}</p>
          <p>Category Type: {item.categoryType}</p>
          <p>Details: {item.details[0].details}</p>
          <p>
            Ingredients:{" "}
            {Array.isArray(item.details[0].ingredients)
              ? item.details[0].ingredients.join(", ")
              : item.details[0].ingredients}
          </p>
          <p>Price: ${item.price.toFixed(2)}</p>
          <p>Stocks: {item.remainStock}</p>
          {item.comments.length > 0 && (
            <div>
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
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
