import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as userService from "../../utilities/users-service";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import "./NavBar.css";

export default function NavBar({ user, setUser }) {
  const [showDropdown, setShowDropdown] = useState(false);

  function handleLogOut() {
    userService.logOut();
    setUser(null);
  }

  function handleDropdownToggle() {
    setShowDropdown((prev) => !prev);
  }

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/mainpage" className="nav-logo">
          <img
            src="https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco,dpr_1/wexaikkloejtsgnng6wy"
            alt="Logo"
          />
        </Link>
        <div className="nav-dropdown">
          <button onClick={handleDropdownToggle} className="nav-dropdown-btn">
            Pets
          </button>
          {showDropdown && (
            <div className="nav-dropdown-content">
              <Link to="/cat">Cat</Link>
              &nbsp;&nbsp;
              <Link to="/dog">Dog</Link>
            </div>
          )}
        </div>
        <Link to="/brand" className="nav-link">
          Brand
        </Link>
      </div>
      <div className="nav-right">
        <Link to="/orders">Order History</Link>
        &nbsp; | &nbsp; <Link to="/orders/new">New Order</Link>
        &nbsp;&nbsp;<span>Welcome, {user.name}</span>
        &nbsp;&nbsp;
        <Link to="/favourites" className="nav-link">
          <FavoriteIcon
            sx={{ color: "white" }}
            style={{
              width: "20px",
              height: "20px",
              marginRight: "5px",
            }}
          />
        </Link>
        &nbsp;&nbsp;
        <Link to="/cart" className="nav-link">
          <ShoppingCartIcon
            sx={{ color: "white" }}
            style={{
              width: "20px",
              height: "20px",
              marginRight: "5px",
            }}
          />
        </Link>
        &nbsp;&nbsp;
        <Link to="" onClick={handleLogOut} className="nav-link">
          Log Out
        </Link>
      </div>
    </nav>
  );
}
