// export default function NewOrderPage() {
//   return <h1>NewOrderPage</h1>;
// }

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function NewOrderPage({ user }) {
  const [accountData, setAccountData] = useState(null);

  useEffect(() => {
    fetchAccountData();
  }, [user]);

  const fetchAccountData = async () => {
    try {
      const response = await axios.get("/api/accounts");
      setAccountData(response.data[0]); // Assuming there is only one account in the response
      // setAccountData(response.data);
    } catch (error) {
      console.error("Failed to fetch account data:", error);
    }
  };

  return (
    <div>
      <h1>New Order</h1>
      {accountData && (
        <div>
          <h2>User: {accountData.user.name}</h2>
          <h3>Favourites: {accountData.favourites.length}</h3>
          <h3>My Pets:</h3>
          <ul>
            {accountData.myPets.map((pet) => (
              <div key={pet._id}>
                Name: {pet.name}, Type: {pet.type}, Gender: {pet.gender},
                Birthday: {new Date(pet.birthday).toLocaleDateString()}
              </div>
            ))}
          </ul>
          <h3>Purchased History: {accountData.purchasedHistory.length}</h3>
          <h3>Items in Cart: {accountData.itemInCart.length}</h3>
        </div>
      )}
    </div>
  );
}
