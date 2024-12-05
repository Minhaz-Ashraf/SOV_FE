import React from "react";
import Header from "../Header";
import AgentSidebar from "../AgentSidebar";

const EmailUpdated = () => {
  return (
    <>
      <Header customLink="/agent/shortlist" />
      <div>
        <span className="fixed overflow-y-scroll scrollbar-hide bg-white">
          <AgentSidebar />
        </span>
      </div>
      <div className="font-poppins">
        <span className="flex md:flex-row sm:flex-col items-center bg-white mt-20 md:ml-[16.5%] sm:ml-[22%] pb-6">
          <span>
            <p className="text-[28px] font-bold text-sidebar mt-6 ml-9">
              Change Email Address
            </p>
            <p className="mt-1 md:font-normal sm:font-light text-body md:pr-[8%] sm:pr-[20%] ml-9">
              Enter the OTP sent to your registered email for confirmation.
            </p>
          </span>
        </span>
        <div className="flex flex-col justify-center w-full items-center">
          <img
            src={greenCheck}
            alt="img"
            loading="lazy"
            className="w-24 h-24"
          />

          <p className="text-secondary font-poppins text-[22px] mt-6">
            Password changed successfully!
          </p>
          <p className="text-green-500 font-poppins text-[16px]">
            We’re redirecting you to the login page...
          </p>
        </div>
      </div>
    </>
  );
};

export default EmailUpdated;
