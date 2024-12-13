import React, { useState } from "react";
import { profileSkeleton } from "../../assets";
import { Link } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import YesNoPopUp from "../reusable/YesNoPopUp";
import { toast } from "react-toastify";
import { BiPencil } from "react-icons/bi";
import ApplicationChoosePop from "./ApplicationChoosePop";

const StudentCards = ({
  name,
  email,
  mobile,
  id,
  application,
  deleteStudentData,
  profile,
  title,
  link,
  stId,
  defaultId,
  status,
  page,
  edit,
}) => {
  const [isFuncOpen, setIsFuncOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isHoveredSecond, setIsHoveredSecond] = useState(false);
  const [isOpenOpt, setIsOpenOpt] = useState(false);


  const closeOpt = () => {
    setIsOpenOpt(false); 
  };

  const handleOpenOpt = () => {
    setIsOpenOpt(true); 
  };

  const closeFunc = () => {
    setIsFuncOpen(false);
  };
  const openFunc = () => {
    setIsFuncOpen(true);
  };
  const messagefunc = () => toast.info("Please complete the profile first");
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const handleMouseSecondEnter = () => {
    setIsHoveredSecond(true);
  };

  const handleMouseSecondLeave = () => {
    setIsHoveredSecond(false);
  };
  return (
    <>
      <div className="bg-white border border-[#E8E8E8] py-4 px-4 rounded-md font-poppins  w-full relative">
        <div className="flex items-center gap-4 mt-1 ">
          <img
            src={profile || profileSkeleton}
            alt="Profile"
            className="rounded-md w-28 h-28"
            onError={profileSkeleton}
            loading="lazy"
          />
          <span className="flex flex-col">
            <span className="text-primary font-medium text-[13px]">
              {application || 0} Applications
            </span>
           
            <span className="text-sidebar text-[14px] font-medium ">
              {name?.slice(0, 24) || "NA"}
            </span>

            <span
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="text-[13px]  pt-[1px] text-body font-normal"
            >
              {email.length > 20 ? `${email.slice(0, 20)}...` : email || "NA"}
            </span>
            {isHovered && (
              <div className="text-start absolute  text-[13px] w-auto px-3 py-1 bg-greyish border  rounded-lg">
                <p> {email}</p>
              </div>
            )}
            <span className="flex flex-row justify-between gap-4 items-center w-full ">
              <span className="text-[13px] text-body font-normal">
                {mobile || "NA"}
              </span>
              <span>
                {stId ? (
                  <span className="text-[13px] underline text-green-500 font-normal  px-1">
                    Completed
                  </span>
                ) : (
                  <span className="flex fex-row items-center">
                    <span className="text-[13px] underline text-yellow-500">
                      Pending
                    </span>

                    <Link
                      onMouseEnter={handleMouseSecondEnter}
                      onMouseLeave={handleMouseSecondLeave}
                      to={`/student-form/${page}`}
                      state={{
                        passPage: "passPage",
                        id: defaultId,
                        hide: edit,
                      }}
                      className="text-[20px] text-sidebar font-normal  px-1 cursor-pointer"
                    >
                      <BiPencil />
                    </Link>
                  </span>
                )}
              </span>
              {isHoveredSecond && (
                <div className="absolute text-center  text-[13px] w-36 p-1 bg-greyish border  rounded-lg">
                  <p> Complete Profile</p>
                </div>
              )}
            </span>
            <span className="text-[13px] text-body font-normal">
              ID: {stId || "NA"}
            </span>
          </span>
        </div>
        <span

              onClick={() => openFunc()}
              className=" underline text-red-500 font-normal absolute px-1 text-[20px] right-2 top-3  cursor-pointer"
            >
              <RiDeleteBin6Line />
            </span>
        {stId ? (
          <span className="flex flex-row items-center mt-4 gap-4 w-full">
            <Link
              to={link}
              state={defaultId}
              className="border w-1/2 border-[#E8E8E8] px-6 py-1 text-[14px] text-center cursor-pointer rounded-sm"
            >
              See Details
            </Link>
            <span
              onClick={handleOpenOpt}
              className="text-primary border w-1/2 border-primary text-center text-[14px] rounded-sm cursor-pointer px-6 py-1"
            >
              Apply Now
            </span>
          </span>
        ) : (
          <span className="flex flex-row items-center mt-4 gap-4 w-full">
            <Link
              onClick={messagefunc}
              className="border w-1/2 border-[#E8E8E8] px-6 py-1 text-[14px] text-center cursor-pointer rounded-sm"
            >
              See Details
            </Link>
            <Link
              onClick={messagefunc}
              className="text-primary border w-1/2 border-primary text-center text-[14px] rounded-sm cursor-pointer px-6 py-1"
            >
              Apply Now
            </Link>
          </span>
        )}
      </div>
      <YesNoPopUp
        isFuncOpen={isFuncOpen}
        closeFunc={closeFunc}
        handleFunc={() => {
          deleteStudentData(defaultId.id);
        }}
        questionText="Are you sure to delete the student ?"
      />
       <ApplicationChoosePop
        isOpenOpt={isOpenOpt}
        closeOpt={closeOpt}
        state={defaultId}
      />
    </>
  );
};

export default StudentCards;
