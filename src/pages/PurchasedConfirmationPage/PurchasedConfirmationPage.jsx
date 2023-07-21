import { Link, useLocation } from "react-router-dom";
import "../PurchasedConfirmationPage/PurchasedConfirmationPage.css";

export default function PurchasedConfirmationPage({ user }) {
  const location = useLocation();
  const orderId = location.state?.orderId;
  const purchasedItems = location.state?.items || [];

  // Function to calculate the subtotal of the order
  const calculateSubtotal = () => {
    let subtotal = 0;
    purchasedItems.forEach((item) => {
      subtotal += item.price * item.quantity;
    });
    return subtotal.toFixed(2);
  };

  // Function to calculate the total amount of the order (subtotal + tax + shipping, etc., if applicable)
  const calculateTotalAmount = () => {
    return calculateSubtotal();
  };

  return (
    <div className="orderConfirmation">
      <div className="orderBorderBottom">
        <h1>Order has been Confirmed!</h1>
        <p>Hi {user.name}, Thank you for your purchase!</p>
        <br />
        <h2>Order Details</h2>
        <p>Order ID: {orderId}</p>
        <table className="item-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {purchasedItems.map((item) => (
              <tr key={item._id}>
                <td>
                  <img
                    src={item.image1}
                    alt={item.name}
                    style={{ width: "100px" }}
                  />
                  <p>{item.name}</p>
                </td>
                <td>{item.quantity}</td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="total-section">
          <div className="subtotal">
            <div className="subtotal-text">
              Sub Total ({purchasedItems.length} items)
            </div>
          </div>
          <div className="total-amount">
            <div className="total-text">Total Amount:</div>
            <div className="total-amount-value">${calculateTotalAmount()}</div>
          </div>
        </div>
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
