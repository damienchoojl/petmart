import { useEffect, useState } from "react";
import "./App.css";
import AuthPage from "../AuthPage/AuthPage";
import { Route, Routes } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import { getUser } from "../../utilities/users-service";
import MainPage from "../MainPage/MainPage";
import ItemDetailsPage from "../ItemDetailsPage/ItemDetailsPage";
import Brand from "../../components/NavBar/Brand";
import Cat from "../../components/NavBar/Cat";
import Dog from "../../components/NavBar/Dog";
import CatFoodItems from "../CatItemTypes/CatFoodItems";
import CatTreatItems from "../CatItemTypes/CatTreatItems";
import CatHealthcareItems from "../CatItemTypes/CatHealthcareItems";
import DogFoodItems from "../DogItemTypes/DogFoodItems";
import DogTreatItems from "../DogItemTypes/DogTreatItems";
import DogHeathcareItems from "../DogItemTypes/DogHealthcareItems";
import Cart from "../Cart/Cart";
import PurchasedConfirmationPage from "../PurchasedConfirmationPage/PurchasedConfirmationPage";
import BrandDetailsPage from "../BrandDetailsPage/BrandDetailsPage";
import Favourite from "../Favourite/Favourite";
import Profile from "../Profile/Profile";
import MyPets from "../Profile/MyPets";
import PurchasedHistory from "../Profile/PurchasedHistory";

export default function App() {
  const [user, setUser] = useState(getUser());

  // Update the user state whenever the user changes
  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <main className="App">
      {user ? (
        <>
          <NavBar user={user} setUser={setUser} />
          <Routes>
            <Route path="/mainpage" element={<MainPage user={user} />} />
            <Route path="/cart" element={<Cart user={user} />} />
            <Route
              path="/cart/confirmation"
              element={<PurchasedConfirmationPage user={user} />}
            />
            <Route
              path="/items/:name"
              element={<ItemDetailsPage user={user} />}
            />
            <Route path="/brand" element={<Brand />} />
            <Route path="/brand/:name" element={<BrandDetailsPage />} />
            <Route path="/cat" element={<Cat />} />
            <Route path="/cat/food" element={<CatFoodItems />} />
            <Route path="/cat/treat" element={<CatTreatItems />} />
            <Route path="/cat/healthcare" element={<CatHealthcareItems />} />
            <Route path="/dog" element={<Dog />} />
            <Route path="/dog/food" element={<DogFoodItems />} />
            <Route path="/dog/treat" element={<DogTreatItems />} />
            <Route path="/dog/healthcare" element={<DogHeathcareItems />} />
            <Route
              path="/favourite/:userId"
              element={<Favourite user={user} />}
            />
            <Route path="/profile/:userId" element={<Profile user={user} />} />
            <Route path="/mypets/:userId" element={<MyPets user={user} />} />
            <Route
              path="/purchasedhistory/:userId"
              element={<PurchasedHistory user={user} />}
            />
          </Routes>
        </>
      ) : (
        <AuthPage setUser={setUser} />
      )}
    </main>
  );
}
