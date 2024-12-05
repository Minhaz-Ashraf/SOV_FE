import React from "react";
import ImageComponent from "./reusable/Input";
import { logo, logo2, mobile } from "../assets";

const Mobile = () => {
  return (
    <div className="md:hidden sm:hidden block">
      <div className="bg-primary w-screen">
        <ImageComponent src={logo2} alt="logo" className="w-28 h-14 " />
      </div>

      <div className="flex flex-col justify-center items-center font-poppins">
        <ImageComponent src={mobile} alt="img" className="w-52 mt-20" />
        <p className="text-sidebar font-semibold text-[29px] mt-3">Hey there !</p>
        <p className="text-body text-[14px] text-center mx-6 mt-6">
          Our platform is best experienced on a{" "}
          <span className="font-medium text-primary">tablet</span> or{" "}
          <span className="font-medium text-primary">Desktop</span>. Please
          switch to a larger device for full access to your account and
          services.
        </p>
      </div>
    </div>
  );
};

export default Mobile;
