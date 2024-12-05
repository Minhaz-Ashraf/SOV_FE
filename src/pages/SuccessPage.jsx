import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import Footer from "../components/Footer";
import { loginBanner, logo } from "../assets";
import ImageComponent from "../components/reusable/Input";
import { SuccessComp } from "../components/login/SuccessComp";
import MissingPage from "../components/MissingPage";

const SuccessPage = () => {
  const navigate = useNavigate(); 
  const location = useLocation();
  const checkPass = location?.state?.passPage
console.log(checkPass)
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]); 

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

          <span className="flex flex-col bg-white mt-20 border border-green-500 rounded-md md:w-[80vh] xl:w-[80vh] sm:w-[30vh] px-10 py-9 md:ml-20 ">
            <SuccessComp />
          </span>
        </span>
      </div>

      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  ) : (
        <MissingPage />
      )}
      </>
  );
};

export default SuccessPage;
