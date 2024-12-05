import React from "react";
import { useNavigate } from "react-router-dom";

const PopUp = ({
  isPopUp,
  PopUpClose,
  src,
  text,
  heading,
  text1,
  text3,
  text4,
}) => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const handleNavigate = () => {
    {
      (heading === "Offer Letter Form Submitted" ||
        heading === "Visa Form Submitted" ||
        heading === "Course Fee Form Submitted") &&
      role === "2"
        ? navigate("/agent/applications")
        : (heading === "Offer Letter Form Submitted" ||
            heading === "Visa Form Submitted" ||
            heading === "Course Fee Form Submitted") &&
          role === "3"
        ? navigate("/student/dashboard")
        : heading === "Successfully Registered" && role === "2"
        ? navigate("/agent/student-lists")
        : navigate("/login");
    }
  };
  return (
    <>
      {isPopUp && (
        <div
          className={`fixed inset-0 flex items-center justify-center popup-backdrop z-50  sm:px-52  px-6 ${
            isPopUp ? "block" : "hidden"
          }`}
        >
          <div className="bg-white pb-9  rounded-lg md:w-[68%] w-full  relative p-9  flex flex-col items-center justify-center">
            <span>
              <img src={src} alt="img" className="pt-6 w-44 pb-6" />
            </span>
            <span>
              <p className="font-bold  text-center   text-[25px]">{heading}</p>
              <p className="font-DMsans text-secondary font-light pt-3 text-[16px] text-center font-universal">
                {text1}
              </p>
              <p className="font-DMsans text-secondary font-light pt-3 text-[16px] text-center font-universal">
                {text}
              </p>
              <p className="font-DMsans text-secondary font-light pt-3 text-[16px] text-center font-universal">
                {text3} <br />
                {text4}
              </p>
            </span>

            <div className="flex justify-center items-center font-DMsans gap-5 mt-4">
              <div
                onClick={() => {
                  handleNavigate();
                  PopUpClose();
                }}
                className="px-8 py-2 cursor-pointer rounded-lg text-white bg-primary"
              >
                {(heading === "Offer Letter Form Submitted" ||
                  heading === "Visa Form Submitted" ||
                  heading === "Course Fee Form Submitted") &&
                role === "2"
                  ? "Back to Applications"
                  : (heading === "Offer Letter Form Submitted" ||
                      heading === "Visa Form Submitted" ||
                      heading === "Course Fee Form Submitted") &&
                    role === "3"
                  ? "Back to Dashboard"
                  : heading === "Successfully Registered" && role === "2"
                  ? "Back to Lists"
                  : "Back to login"}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PopUp;
