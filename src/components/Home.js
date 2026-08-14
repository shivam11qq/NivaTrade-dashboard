import React, { useEffect } from "react";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";

const Home = () => {

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const username = params.get("username");

  if (token) {
    localStorage.setItem("token", token);
     window.history.replaceState({}, document.title, "/");
  }
}, []);

  return (
    <>
      <TopBar />
      <Dashboard />
    </>
  );
};

export default Home;