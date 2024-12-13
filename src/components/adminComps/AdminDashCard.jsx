import React from "react";
import { Link } from "react-router-dom";

const AdminDashCard = ({
  icon,
  label,
  totalCount,
  link,
  pendingCount,
  approvedCount,
  text
}) => {
  return (
    <>
      <Link to={link}>
        <div className="bg-white px-6 py-6 rounded-md border font-poppins border-[#E8E8E8] justify-start flex flex-col">
          <span className="p-3 bg-[#F6F6F6] rounded-md w-12">
            <img src={icon} alt="img" className="w-5" />
          </span>
          <p className="mt-3 text-body text-[15px]">{label}</p>
          <span className="flex flex-row justify-between w-full mt-3">
            <p className="text-body text-[15px]">Total</p>
            <p className="text-body text-[15px] font-semibold">{totalCount}</p>
          </span>
          <hr className="mt-1" />
          <span className="flex flex-row justify-between w-full mt-3">
            <p className="text-body text-[15px]">Under Review</p>
            <p className=" text-[15px] font-semibold text-[#E59500]">
              {pendingCount}
            </p>
          </span>
          <hr className="mt-1"/>

          <span className="flex flex-row justify-between w-full mt-3">
            <p className="text-body text-[15px]">{text}</p>
            <p className="text-[#459F49] text-[15px] font-semibold">
              {approvedCount}
            </p>
          </span>{" "}
        </div>
      </Link>
    </>
  );
};

const AdminDashCardTwo = ({
  icon,
  label,
  count,
  active,
  link,
  customSBg,
  bgImg,
  
}) => {
  return (
    <>
      <Link to={link}>
        <div
          className="bg-white px-6  rounded-md border relative font-poppins border-[#E8E8E8] justify-start flex flex-col "
          style={{
            backgroundImage: `url(${bgImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <span className="p-3 rounded-md w-12 mt-1">
            <img src={icon} alt="img" className="w-5 z-20" />
          </span>
          <p className="mt-3  text-[15px] text-white">{label}</p>

          <p className="text-white text-[23px] mt-3  font-semibold">{count}</p>
          <p className="text-white text-[23px] mt-3 py-[46px] font-semibold"></p>

          <span
            style={{ backgroundColor: customSBg }}
            className="px-8 py-2 rounded-t-md absolute bottom-0 left-14 text-[13px] text-sidebar"
          >
            Active: {active}
          </span>
        </div>
      </Link>
    </>
  );
};
export { AdminDashCard, AdminDashCardTwo };
export default AdminDashCard;
