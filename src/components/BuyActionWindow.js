import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);

  
  const { closeBuyWindow } = useContext(GeneralContext);

  const [showToast, setShowToast] = useState(false);

  const handleBuyClick = () => {
  const token = localStorage.getItem("token"); 

  axios.post(
      "https://nivatrade-backend.onrender.com/newOrder",
      {
        name: uid,
        qty: stockQuantity,
        price: stockPrice,
        mode: "BUY",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then(() => {
      setShowToast(true); // popup of order buyed
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    })
   .catch((err) => {
  const message = err.response?.data?.message || "Order failed";
  alert(message);
  console.log(err);
});
};

  const handleCancelClick = () => {
    closeBuyWindow();
  };

  return (
    <>
      {showToast && (
        <div className="toast-msg">✅ Order Buyed Successfully!</div>      //message of popup
      )}

      <div className="container" id="buy-window" draggable="true">
        <div className="regular-order">
          <div className="inputs">
            <fieldset>
              <legend>Qty.</legend>
              <input
                type="number"
                name="qty"
                id="qty"
                onChange={(e) => setStockQuantity(e.target.value)}
                value={stockQuantity}
              />
            </fieldset>
            <fieldset>
              <legend>Price</legend>
              <input
                type="number"
                name="price"
                id="price"
                step="0.05"
                onChange={(e) => setStockPrice(e.target.value)}
                value={stockPrice}
              />
            </fieldset>
          </div>
        </div>

        <div className="buttons">
          {/* <span>Margin required ₹140.65</span> */}
          <div>
            <Link className="btn btn-blue" onClick={handleBuyClick}>
              Buy
            </Link>
            <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default BuyActionWindow;