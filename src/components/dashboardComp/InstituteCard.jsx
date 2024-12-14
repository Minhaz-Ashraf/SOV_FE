import React, { useState } from "react";
import { CiStar } from "react-icons/ci";
import { FaExclamation, FaCheck, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import ApplicationChoosePop from "./ApplicationChoosePop";

const InstituteCard = ({
  institutename,
  state,
  country,
  shortlistInstitute,
  instituteId,
  link,
  status,
  customState,
}) => {
  const role = localStorage.getItem("role");
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const [isOpenOpt, setIsOpenOpt] = useState(false);
  // const availableApplications =  studentApplicationData?.applications?.filter(

  // )

  const closeOpt = () => {
    setIsOpenOpt(false); // Close the popup
  };

  const handleOpenOpt = () => {
    setIsOpenOpt(true); // Open the popup
  };

  return (
    <>
      <div className="bg-white rounded-md px-6 py-6 font-poppins border border-[#E8E8E8] flex flex-col h-full ">
        <div className="flex-grow">
          <p
            className={`font-semibold text-[16px] text-sidebar leading-snug"
            }`} // Apply different style when hovered
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {institutename?.length > 55
              ? `${institutename.slice(0, 55)}...`
              : institutename}
          </p>
          {isHovered && (
            <div className="text-start absolute  text-[13px] w-auto px-3 py-1 bg-white border  rounded-lg">
              <p> {institutename}</p>
            </div>
          )}
          <p className="font-normal text-[14px] text-body">{country}</p>
        </div>
        <div className="mt-7 flex items-center justify-between gap-4 w-full">
          <span
            onClick={() => {
              shortlistInstitute(instituteId);
            }}
            className="bg-white border border-[#464255]   gap-2 w-1/2 justify-center py-1.5 text-[14px] cursor-pointer flex items-center"
          >
            <span className="md:text-[19px] sm:text-[14px] ">
              {status === "added" ? (
                <span className="text-[#464255]">
                  <FaStar />
                </span>
              ) : (
                <CiStar />
              )}
            </span>{" "}
            <span>Shortlist</span>
          </span>
          {role === "3" ? (
            <span
              onClick={handleOpenOpt}
              className="bg-primary  px-6 py-2 cursor-pointer w-1/2 text-center text-white text-[14px]"
            >
              Apply Now
            </span>
          ) : (
            <Link
              to={link}
              state={customState}
              className="bg-primary  px-6 py-2 cursor-pointer w-1/2 text-center text-white text-[14px]"
            >
              Apply Now
            </Link>
          )}
        </div>
      </div>
      <ApplicationChoosePop
        isOpenOpt={isOpenOpt}
        closeOpt={closeOpt}
        state={customState}
      />
    </>
  );
};

const StatusComp = ({
  statusOne,
  statusTwo,
  statusThree,
  statusFour,
  statusFive,
  statusSix,
}) => {
  const statusList = [
    statusOne,
    statusTwo,
    "current",
    statusFour,
    statusFive,
    statusSix,
  ];
  //
  const cardLabels = [
    "Profile completed",
    "Offer letter approved",
    "Payment done",
    "Course fee Application",
    "Visa lodgement",
    "Visa outcome",
  ];

  const completeStatusList = [
    ...statusList,
    ...Array(6 - statusList.length).fill("pending"),
  ];

  return (
    <div className="  grid grid-cols-6  gap-2 w-full">
      {completeStatusList.map((status, index) => (
        <div key={index} className="flex flex-col items-center relative">
          <div
            className={`status-card flex items-center justify-center border rounded-md w-[50px] h-[50px] ${
              status === "done"
                ? "bg-[#46A737] text-white"
                : status === "current"
                ? " border border-[#464255] "
                : "bg-[#D83737]"
            }`}
          >
            {status === "current" ? (
              <span className="text-lg font-bold ">{index + 1}</span>
            ) : status === "done" ? (
              <FaCheck className="text-white text-xl" />
            ) : (
              <FaExclamation className="text-white text-xl" />
            )}
          </div>
          <p className="mt-2 text-center text-body text-sm font-normal">
            {cardLabels[index]}
          </p>

          {index < completeStatusList.length - 1 && (
            <div className="border border-gray-300 absolute top-1/2 left-[140px]  transform -translate-y-1/2 w-[50%] h-[1px] mx-auto" />
          )}
        </div>
      ))}
    </div>
  );
};

export { InstituteCard, StatusComp };

export default InstituteCard;
