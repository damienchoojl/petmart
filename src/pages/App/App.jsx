import { useState } from "react";
import "./App.css";
import NewOrderPage from "../NewOrderPage/NewOrderPage";
import AuthPage from "../AuthPage/AuthPage";
import { Route, Routes } from "react-router-dom";
import OrderHistoryPage from "../OrderHistoryPage/OrderHistoryPage";
import NavBar from "../../components/NavBar/NavBar";
import { getUser } from "../../utilities/users-service";
import MainPage from "../MainPage/MainPage";

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
          </Routes>
        </>
      ) : (
        <AuthPage setUser={setUser} />
      )}
    </main>
  );
}
