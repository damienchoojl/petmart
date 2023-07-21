import { Link } from "react-router-dom";
import "./Dog.css";

export default function Dog() {
  return (
    <div className="dog-container">
      <h2>Shop by Categories</h2>
      <div className="category-buttons">
        <Link to="/dog/food">
          <button className="category-button">
            <img
              src="https://cdn.shopify.com/s/files/1/1149/5008/files/1_e4ac6ae2-c563-4d27-a23e-f8a38f34d26c.png"
              alt="Food"
            />
            <span>Food</span>
          </button>
        </Link>
        <Link to="/dog/treat">
          <button className="category-button">
            <img
              src="https://cdn.shopify.com/s/files/1/1149/5008/files/2_3ec06e34-7868-47d7-86c3-58e041c9be0c.png"
              alt="Treats"
            />
            <span>Treats</span>
          </button>
        </Link>
        <Link to="/dog/healthcare">
          <button className="category-button">
            <img
              src="https://cdn.shopify.com/s/files/1/1149/5008/files/dog-skin-relief.png"
              alt="Healthcare"
            />
            <span>Healthcare</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
