import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "./Order.css";

const Orders = () => {
  const [allorders, setAllorders] = useState([]);

  const fetchorders = () => {
  const token = localStorage.getItem("token");
  axios.get("https://nivatrade-backend.onrender.com/newOrder", {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then((res) => setAllorders(res.data))
    .catch((err) => console.log(err));
};

  useEffect(() => {
    fetchorders();
  }, []);

  return (
    <div className="orders">
      {allorders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders today</p>
          <Link to={"/Funds"} className="btn">
            Get started
          </Link>
        </div>
      ) : (
        <div className="order-table-wrapper">
          <table className="order-table">
            <thead>
              <tr>
                <th>Stock</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Mode</th>
              </tr>
            </thead>
            <tbody>
              {allorders.map((order) => (
                <tr key={order._id}>
                  <td>{order.name}</td>
                  <td>{order.qty}</td>
                  <td>{order.price}</td>
                  <td>
                   <span className={order.mode?.toUpperCase() === "BUY" ? "mode-buy" : "mode-sell"}>{order.mode}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;