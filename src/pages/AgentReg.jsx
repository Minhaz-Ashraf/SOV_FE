import React, { lazy, Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ImageComponent, { CustomLnkButton } from "../components/reusable/Input";
import { logo } from "../assets";
import { IoMdCheckmark } from "react-icons/io";
import { agentInformation } from "../features/agentSlice";
import MissingPage from "../components/MissingPage";
import { MdLogout } from "react-icons/md";
import LogoutPop from "../components/login/LogoutPop";

// Lazy load the form components
const Form1 = lazy(() => import("../agent/AgentForm1"));
const Form2 = lazy(() => import("../agent/AgentForm2"));
const Form3 = lazy(() => import("../agent/AgentForm3"));
const Form4 = lazy(() => import("../agent/AgentForm4"));
const Form5 = lazy(() => import("../agent/AgentForm5"));
const Form6 = lazy(() => import("../agent/AgentForm6"));

const AgentReg = () => {
  const formArray = [1, 2, 3, 4, 5, 6];
  const formNames = [
    "Company Details",
    "Contact Details",
    "Bank Details",
    "Company Overview",
    "Company Operations",
    "Additional Information",
  ];

  let { page } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
 const location = useLocation()
 const [isLogoutOpen, setisLogoutOpen] = useState(false);

 const openLogoutPopup = () => {
   setisLogoutOpen(true);
 };

 const closeLogout = () => {
   setisLogoutOpen(false);
 };
  useEffect(() => {
    dispatch(agentInformation());
  }, [dispatch]);
  console.log(location)

  // Ensure 'page' is an integer and falls within the correct range
  useEffect(() => {
    if (!page || isNaN(page) || page < 1 || page > formArray.length) {
      navigate(`/agent-form/1`, { state: "passPage" });
    }
  }, [page, navigate, formArray.length]);

  return (
    <>
      <div className="font-poppins">
      <header className="flex flex-row items-center justify-between mx-8 font-poppins mb-2">
          <ImageComponent src={logo} alt="logo" className="w-40 h-24" />
          <span className="flex items-center gap-6">
          <span>
          <CustomLnkButton
            text="Login"
            className="px-6 py-2 text-white bg-primary rounded-md cursor-pointer"
            link="/login"
          />
          </span>
          <span onClick={openLogoutPopup} className="text-white bg-primary py-1 px-1 rounded-md text-[22px] cursor-pointer"> 
          <MdLogout/></span>
          </span>
        </header>
        <div className="w-full">
          {/* Stepper Navigation */}
          <div className="flex flex-col items-center bg-primary w-full">
            <div className="flex justify-center items-center w-full">
              {formArray.map((v, i) => (
                <React.Fragment key={i}>
                  {/* Stepper Circle */}
                  <div
                    className={`w-[50px] my-3 mt-5 registration mb-2 text-medium flex justify-center items-center ${
                      i < page - 1
                        ? "bg-white"
                        : i === page - 1
                        ? "bg-white text-primary" 
                        : "border border-white text-white" 
                    } md:h-[46px] h-[32px] sm:h-[50px] rounded-md`}
                  >
                    {i < page - 1 ? (
                      <span className="text-primary">
                        <IoMdCheckmark />
                      </span>
                    ) : (
                      v
                    )}
                  </div>
                  {/* Line between steps */}
                  {i !== formArray.length - 1 && (
                    <div
                      key={`line-${i}`}
                      className={`w-[130px] h-[2px] mx-2 mt-4 ${
                        i < page - 1 ? "bg-[#FCFCFC]" : "bg-[#d8d8d8]"
                      }`} // Black line for completed steps
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Page Names Below Stepper */}
            <div className="flex justify-center items-center w-full">
              {formNames.map((name, i) => (
                <div key={i} className="w-[130px] text-center mx-8 mb-6">
                  <p
                    className={`text-[14px] ${
                      i === parseInt(page) - 1
                        ? "text-white font-normal" // Current step name
                        : "text-white"
                    }`}
                  >
                    {name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <Suspense fallback={<div>Loading...</div>}>
          {page === "1" && location.state === "passPage" ? (
              <Form1 page={page}   hide={false} />
            ) : (
              page === "1" && <MissingPage />
            )}
            {page === "2" && location.state === "passPage" ? (
              <Form2 page={page}   hide={false}/>
            ) : (
              page === "2" && <MissingPage />
            )}
            {page === "3" && location.state === "passPage" ? (
              <Form3 page={page}   hide={false}/>
            ) : (
              page === "3" && <MissingPage />
            )}
            {page === "4" && location.state === "passPage" ? (
              <Form4 page={page}   hide={false}/>
            ) : (
              page === "4" && <MissingPage />
            )}
            {page === "5" && location.state === "passPage" ? (
              <Form5 page={page}   hide={false}/>
            ) : (
              page === "5" && <MissingPage />
            )}
            {page === "6" && location.state === "passPage" ? (
              <Form6 page={page}   hide={false}/>
            ) : (
              page === "6" && <MissingPage />
            )}
          </Suspense>
        </div>
      </div>
      <LogoutPop isLogoutOpen={isLogoutOpen} closeLogout={closeLogout} />

    </>
  );
};

export default AgentReg;
