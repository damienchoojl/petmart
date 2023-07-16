import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "antd";
import ItemCard from "../ItemCard/ItemCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function MainPage() {
  const [items, setItems] = useState([]);

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

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

  const itemsWithStock = items.filter((item) => item.remainStock > 0);

  return (
    <div>
      {/* Main Carousel to display poster */}
      <div className="items-carousel">
        <p></p>
        {itemsWithStock.length > 0 ? (
          <Carousel {...carouselSettings}>
            {itemsWithStock.map((item) => (
              <Link
                key={item._id}
                to={`/items/${encodeURIComponent(item._id)}`}
              >
                <ItemCard item={item} />
              </Link>
            ))}
          </Carousel>
        ) : (
          <p>No items available for the carousel</p>
        )}
      </div>
    </div>
  );
}
