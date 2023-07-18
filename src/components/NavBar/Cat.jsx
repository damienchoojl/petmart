import React from "react";
import { Link } from "react-router-dom";

export default function Cat() {
  return (
    <>
      <div>
        <h2>Shop by Categories</h2>
        <Link to="/cat/food">
          <button>Food</button>
        </Link>
        <Link to="/cat/treat">
          <button>Treats</button>
        </Link>
        <Link to="/cat/healthcare">
          <button>Healthcare</button>
        </Link>
      </div>
    </>
  );
}
