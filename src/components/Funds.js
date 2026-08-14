import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Funds.css";

const Funds = () => {
  const [funds, setFunds] = useState(0);
  const [amount, setAmount] = useState("");
  const [hasCommodityAccount, setHasCommodityAccount] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("https://nivatrade-backend.onrender.com/funds", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setFunds(res.data.funds))
      .catch((err) => console.log(err));

 
    axios
      .get("https://nivatrade-backend.onrender.com/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setHasCommodityAccount(res.data.hasCommodityAccount))
      .catch((err) => console.log(err));
  }, []);

  const handleAddFunds = () => {
    if (!amount || amount <= 0) {
      alert("Enter amount");
      return;
    }
    const token = localStorage.getItem("token");
    axios
      .post(
        "https://nivatrade-backend.onrender.com/addFunds",
        { amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setFunds(res.data.funds);
        setAmount("");
      })
      .catch((err) => alert("Failed to add funds"));
  };

  const handleWithdraw = () => {
    if (!amount || amount <= 0) {
      alert("Enter amount");
      return;
    }
    const token = localStorage.getItem("token");
    axios
      .post(
        "https://nivatrade-backend.onrender.com/withdrawFunds",
        { amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setFunds(res.data.funds);
        setAmount("");
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Failed to withdraw");
      });
  };

  const handleOpenAccount = () => {
    const token = localStorage.getItem("token");
    axios
      .post(
        "https://nivatrade-backend.onrender.com/openCommodityAccount",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setHasCommodityAccount(true);
        alert("Commodity account opened successfully!");
      })
      .catch((err) => alert("Failed to open account"));
  };

  return (
    <div className="funds-page">
      <h3 className="page-title">FUNDS</h3>
      <p className="page-subtitle">Manage your trading balance</p>

      <div className="funds-card">
        <p className="label">AVAILABLE BALANCE</p>
        <h1 className="amount">₹{funds.toFixed(2)}</h1>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="amount-input"
        />

        <div className="funds-buttons">
          <button className="btn btn-green" onClick={handleAddFunds}>
            Add Funds
          </button>
          <button className="btn btn-outline" onClick={handleWithdraw}>
            Withdraw
          </button>
        </div>
      </div>

      <p className="info-banner">
        This is your demo trading balance. Buy/Sell orders will automatically adjust this amount.
      </p>

      <div className="commodity-card">
        <p className="commodity-title">DEMAT ACCOUNT</p>

        {hasCommodityAccount ? (
          <p className="commodity-text" style={{ color: "#2ecc71" }}>
            ✅ Your Demat Account is active
          </p>
        ) : (
          <>
            <p className="commodity-text">You don't have a demat account yet</p>
            <button className="btn btn-outline" onClick={handleOpenAccount}>
              Open Account
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Funds;