import React, { useState, useEffect } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";

// import { holdings } from "../data/data.js";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);

  useEffect(() => {
  const fetchHoldings = () => {
    const token = localStorage.getItem("token");
    axios
      .get("https://nivatrade-backend.onrender.com/allHoldings", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAllHoldings(res.data))
      .catch((err) => console.log(err));
  };

  fetchHoldings();

  const interval = setInterval(fetchHoldings, 30000);
  return () => clearInterval(interval);
}, []);





// const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

//   export const data = {
//   labels,
//   datasets: [
//     {
//       label: 'Dataset 1',
//       data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
//       backgroundColor: 'rgba(255, 99, 132, 0.5)',
//     },
//     {
//       label: 'Dataset 2',
//       data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
//       backgroundColor: 'rgba(53, 162, 235, 0.5)',
//     },
//   ],
// };

const labels = allHoldings.map((subArray) => subArray["name"]);   //name from allholdings

const data = {
  labels,
  datasets: [
    {
      label: 'Stock Price',
      data: allHoldings.map((stock) => stock.price ),
     backgroundColor: 'rgba(255, 99, 132, 0.5)',
   },


  ]

}

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
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      <div className="order-table">
        <table>
          <tr>
            <th>Instrument</th>
            <th>Qty.</th>
            <th>Avg. cost</th>
            <th>LTP</th>
            <th>Cur. val</th>
            <th>P&L</th>
            <th>Net chg.</th>
           
          </tr>

          {allHoldings.map((stock, index) => {
            const curValue = stock.price * stock.qty;
            const isProfit = curValue - stock.avg * stock.qty >= 0.0;
            const profClass = isProfit ? "profit" : "loss";
           

            return (
              <tr key={index}>
                <td>{stock.name}</td>
                <td>{stock.qty}</td>
                <td>{stock.avg.toFixed(2)}</td>
                <td>{stock.price.toFixed(2)}</td>
                <td>{curValue.toFixed(2)}</td>
                <td className={profClass}>
                  {(curValue - stock.avg * stock.qty).toFixed(2)}
                </td>
              <td className={profClass} style={{ fontSize: "14px", fontWeight: "600" }}>
  {(((curValue - stock.avg * stock.qty) / (stock.avg * stock.qty)) * 100).toFixed(2)}%
</td>
                
              </tr>
            );
          })}
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>
            {totalInvestment.toFixed(2)}
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
           {currentValue.toFixed(2)}
          </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          {pnl.toFixed(2)} ({pnlPercent}%)
          <p>P&L</p>
        </div>
      </div>
      <VerticalGraph data={data} />
    </>

  );
};

export default Holdings;
