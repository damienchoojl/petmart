import React from "react";
import { Link } from "react-router-dom";
import "../NavBar/NavBar.css";
import LoginIcon from "@mui/icons-material/Login";

export default function HoldingPageNavBar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <div className="nav-logo-container">
          <Link to="/mainpage" className="nav-logo">
            <img
              src="https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco,dpr_1/wexaikkloejtsgnng6wy"
              alt="Logo"
              style={{
                maxWidth: "150px",
                maxHeight: "150px",
              }}
            />
          </Link>
        </div>
      </div>
      <div className="nav-right">
        <Link to="/login" className="nav-link">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <LoginIcon />
            <span>Login</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}
