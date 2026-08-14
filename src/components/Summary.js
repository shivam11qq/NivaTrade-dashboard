import React, { useState, useEffect } from "react";
import axios from "axios";

const Summary = () => {
  const [username, setUsername] = useState("User");
  const [funds, setFunds] = useState(0);
  const [allHoldings, setAllHoldings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

  
    axios.get("https://nivatrade-backend.onrender.com/me", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      setUsername(res.data.username);
    }).catch((err) => console.log(err));

  
    axios.get("https://nivatrade-backend.onrender.com/funds", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      setFunds(res.data.funds);
    }).catch((err) => console.log(err));

   
    axios.get("https://nivatrade-backend.onrender.com/allHoldings", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      setAllHoldings(res.data);
    }).catch((err) => console.log(err));

  }, []);


  let totalInvestment = 0;
  let currentValue = 0;

  for (let i = 0; i < allHoldings.length; i++) {
    totalInvestment = totalInvestment + (allHoldings[i].avg * allHoldings[i].qty);
    currentValue = currentValue + (allHoldings[i].price * allHoldings[i].qty);
  }

  const pnl = currentValue - totalInvestment;
  const pnlPercent = totalInvestment > 0 ? ((pnl / totalInvestment) * 100).toFixed(2) : 0;

  return (
    <>
      <div className="username">
        <h6>WELCOME, {username}!</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>{funds.toFixed(2)}</h3>
            <p>Margin available</p>
          </div>

          <hr/>

          <div className="second">
            
            <p>
              Opening balance <span>{funds.toFixed(2)}</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings ({allHoldings.length})</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className={pnl >= 0 ? "profit" : "loss"}>
              {pnl.toFixed(2)} <small>({pnlPercent}%)</small>{" "}
            </h3>
            <p>P&L</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Current Value <span>{currentValue.toFixed(2)}</span>{" "}
            </p>
            <p>
              Investment <span>{totalInvestment.toFixed(2)}</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;