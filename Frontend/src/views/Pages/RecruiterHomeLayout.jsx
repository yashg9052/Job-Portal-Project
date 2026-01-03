import Header from "../partials/Header";
import Footer from "../partials/Footer";


import { Outlet } from "react-router-dom";

const RecruiterHomeLayout = () => {
  return (
    <>
    <Header/>
    <Outlet/>
    <Footer/>
    </>
  )
}

export default RecruiterHomeLayout
