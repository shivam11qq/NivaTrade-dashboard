import React from "react";
import { Link } from "react-router-dom";
import "./Apps.css";

const appsList = [
  {
    name: "AI Stock Advisor:-",
    description: "Get AI-powered risk insights on any stock",
    icon: "✨",
    link: "/apps/StockwithAi",
  },
  {
    name: "Portfolio Analyzer:-",
    description: "Visualize your holdings breakdown",
    icon: "📊",
    link: "/holdings",
  },
];

const Apps = () => {
  return (
    <div className="apps-page">
      <h1 className="page-title fs-90px">Apps</h1>
      <p className="page-subtitle">Explore tools to enhance your trading</p>

      <div className="apps-grid">
        {appsList.map((app, index) => (
          <Link to={app.link} className="app-card" key={index}>
            <div className="app-icon">{app.icon}</div>
            <h4>{app.name}</h4>
            <p>{app.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Apps;