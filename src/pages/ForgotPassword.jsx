import React from "react";
import Footer from "../components/Footer";
import { loginBanner, logo } from "../assets";
import ImageComponent from "../components/reusable/Input";
import ForgotPasswordComponent from './../components/login/ForgotPasswordComponent';
import { useLocation } from "react-router-dom";
import MissingPage from "../components/MissingPage";

const ForgotPassword = () => {
  const location = useLocation();
  const checkPass = location?.state?.passPage
// console.log(checkPass)

  return (
    <>
    {checkPass === "passPage" ? (
      
    <div className="flex flex-col min-h-screen font-poppins">
      <div className="flex flex-row-reverse justify-between mx-6 sm:gap-9 flex-grow">
        <span>
          <ImageComponent
            src={loginBanner}
            className="md:w-[78vh] md:h-[90vh] sm:h-[60vh] rounded-xl md:mt-6 mb-5 mr-16 object-cover sm:mt-36"
          />
        </span>
        <span>
          <header>
            <ImageComponent src={logo} alt="logo" className="w-40 h-24" />
          </header>

          <p className="text-heading font-semibold text-[27px] md:ml-20 md:mt-24 xl:mt-20 sm:mt-28 ">
        Forgot Password ?
          </p>
          <p className="text-secondary font-normal text-[16px] font-poppins md:ml-20 md:mt-2 ">
          Enter your account’s email and we’ll send you an OTP to reset your password.
          </p>
          <span className="flex flex-col bg-white rounded-md md:w-[80vh] xl:w-[80vh] sm:w-[30vh] px-10 py-9 md:ml-20 mt-3">
     

            <ForgotPasswordComponent />
          </span>
        </span>
      </div>

      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
      ) : (
        <MissingPage/>
      )}
      </>
  );
};

export default ForgotPassword;
