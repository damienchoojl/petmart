import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "antd";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "../MainPage/MainPage.css";

const MainPage = () => {
  const [items, setItems] = useState([]);
  const [promotions, setPromotions] = useState([]);
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

  const fetchPromotions = async () => {
    try {
      const response = await fetch("/api/promotions");
      if (!response.ok) {
        throw new Error("Failed to fetch promotions");
      }
      const data = await response.json();
      setPromotions(data.promotions);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchPromotions();
  }, []);

  const itemsWithStock = items.filter((item) => item.remainStock > 0);

  return (
    <div>
      <div className="items-carousel">
        {promotions.length > 0 ? (
          <Carousel {...carouselSettings}>
            {promotions.map((promotion) => (
              <div key={promotion._id}>
                <img
                  src={promotion.image}
                  alt={`Promotion ${promotion._id}`}
                  style={{
                    border: "2px solid black",
                    borderColor: "solid black",
                    objectFit: "cover",
                    maxWidth: "90%",
                    maxHeight: "500px",
                  }}
                />
              </div>
            ))}
          </Carousel>
        ) : (
          <p>No promotions available for the carousel</p>
        )}
      </div>

      {/* Cat Food */}
      <div className="cat-food-carousel">
        <h2>Cat Food</h2>
        <hr></hr>
        {items.length > 4 ? (
          <Slider slidesToShow={6} slidesToScroll={1}>
            {items
              .filter((item) => item.petType === "Cat")
              .map((item) => (
                <div key={item.name} className="cat-item">
                  <Link
                    to={`/items/${encodeURIComponent(item.name)}`}
                    state={item}
                  >
                    <img
                      src={item.image1}
                      alt={item.name}
                      style={{
                        maxWidth: "200px",
                        maxHeight: "300px",
                        border: "2px solid black",
                        borderColor: "solid black",
                      }}
                    />
                  </Link>
                </div>
              ))}
          </Slider>
        ) : (
          <div className="cat-row">
            {items
              .filter((item) => item.petType === "Cat")
              .map((item) => (
                <div key={item.name} className="cat-item">
                  <Link
                    to={`/items/${encodeURIComponent(item.name)}`}
                    state={item}
                  >
                    <img
                      src={item.image1}
                      alt={item.name}
                      style={{
                        maxWidth: "200px",
                        maxHeight: "300px",
                        border: "2px solid black",
                        borderColor: "solid black",
                      }}
                    />
                  </Link>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Dog Food */}
      <div className="dog-food-carousel">
        <h2>Dog Food</h2>
        <hr></hr>
        {items.length > 4 ? (
          <Slider slidesToShow={6} slidesToScroll={1}>
            {items
              .filter((item) => item.petType === "Dog")
              .map((item) => (
                <div key={item.name} className="dog-item">
                  <Link
                    to={`/items/${encodeURIComponent(item.name)}`}
                    state={item}
                  >
                    <img
                      src={item.image1}
                      alt={item.name}
                      style={{
                        maxWidth: "200px",
                        maxHeight: "300px",
                        border: "2px solid black",
                        borderColor: "solid black",
                      }}
                    />
                  </Link>
                </div>
              ))}
          </Slider>
        ) : (
          <div className="dog-row">
            {items
              .filter((item) => item.petType === "Dog")
              .map((item) => (
                <div key={item.name} className="dog-item">
                  <Link
                    to={`/items/${encodeURIComponent(item.name)}`}
                    state={item}
                  >
                    <img
                      src={item.image1}
                      alt={item.name}
                      style={{
                        maxWidth: "200px",
                        maxHeight: "300px",
                        border: "2px solid black",
                        borderColor: "solid black",
                      }}
                    />
                  </Link>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
