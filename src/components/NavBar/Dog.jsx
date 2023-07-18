import { Link } from "react-router-dom";

export default function Dog() {
  return (
    <>
      <div>
        <h2>Shop by Categories</h2>
        <Link to="/dog/food">
          <button>Food</button>
        </Link>
        <Link to="/dog/treat">
          <button>Treats</button>
        </Link>
        <Link to="/dog/healthcare">
          <button>Healthcare</button>
        </Link>
      </div>
    </>
  );
}
