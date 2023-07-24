import React, { useState, useEffect } from "react";
import axios from "axios";

const MyPets = ({ user }) => {
  const [myPets, setMyPets] = useState([]);
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

  return (
    <div>
      <h1>My Pets</h1>
      {error ? (
        <p>Error: {error}</p>
      ) : myPets.length === 0 ? (
        <p>No pets found.</p>
      ) : (
        myPets.map((pet) => (
          <div key={pet._id}>
            <p>Name: {pet.name}</p>
            <p>Type: {pet.type}</p>
            <p>Gender: {pet.gender}</p>
            <p>Birthday: {pet.birthday}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default MyPets;
