import React from "react";
import Footer from "../components/Footer";
import { loginBanner, logo } from "../assets";
import ImageComponent from "../components/reusable/Input";
import LoginComponent from "../components/login/LoginComponent";

const Login = () => {
  return (
    <div className="flex flex-col min-h-screen font-poppins">
      <div className="flex flex-row-reverse justify-between mx-6 sm:gap-9 flex-grow">
        <span>
          <ImageComponent
            src={loginBanner}
            className="md:w-[78vh] md:h-[85vh] lg:h-[90vh] sm:h-[60vh] rounded-xl md:mt-6 mb-5 mr-16 object-cover sm:mt-36"
          />
        </span>
        <span>
          <header>
            <ImageComponent src={logo} alt="logo" className="w-40 h-24" />
          </header>

          <p className="text-heading font-semibold text-[27px] md:ml-20 md:mt-3 xl:mt-20 sm:mt-28 ">
            Login Your Account
          </p>

          <span className="flex flex-col bg-white rounded-md md:w-[50vh] lg:w-[80vh] xl:w-[80vh] sm:w-[30vh] px-10 py-9 md:ml-20 mt-3">
            <p className="text-secondary text-[18px] font-medium">
              Login account as a{" "}
            </p>

            <LoginComponent />
          </span>
        </span>
      </div>

      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default Login;
