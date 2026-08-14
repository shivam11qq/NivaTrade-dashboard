import React, { useState, useEffect } from "react";
import axios from "axios";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);
const fetchPositions = () => {
  const token = localStorage.getItem("token");

  axios
    .get("https://nivatrade-backend.onrender.com/allPositions", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      setAllPositions(res.data);
    })
    .catch((err) => console.log(err));
};

useEffect(() => {
  fetchPositions();

  const interval = setInterval(() => {
    fetchPositions();
  }, 30000);

  return () => clearInterval(interval);
}, []);

  return (
    <>
      <h3 className="title">Positions ({allPositions.length})</h3>
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty</th>
              <th>Avg</th>
              <th>LTP</th>
              <th>P&L</th>
           
            </tr>
          </thead>
          <tbody>
            {allPositions.map((item, index) => {
              const curValue = item.price * item.qty;
              const isProfit = curValue - item.avg * item.qty >= 0.0;
              const profClass = isProfit ? "profit" : "loss";
            

              return (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.qty}</td>
                  <td>{item.avg.toFixed(2)}</td>
                  <td>{item.price.toFixed(2)}</td>
                  <td className={profClass} style={{ fontSize: "14px", fontWeight: "600" }}>
                    {(curValue - item.avg * item.qty).toFixed(2)}
                  </td>
                
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Positions;