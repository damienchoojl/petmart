import { Link, useLocation } from "react-router-dom";

export default function PurchasedConfirmationPage({ user }) {
  const location = useLocation();
  const orderId = location.state?.orderId;
  const purchasedItems = location.state?.items || [];

  return (
    <div className="orderConfirmation">
      <div className="orderBorderBottom">
        <h1>Order has been Confirmed!</h1>
        <p>Hi {user.name}, Thank you for your purchase!</p>
        <br />
        <h2>Order Details</h2>
        <p>Order ID: {orderId}</p>
        <ul>
          {purchasedItems.map((item) => (
            <li key={item._id}>
              {item.name} - Quantity: {item.quantity} - Amount: $
              {(item.price * item.quantity).toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
      <br />
      <Link to={"/mainpage"}>
        <div className="ticketMainButton">
          <button>Return to Main</button>
        </div>
      </Link>
    </div>
  );
}
