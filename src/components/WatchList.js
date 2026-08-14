import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { watchlist } from '../data/data'
import GeneralContext from './GeneralContext';
import { DoughnoutChart } from './DoughnoutChart';

const labels = watchlist.map((subArray) => subArray["name"]);

const WatchList = () => {
  const [allWatchList, setAllWatchList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchWatchList = () => {
    const token = localStorage.getItem("token");

    axios
      .get("https://nivatrade-backend.onrender.com/watchlist", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAllWatchList(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchWatchList();

    const interval = setInterval(() => {
      fetchWatchList();
    }, 30000);

    return () => clearInterval(interval);
  }, []);


  const mergedWatchlist = watchlist.map((stock) => {
    const liveStock = allWatchList.find((item) => item.name === stock.name);
    return {
      ...stock,
      price: liveStock ? liveStock.price : stock.price,
    };
  });
   const filteredWatchlist = mergedWatchlist.filter((stock) =>
  stock.name.toLowerCase().includes(searchTerm.toLowerCase())
);

  const data = {
    labels,
    datasets: [
      {
        label: 'Price',
        data: mergedWatchlist.map((stock) => stock.price),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="watchlist-container">
     <div className="search-container">
  <input
    type="text"
    name="search"
    id="search"
    placeholder="Search eg:MSFT, AMZN,.."
    className="search"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <span className="counts"> {filteredWatchlist.length} / 50</span>
</div>

      <ul className="list">
  {filteredWatchlist.map((stock, index) => {
    return (
      <WatchlistItem stock={stock} key={index} />
    )
  })}
</ul>

      <DoughnoutChart data={data} />
    </div>
  )
}

export default WatchList


const WatchlistItem = ({ stock }) => {
  const [showWatchlistActions, setShowWatchlistActions] = useState(false);

  const handleMousehover = () => {
    setShowWatchlistActions(true);
  }

  const handleMousenothover = () => {
    setShowWatchlistActions(false);
  };

  return (
    <li onMouseEnter={handleMousehover} onMouseLeave={handleMousenothover}>
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>
          {stock.name}
        </p>
        <div className="itemInfo">
          <span className='percent'>{stock.percent}</span>
          {stock.isDown ? (
            <span className="down">⬇️</span>
          ) : (
            <span className="up">⬆️</span>
          )}

          <span className="price">{stock.price}</span>
        </div>
      </div>

      {showWatchlistActions && <WatchListActions uid={stock.name} />}
    </li>
  );
};


const WatchListActions = ({ uid }) => {

  const { openBuyWindow, openSellWindow } = useContext(GeneralContext);

  const handleBuyClick = () => {
    console.log("CLICKED", uid);
    openBuyWindow(uid);
  };

  const handleSellClick = () => {
    console.log("CLICKED", uid);
    openSellWindow(uid);
  };

  return (
    <span className="actions">
      <span>
        <button
          className="buy"
          title="Buy"
          onClick={handleBuyClick}
        >
          BUY
        </button>

        <button
          className="sell"
          title="Sell"
          onClick={handleSellClick}
        >
          SELL
        </button>

       

        

      </span>
    </span>
  )
}