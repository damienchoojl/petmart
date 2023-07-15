// //* for development -> on laptop
// const SERVER = "???";

// fetch("/hi")
//   .then((res) => res.json())
//   .then((data) => console.log(data));

// //* for deployment -> on internet
// fetch(`${SERVER}/hi`)
//   .then((res) => res.json())
//   .then((data) => console.log(data));

// function App() {
//   return (
//     <div className="App">
//       <h1>MERN</h1>
//     </div>
//   );
// }

// export default App;

import { useState } from "react";
import "./App.css";
import NewOrderPage from "../NewOrderPage/NewOrderPage";
import AuthPage from "../AuthPage/AuthPage";
import { Route, Routes } from "react-router-dom";
import OrderHistoryPage from "../OrderHistoryPage/OrderHistoryPage";
import NavBar from "../../components/NavBar/NavBar";
import { getUser } from "../../utilities/users-service";

export default function App() {
  const [user, setUser] = useState(getUser());

  return (
    <main className="App">
      {user ? (
        <>
          <NavBar user={user} setUser={setUser} />
          <Routes>
            <Route path="/orders/new" element={<NewOrderPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
          </Routes>
        </>
      ) : (
        <AuthPage setUser={setUser} />
      )}
    </main>
  );
}
