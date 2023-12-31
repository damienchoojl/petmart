import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import { StarRate as StarRateIcon } from "@mui/icons-material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../ItemDetailsPage/ItemDetailsPage.css";
import EditIcon from "@mui/icons-material/Edit";

export default function ItemDetailsPage({ user }) {
  const [item, setItem] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isFavourited, setIsFavourited] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewAdded, setReviewAdded] = useState(false);
  const [editedPrice, setEditedPrice] = useState(null);
  const [editedRemainStock, setEditedRemainStock] = useState(null);

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

  // const fetchItem = async (itemName) => {
  //   try {
  //     const response = await fetch(
  //       `/api/items?name=${encodeURIComponent(itemName)}`
  //     );
  //     if (response.ok) {
  //       const data = await response.json();
  //       const selectedItem = data.items.find((item) => item.name === itemName);
  //       setItem(selectedItem);
  //     } else {
  //       console.error("Failed to fetch item details");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

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

  const calculateAverageRating = (comments) => {
    if (!comments || comments.length === 0) {
      return 0;
    }
    const totalRating = comments.reduce(
      (sum, comment) => sum + comment.rating,
      0
    );
    return totalRating / comments.length;
  };

  const averageRating = calculateAverageRating(item ? item.comments : []);

  useEffect(() => {
    // Check if the user object exists and contains favorites before proceeding
    if (user && user.favourites) {
      // Check if the item is already in the user's favorites
      if (user.favourites.includes(item?._id)) {
        setIsFavourited(true);
      }
    }
  }, [user, item]);

  const handleFavouriteClick = async () => {
    try {
      const response = await fetch("/api/accounts/add-to-favourites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ itemId: item._id }),
      });

      if (response.ok) {
        setIsFavourited(true);
      } else {
        console.error("Failed to add item to favourites");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddReview = async () => {
    // Check if the rating is greater than 5 and show an error
    if (rating > 5) {
      alert("Rating cannot be greater than 5.");
      return; // Exit the function if the rating is invalid
    }
    if (rating < 0) {
      alert("Rating cannot be lesser than 0.");
      return;
    }

    try {
      const response = await fetch(`/api/items/${item._id}/add-review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (response.ok) {
        setReviewAdded(true);
      } else {
        console.error("Failed to add review");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      if (editedPrice === null && editedRemainStock === null) {
        console.log("No changes made.");
        return;
      }

      // Prepare the payload to be updated in the database
      const updatedFields = {};
      if (editedPrice !== null) {
        updatedFields.price = Number(editedPrice); // Convert to JavaScript number
      }
      if (editedRemainStock !== null) {
        updatedFields.remainStock = editedRemainStock;
      }

      // Make API call to update the item in the database
      const response = await fetch(`/api/items/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedFields),
      });

      if (response.ok) {
        // Update the item state with the edited values
        setItem((prevItem) => ({
          ...prevItem,
          ...updatedFields,
        }));
        setEditedPrice(null);
        setEditedRemainStock(null);
      } else {
        console.error("Failed to save changes.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {item ? (
        <div className="item-details-container">
          <img
            src={item.image1}
            alt={item.name}
            className="item-image"
            style={{ width: "250px", height: "350px" }}
          />
          <div className="item-details">
            <h2 className="item-name">{item.name}</h2>
            {user && user.email.endsWith("@admin.com") && (
              <>
                <div className="edit-item-details">
                  <label>Price:</label>
                  {editedPrice !== null ? (
                    <input
                      type="number"
                      value={editedPrice}
                      onChange={(e) => setEditedPrice(e.target.value)}
                    />
                  ) : (
                    <span>${item.price.toFixed(2)}</span>
                  )}
                  {editedPrice !== null ? (
                    <button onClick={() => handleSaveChanges()}>Save</button>
                  ) : (
                    <button onClick={() => setEditedPrice(item.price)}>
                      <EditIcon
                        style={{
                          width: "15px",
                          height: "15px",
                        }}
                      />
                    </button>
                  )}
                </div>
                <div className="edit-item-details">
                  <label>Remaining Stock:</label>
                  {editedRemainStock !== null ? (
                    <input
                      type="number"
                      value={editedRemainStock}
                      onChange={(e) => setEditedRemainStock(e.target.value)}
                    />
                  ) : (
                    <span>{item.remainStock}</span>
                  )}
                  {editedRemainStock !== null ? (
                    <button onClick={() => handleSaveChanges()}>Save</button>
                  ) : (
                    <button
                      onClick={() => setEditedRemainStock(item.remainStock)}
                    >
                      <EditIcon
                        style={{
                          width: "15px",
                          height: "15px",
                        }}
                      />
                    </button>
                  )}
                </div>
              </>
            )}
            <div className="average-rating">
              {averageRating ? (
                <>
                  <span>Average Rating: {averageRating.toFixed(1)}</span>
                  <StarRateIcon className="star-icon" />
                </>
              ) : (
                <span>No Ratings Yet</span>
              )}
            </div>
            <p className="item-price">Price: ${item.price.toFixed(2)}</p>
            <p>Remaining Stock: {item.remainStock}</p>
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
              <button
                className={`add-to-cart-button ${
                  isFavourited ? "favourited" : ""
                }`}
                onClick={handleFavouriteClick}
                disabled={isFavourited}
              >
                {isFavourited ? "Favourited" : "Add to Favourites"}
              </button>
            </div>
            {item.remainStock <= 0 && <p>Out of Stock</p>}
            {addedToCart && <p>Added to cart successfully</p>}
            {reviewAdded && <p>Review added successfully</p>}
            <div className="write-review-container">
              <h3>Write a Review:</h3>
              <div className="review-input">
                <label>Rating: </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                />
              </div>
              <div className="review-input">
                <label>Comment: </label>
                <textarea
                  rows="4"
                  cols="50"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <button
                className="submit-review-button"
                onClick={handleAddReview}
                disabled={rating === 0 || comment.trim() === ""}
              >
                Submit Review
              </button>
              {reviewAdded && (
                <p className="review-success">Review added successfully</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <hr />
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
      <hr />
      {item && item.comments.length > 0 && (
        <div className="comments-container">
          <h3>Ratings & Reviews:</h3>
          <Slider {...carouselSettings}>
            {item.comments.map((comment) => (
              <div key={comment._id}>
                <p>User: {comment.userId.name}</p>
                <p>Rating: {comment.rating}</p>
                <p>Review: {comment.comment}</p>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
}
