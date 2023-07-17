import { useState } from "react";
import "./App.css";
import NewOrderPage from "../NewOrderPage/NewOrderPage";
import AuthPage from "../AuthPage/AuthPage";
import { Route, Routes } from "react-router-dom";
import OrderHistoryPage from "../OrderHistoryPage/OrderHistoryPage";
import NavBar from "../../components/NavBar/NavBar";
import { getUser } from "../../utilities/users-service";
import MainPage from "../MainPage/MainPage";
import ItemDetailsPage from "../ItemDetailsPage/ItemDetailsPage";
import Brand from "../../components/NavBar/Brand";
import Cat from "../../components/NavBar/Cat";
import Dog from "../../components/NavBar/Dog";

export default function App() {
  const [user, setUser] = useState(getUser());

  return (
    <main className="App">
      {user ? (
        <>
          <NavBar user={user} setUser={setUser} />
          <Routes>
            <Route path="/orders/new" element={<NewOrderPage user={user} />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/mainpage" element={<MainPage />} />
            <Route
              path="/items/:itemId"
              element={<ItemDetailsPage user={user} />}
            />
            <Route path="/brand" element={<Brand />} />
            <Route path="/cat" element={<Cat />} />
            <Route path="/dog" element={<Dog />} />
          </Routes>
        </>
      ) : (
        <AuthPage setUser={setUser} />
      )}
    </main>
  );
}
