import React, { useState } from "react";
import { Link } from "react-router-dom";
import RejectedPopUp from "./RejectedPopUp";
import { FaRegEye } from "react-icons/fa";

const AdminCard = ({
  apId,
  userType,
  status,
  isApproval,
  updateStatus,
  newStatus,
  id,
  linkOne,
  linkTwo,
  rejectStatus,
  applicationType,
  description,
  name,
  userId,
  currentStatus,
  rejectionMessage,
  sectionData,
  pageType,
  instituteData,
  mgdbId,
  agentId

}) => {
  const [isOpen, setIsOpen]
   = useState(false);
  const closePopUp = () => setIsOpen(false);
  const openPopUp = () => setIsOpen(true);

  return (
    <>
      <div className="bg-white  font-poppins flex flex-row justify-between md:items-center sm:items-start  w-full px-6 py-6 ">
        <span className="w-70 flex flex-col items-start ">
          {isApproval ? null : (
            <span className="font-normal text-body sm:text-[13px] md:text-[15px]">
              {apId}
            </span>
          )}

          <span className="font-medium text-sidebar sm:text-[13px] md:text-[15px] capitalize">
            {name}
          </span>
          <span
            className={`font-normal text-sidebar sm:text-[12px] md:text-[14px] ${
              isApproval ? "md:w-96 sm:w-64" : "md:w-80 sm:w-36"
            }`}
          >
            {description}
          </span>
          <span className="flex flex-row items-center gap-1 text-primary mt-2">
            <FaRegEye />
 
            <Link
              to={
                userType === ("Agent" || "gic" || "visa")
                  ? linkTwo
                  : applicationType
                  ? linkTwo
                  : linkOne
              }
              state={{ isprofileView: location.pathname, id: agentId }}
              className="font-medium    md:text-[14px] sm:text-[12px]  cursor-pointer"
            >
              {pageType === "offerLetter" ? "View Profile" : "View Application"}
            </Link>
          </span>
        </span>
        <span className="flex flex-col items-start md:w-20 sm:w-24">
          <span className="font-normal text-sidebar sm:text-[13px] md:text-[15px]">
            User Type
          </span>
          <span
            className={` px-3 py-1 rounded-xl text-white sm:text-[12px] md:text-[14px] mt-2 ${
              userType === "Agent" ? "bg-[#640FA7]" : "bg-[#0F67A7]"
            }`}
          >
            {userType}
          </span>
        </span>
        {!isApproval && (
          <span className="flex flex-col items-start md:w-32 sm:w-28">
            <span className="font-normal text-sidebar sm:text-[13px] md:text-[15px]">
              Application Type
            </span>
            <span className="font-semibold text-sidebar mt-2  md:text-[14px] sm:text-[12px]">
              {applicationType === "offerLetter"
                ? "Offer Letter"
                : applicationType === "courseFeeApplication"
                ? "Course Fee " : applicationType === "visa"
                ? "Visa"
                : "NA"}
            </span>
          </span>
        )}
        <span className="flex flex-col items-start w-28">
          <span className="font-normal text-sidebar sm:text-[13px] md:text-[15px]">
            User Id
          </span>
          <span className="font-semibold text-sidebar mt-2  md:text-[14px] sm:text-[12px]">
            {userId}
          </span>
        </span>
        {currentStatus ? (
          <span className="flex flex-col items-start w-32">
            <span className="font-normal text-sidebar text-[15px]">Status</span>
            <span
              className={`font-normal text-white mt-2  md:text-[14px] sm:text-[12px] px-3 rounded-xl py-1 ${
                currentStatus === "approved"
                  ? "bg-[#09985C] "
                  : currentStatus === "rejected"
                  ? "bg-[#D83737]"
                  : "bg-black"
              }`}
            >
              {currentStatus === "approved" ? "Approved" : "Rejected"}
            </span>
          </span>
        ) : (
          <span className="flex flex-col items-center w-32  md:text-[14px] sm:text-[12px]">
            <span
              onClick={() => updateStatus(id, newStatus, sectionData, "", instituteData, mgdbId)}
              className="bg-primary px-4 py-1 text-white rounded-md cursor-pointer"
            >
              Accept
            </span>
            <span
              onClick={openPopUp}
              className="border border-sidebar mt-2 px-5 py-1 text-secondary   cursor-pointer rounded-md"
            >
              Reject
            </span>
          </span>
        )}
      </div>

      {currentStatus === "rejected" && (
        <div className="bg-white  font-poppins  w-full px-6  pb-6 ">
          <hr className="border border-greyish" />
          <span className="flex flex-col w-96 mt-4">
            <span className="font-medium text-sidebar sm:text-[13px] md:text-[15px] ">
              Reason for rejection
            </span>
            <span
              className={`font-normal text-sidebar   md:text-[14px] sm:text-[12px]`}
            >
              {rejectionMessage || "No reason available"}
            </span>
          </span>
        </div>
      )}

      <RejectedPopUp
        isOpen={isOpen}
        closePopUp={closePopUp}
        handleFunc={updateStatus}
        sectionData={sectionData}
        id={id}
        applicationType={applicationType}
        instituteData={instituteData}
      />
    </>
  );
};

export default AdminCard;
