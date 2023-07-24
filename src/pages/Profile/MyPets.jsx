import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MyPets.css";

const MyPets = ({ user }) => {
  const [myPets, setMyPets] = useState([]);
  const [newPet, setNewPet] = useState({
    name: "",
    type: "",
    gender: "",
    birthday: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyPetsData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("User token not found. Please log in first.");
          return;
        }

        const response = await axios.get("/api/accounts/mypets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMyPets(response.data.myPets);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch myPets data:", error);
        setError("Failed to fetch myPets data");
      }
    };

    fetchMyPetsData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPet((prevPet) => ({ ...prevPet, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("User token not found. Please log in first.");
        return;
      }

      const response = await axios.post("/api/accounts/add-pet", newPet, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMyPets((prevPets) => [...prevPets, response.data.newPet]);
      setNewPet({ name: "", type: "", gender: "M", birthday: "" });
      setError(null);
    } catch (error) {
      console.error("Failed to add a new pet:", error);
      setError("Failed to add a new pet");
    }
  };

  // Function to format the birthday without the time
  const formatBirthday = (birthday) => {
    const date = new Date(birthday);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return formattedDate;
  };

  // Function to calculate the age based on the birthday
  const calculateAge = (birthday) => {
    const birthDate = new Date(birthday);
    const currentDate = new Date();

    let years = currentDate.getFullYear() - birthDate.getFullYear();
    let months = currentDate.getMonth() - birthDate.getMonth();

    if (
      months < 0 ||
      (months === 0 && currentDate.getDate() < birthDate.getDate())
    ) {
      years--;
      months += 12;
    }

    return { years, months };
  };

  // Function to format the age as years and months
  const formatAge = (age) => {
    const { years, months } = age;
    let ageString = years > 0 ? `${years} year${years > 1 ? "s" : ""}` : "";
    if (months > 0) {
      ageString +=
        years > 0
          ? `, ${months} month${months > 1 ? "s" : ""}`
          : `${months} month${months > 1 ? "s" : ""}`;
    }
    return ageString;
  };

  return (
    <div className="my-pets-container">
      <h1>My Pets</h1>
      <div className="slider">
        {error ? (
          <p>Error: {error}</p>
        ) : myPets.length === 0 ? (
          <p>No pets found.</p>
        ) : (
          myPets.map((pet) => (
            <div key={pet._id} className="pet-card">
              <p className="pet-name">Name: {pet.name}</p>
              <p className="pet-type">Type: {pet.type}</p>
              <p className="pet-gender">Gender: {pet.gender}</p>
              <p className="pet-birthday">
                Birthday: {formatBirthday(pet.birthday)}
              </p>
              <p className="pet-age">
                Age: {formatAge(calculateAge(pet.birthday))}
              </p>
            </div>
          ))
        )}
      </div>
      <div className="add-pet-form">
        <h2>Add a New Pet</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newPet.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="type">Type:</label>
            <input
              type="text"
              id="type"
              name="type"
              value={newPet.type}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="gender">Gender:</label>
            <select
              id="gender"
              name="gender"
              value={newPet.gender}
              onChange={handleChange}
            >
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="birthday">Birthday:</label>
            <input
              type="date"
              id="birthday"
              name="birthday"
              value={newPet.birthday}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Add Pet</button>
        </form>
      </div>
    </div>
  );
};

export default MyPets;
