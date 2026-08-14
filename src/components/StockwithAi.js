import React, { useState, useEffect } from "react";
import axios from "axios";
import { watchlist } from "../data/data";
import "./StockwithAi.css";

const StockwithAi = () => {

  const [selectedStock, setSelectedStock] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [liveWatchlist, setLiveWatchlist] = useState([]);

  
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("https://nivatrade-backend.onrender.com/watchlist", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setLiveWatchlist(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleAnalyze = () => {

    if (selectedStock === "") {
      alert("Please select a stock");
      return;
    }

    
    let staticStock = null;
    for (let i = 0; i < watchlist.length; i++) {
      if (watchlist[i].name === selectedStock) {
        staticStock = watchlist[i];
      }
    }


    let livePrice = null;
    for (let i = 0; i < liveWatchlist.length; i++) {
      if (liveWatchlist[i].name === selectedStock) {
        livePrice = liveWatchlist[i].price;
      }
    }

   
    const finalPrice = livePrice !== null ? livePrice : staticStock.price;

    const stockData = {
      name: staticStock.name,
      price: finalPrice,
      percent: staticStock.percent,
    };

    setLoading(true);

    const token = localStorage.getItem("token");

    axios
      .post(
        "https://nivatrade-backend.onrender.com/analyzeStock",
        {
          stockName: stockData.name,
          price: stockData.price,
          dayChange: stockData.percent,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setResult(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        alert("Something went wrong");
      });
  };

  return (
    <div className="advisor-page">

      <h3>✨ AI Stock Advisor :-</h3>
      <p>Get AI-powered insights on any stock</p>

      <select
        value={selectedStock}
        onChange={(e) => setSelectedStock(e.target.value)}
      >
        <option value="">-- Select a stock --</option>
        {watchlist.map((stock, index) => (
          <option key={index} value={stock.name}>
            {stock.name}
          </option>
        ))}
      </select>

      <button onClick={handleAnalyze}>Analyze</button>

      {loading && <p>Analyzing with AI...</p>}

      {result && (
        <div className="result-card">
          <h2>{result.stockName}</h2>
          <p>₹{result.price} ({result.dayChange}% today)</p>

          <p>
            You hold {result.userQty} shares worth ₹{result.userValue}
            ({result.portfolioPercent}% of your portfolio)
          </p>

          <h4>AI Insight:</h4>
          <p>{result.aiInsight}</p>
        </div>
      )}

    </div>
  );
};

export default StockwithAi;
