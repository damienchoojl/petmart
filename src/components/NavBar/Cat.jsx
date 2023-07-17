import React from "react";
import { Link } from "react-router-dom";

export default function Cat() {
  return (
    <>
      <div>
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
