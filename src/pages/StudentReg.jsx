import React, { lazy, Suspense, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getStudentData } from "../features/studentSlice";
import ImageComponent, { CustomLnkButton } from "../components/reusable/Input";
import { logo } from "../assets";
import { IoMdCheckmark } from "react-icons/io";
import MissingPage from "../components/MissingPage";
import { MdLogout } from "react-icons/md";
import LogoutPop from "../components/login/LogoutPop";
// Lazy load the form components
const Form1 = lazy(() => import("../student/Form1"));
const Form2 = lazy(() => import("../student/Form2"));
const Form3 = lazy(() => import("../student/Form3"));
import Header from "./../components/dashboardComp/Header";
import AgentSidebar from "../components/dashboardComp/AgentSidebar";

const StudentReg = () => {
  const dispatch = useDispatch();
  const formArray = [1, 2, 3];
  const formNames = [
    "Personal Information",
    "Address Information",
    "Preferences",
  ];
  let { page } = useParams();
  const navigate = useNavigate();
  const studentId = localStorage.getItem("student");
  const role = localStorage.getItem("role");
  const location = useLocation();
  const [isLogoutOpen, setisLogoutOpen] = useState(false);
console.log(location)
  const openLogoutPopup = () => {
    setisLogoutOpen(true);
  };

  const closeLogout = () => {
    setisLogoutOpen(false);
  };
  console.log(page);
  useEffect(() => {
    if (!page || isNaN(page) || page < 1 || page > formArray.length) {
      navigate(`/student-form/1`);
    }
    dispatch(getStudentData(studentId));
  }, [page, navigate, formArray.length, dispatch]);

  return (
    <>
      <div className="font-poppins">
        {role === "2" ? (
          <>
            <Header />{" "}
            <span className="fixed overflow-y-scroll scrollbar-hide  bg-white ">
              <AgentSidebar />
            </span>{" "}
          </>
        ) : (
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
              <span
                onClick={openLogoutPopup}
                className="text-white bg-primary py-1 px-1 rounded-md text-[22px] cursor-pointer"
              >
                <MdLogout />
              </span>
            </span>
          </header>
        )}
        <div className="w-full">
          {/* Stepper Navigation */}
          <div
            className={`flex flex-col items-center ${
              role === "2" ? "bg-[#FBD5D5] pt-20 md:ml-36 md:px-0 md:pl-0 sm:px-6 sm:pl-[27%] " : "bg-primary"
            }  w-full`}
          >
            <div className="flex justify-center items-center w-full">
              {formArray.map((v, i) => (
                <React.Fragment key={i}>
                  {/* Stepper Circle */}
                  <div
                    className={`w-[50px] my-3 mt-5 registration mb-2 text-medium flex justify-center items-center ${
                      i < page - 1
                        ? role === "2"
                          ? "bg-primary"
                          : "bg-white"
                        : i === page - 1
                        ? role === "2"
                          ? "bg-primary text-white" // Role 2: Current step
                          : "bg-white text-primary" // Default: Current step
                        : role === "2"
                        ? "border border-primary text-primary" // Role 2: Next steps
                        : "border border-white text-white" // Default: Next steps
                    } md:h-[46px] h-[32px] sm:h-[50px] rounded-md`}
                  >
                    {i < page - 1 ? (
                      <span
                        className={`${
                          role === "2" ? "text-white" : "text-primary"
                        }`}
                      >
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
                      className={`w-[200px] h-[2px] mx-2 mt-4 ${
                        i < page - 1
                          ? role === "2"
                            ? "bg-primary" // Role 2: Completed steps
                            : "bg-[#FCFCFC]" // Default: Completed steps
                          : role === "2"
                          ? "bg-[#ff7878]" // Role 2: Incomplete steps
                          : "bg-[#d8d8d8]" // Default: Incomplete steps
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Page Names Below Stepper */}
            <div className="flex justify-center items-center w-full">
              {formNames.map((name, i) => (
                <div key={i} className={` text-center  mb-6 md:mx-8 sm:mx-0 w-[200px]`}>
                  <p
                    className={`text-[14px] ${
                      i === parseInt(page) - 1
                        ? role === "2"
                          ? "text-primary font-poppins" // Role 2: Current step name
                          : "text-white font-poppins" // Default: Current step name
                        : role === "2"
                        ? "text-primary" // Role 2: Other steps
                        : "text-white" // Default: Other steps
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
            {(page === "1" && (location?.state === "passPage" ||
            location?.state?.passPage === "passPage")) ? (
              <Form1
                page={page}
                hide={false}
                customClass={`${
                  role === "2"
                    ? "md:ml-[25%] md:mr-[8%] sm:mx-6 sm:ml-[27%]"
                    : "md:mx-72 sm:mx-10"
                }`}
              />
            ) : (
              page === "1" && <MissingPage />
            )}
            {(page === "2" && (location?.state === "passPage" ||
            location?.state?.passPage === "passPage")) ? (
              <Form2
                hide={false}
                page={page}
                customClass={`${
                  role === "2"
                    ? "md:ml-[25%] md:mr-[8%]  sm:mx-6 sm:ml-[27%]"
                    : "md:mx-72 sm:mx-10"
                }`}
              />
            ) : (
              page === "2" && <MissingPage />
            )}
            {(page === "3" && (location?.state === "passPage" ||
            location?.state?.passPage === "passPage")) ? (
              <Form3
                page={page}
                hide={false}
                customClass={`${
                  role === "2"
                    ? "md:ml-[25%] md:mr-[8%] sm:mx-6 sm:ml-[27%] pb-20"
                    : "md:mx-72 sm:mx-10 pb-20"
                }`}
              />
            ) : (
              page === "3" && <MissingPage />
            )}
          </Suspense>
        </div>
      </div>
      <LogoutPop isLogoutOpen={isLogoutOpen} closeLogout={closeLogout} />
    </>
  );
};

export default StudentReg;
