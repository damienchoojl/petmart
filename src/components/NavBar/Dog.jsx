import { Link } from "react-router-dom";

export default function Dog() {
  return (
    <>
      <div>
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
