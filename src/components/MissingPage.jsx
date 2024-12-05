import React from "react";
import { useNavigate } from "react-router-dom";
import { missing } from "../assets";
import Footer from "./Footer";
const MissingPage = () => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(-1);
  };
  return (
    <div className="flex flex-col min-h-screen">
      <div className="text-center font-poppins ">
        <div className="flex justify-center items-center md:mt-20 sm:mt-64 mt-28 md:gap-24 sm:gap-10  xl:mt-48">
          <img
            src={missing}
            alt="img"
            className="w-[40vh]   md:w-[65vh] xl:w-[50vh] sm:w-[30vh]"
          />
          <span className="text-[#464255]">
            <p className="text-[40px] font-bold text-start">
              OOPS! <br />
              NOT FOUND
            </p>
            <p className="text-start">
              Couldn’t find that. Do you want to return to <br />
              the
              <span
                className="text-primary font-semibold cursor-pointer"
                onClick={handleNavigate}
              >
                {" "}
                previous page?
              </span>
            </p>
          </span>
        </div>
        {/* <p className="md:text-[30px] text-[28px] font-semibold">
          Oops! We couldn't find that page.
        </p> */}
        {/* <p className="md:text-[25px]">May be you find what you need here...</p> */}
      </div>
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default MissingPage;
