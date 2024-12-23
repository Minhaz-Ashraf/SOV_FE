import React, { useState } from "react";
import { profileSkeleton } from "../../assets";
import { Link } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import YesNoPopUp from "../reusable/YesNoPopUp";
import { toast } from "react-toastify";
import { BiPencil } from "react-icons/bi";
import ApplicationChoosePop from "./ApplicationChoosePop";

const MemberCard = ({
  name,
  email,
  mobile,
  deleteteamData,
  profile,
  stId,
  defaultId,
 
}) => {
  const [isFuncOpen, setIsFuncOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);




  const closeFunc = () => {
    setIsFuncOpen(false);
  };
  const openFunc = () => {
    setIsFuncOpen(true);
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
 
  return (
    <>
      <div className="bg-white border border-[#E8E8E8] py-4 px-4 rounded-md font-poppins  w-full relative">
        <div className="flex items-center gap-4  ">
          <img
            src={profile || profileSkeleton}
            alt="Profile"
            className="rounded-md w-28 h-28"
            onError={profileSkeleton}
            loading="lazy"
          />
          <span className="flex flex-col">
          
           
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
    
          <span className="flex flex-row items-center mt-4 gap-4 w-full">
            <Link
              to="/admin/add-member"
              state={{id:defaultId.id, edit: "edit"} }
              className="border w-1/2 border-[#E8E8E8] px-6 py-1 text-[14px] text-center cursor-pointer rounded-sm"
            >
              Edit Profile
            </Link>
            <Link
            to="/admin/team-activity"
            state={{id:defaultId.id} }
              className="text-primary border w-1/2 border-primary text-center text-[14px] rounded-sm cursor-pointer px-6 py-1"
            >
              View Activity
            </Link>
          </span>
      
      </div>
      <YesNoPopUp
        isFuncOpen={isFuncOpen}
        closeFunc={closeFunc}
        handleFunc={() => {
          deleteteamData(defaultId.id);
        }}
        questionText="Are you sure to delete the member ?"
      />
     
    </>
  );
};

export default MemberCard;
