import { checkToken } from "../../utilities/users-service";

export default function OrderHistoryPage() {
  function handleCheckToken() {
    const expDate = checkToken();
    console.log(expDate);
  }

  return (
    <div>
      <h1>Order History</h1>
      <button onClick={handleCheckToken}>Check When My Login Expires</button>
    </div>
  );
}
