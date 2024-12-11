import React from "react";
import { Link } from "react-router-dom";

const AgentDashCard = ({ icon, label, data, count, link }) => {
  return (
    <>
      <Link to={link}>
        <div className="bg-white px-6 py-6 rounded-md border font-poppins border-[#E8E8E8] justify-start flex flex-col">
          <span className="p-3 bg-[#F6F6F6] rounded-md w-12">
            <img src={icon} alt="img" className="w-5" />
          </span>
          <p className="mt-3 text-body text-[15px]">{label}</p>

          <p className="text-sidebar mt-2 font-bold text-[25px]">{count || "0"}</p>

          <p className="text-body text-[14px] mt-1 ">
            {" "}
            <span className={`${data < 0 ? "text-red-500" : "text-green-500"}`}>
              {data !== undefined && data !== null ? `${data > 0 ? `+${data}` : data}%` : "0"}
            </span>{" "}
            in last 7 days
          </p>
        </div>
      </Link>
    </>
  );
};

export default AgentDashCard;
