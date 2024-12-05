import React from "react";
import { waiting } from "../assets";
import { Link } from "react-router-dom";

const WaitingPage = () => {

  const role = localStorage.getItem('role');
  return (
    <>
      <div
        className={`${
         role === "2"
            ? "bg-agent"
            : role === "3"
            ? "bg-student"
            : "bg-agent"
        } relative `}
      >
        <div className="  font-poppins popup-backdrop  pt-7">
          <div className="bg-white flex flex-col justify-center items-center w-[100vh] mx-[25%] rounded-md">
            {" "}
            <img src={waiting} alt="img" className="w-[320px]" />
            <span className="text-start">
              <p className="font-bold text-[27px] text-sidebar ">
                Your Account is Under Review
              </p>
              <p className="text-body font-normal text-[14px] mt-4">
                {" "}
                Thanks for your patience,{" "}
                <span className="font-semibold"> Mark Peterson.</span> Our team
                is currently <br />
                verifying the details you provided during registration.
              </p>
              <p className="text-body font-normal text-[14px] mt-4">
                This process usually takes up to 3 days. Once your <br />
                information is verified, you’ll be able to access your full
                account.
              </p>
              <p className="text-body font-normal text-[14px] mt-4">
                Please check your email regularly for updates. Our team is
                working <br />
                hard to get your account ready as soon as possible.
              </p>
            </span>
            <Link
              to="/login"
              className="rounded-md text-white cursor-pointer  bg-primary px-6 py-2 mt-7 mb-6"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default WaitingPage;
