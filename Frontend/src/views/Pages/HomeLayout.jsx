import React from "react";
import HomePage from "./HomePage";
import { Outlet } from "react-router-dom";
import Header from "../partials/Header";
import Footer from "../partials/Footer";

const HomeLayout = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default HomeLayout;
