import React from "react";
import { logo } from "../assets";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import ImageComponent from "../components/reusable/Input";
import Mobile from "../components/Mobile";

const Home = () => {
  return (
    <>
    <Mobile/>
    <div className="sm:block md:block hidden">
    <div className="flex flex-col min-h-screen">

      <header>
        <ImageComponent src={logo} alt="logo" className="w-40 h-24 ml-6" />
      </header>

      <main className="flex-grow">
        <div className="flex flex-col justify-center items-center md:pt-28 sm:pt-56">
          <p className="font-bold text-[48px]">
            Welcome to <span className="text-primary">SOV Portal</span>
          </p>
          <p className="text-secondary font-medium text-[17px] md:px-[36%] sm:px-[25%] text-center pt-2">
            Your Gateway to the most transparent admission & visa filling
            process
          </p>

          <Link
            to="/new-account"
            className="px-6 py-2 text-white bg-primary rounded-md mt-9 cursor-pointer"
          >
            Let's Start
          </Link>
        </div>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
    </div>
    </>
  );
};

export default Home;
