import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";
import { Link } from "react-router-dom";

export default function Profile({ user }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");
  const [imageSuccess, setImageSuccess] = useState("");

  // Define the setUser state updater function using the useState hook
  const [updatedUser, setUpdatedUser] = useState(user);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setImage(parsedUser.image);
      setUpdatedUser(parsedUser); // Set the initial state to the stored user
    } else {
      // If there is no stored user, reset the image state to an empty string
      setImage("");
    }
  }, []);

  const handleChangeCurrentPassword = (e) => {
    setCurrentPassword(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleChangeImage = (e) => {
    setImage(e.target.value);
  };

  const handleUpdatePassword = async () => {
    setStatus("loading");
    try {
      // Check if the current password is correct first
      const { data: isAuthenticated } = await axios.post("/api/users/login", {
        email: user.email,
        password: currentPassword,
      });

      if (isAuthenticated) {
        await axios.put(`/api/users/${user._id}/updatePassword`, {
          password,
        });
        // Password updated successfully, clear the current password and reset error
        setCurrentPassword("");
        setError("");
        setStatus("passwordSuccess");
      } else {
        setError("Please ensure that your current password is correct");
      }
    } catch (error) {
      setError("Please re-enter the current password.");
    }
  };

  const handleUpdateImage = async () => {
    setStatus("loading");
    try {
      await axios.put(`/api/users/${user._id}/updateImage`, { image });
      // Update the user object with the new image link
      const updatedUserWithImage = { ...updatedUser, image };
      // Store the updated user data in local storage
      localStorage.setItem("user", JSON.stringify(updatedUserWithImage));
      // Update the setUser state to reflect the changes
      setUpdatedUser(updatedUserWithImage);
      // Reset the image state to an empty string after successful update
      setImage("");
      setImageSuccess("Image changed successfully");
    } catch (error) {
      console.error("Failed to update image:", error);
    }
    setStatus("success");
  };

  const imageDisabled = image === user.image;
  const passwordDisabled =
    currentPassword === "" || password === "" || currentPassword === password;

  return (
    <div>
      {user ? (
        <div>
          <h1>My Profile</h1>
          {/* Tabs */}
          <div className="tabs-container">
            <Link to={`/mypets/${user._id}`}>My Pets</Link>
            <Link to={`/purchasedhistory/${user._id}`}>Purchased History</Link>
          </div>
          <div>
            <img
              src={updatedUser.image}
              alt={updatedUser.name}
              style={{ width: "100px", height: "100px" }}
            />
            <h2>{updatedUser.name}</h2>
          </div>
          <div className="input-box">
            <h3>Change My Password</h3>
            <div>
              <label htmlFor="currentPassword">Current Password: </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={handleChangeCurrentPassword}
              />
            </div>
            <div>
              <label htmlFor="password">New Password: </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handleChangePassword}
              />
              <button
                onClick={handleUpdatePassword}
                disabled={passwordDisabled}
              >
                Update Password
              </button>
              {error && <span>{error}</span>}
              {status === "passwordSuccess" && (
                <span>Password changed successfully!</span>
              )}
            </div>
          </div>
          <div className="input-box">
            <h3>Change My Profile Image</h3>
            <label htmlFor="image">Image Link: </label>
            <input
              type="url"
              id="image"
              value={image}
              onChange={handleChangeImage}
            />
            <button onClick={handleUpdateImage} disabled={imageDisabled}>
              Update Image
            </button>
            {imageSuccess && <span>{imageSuccess}</span>}
          </div>
        </div>
      ) : (
        <p>Unauthorised.</p>
      )}
    </div>
  );
}
