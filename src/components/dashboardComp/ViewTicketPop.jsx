import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTicketById } from "../../features/adminSlice";
import { formatDate } from "./../../constant/commonfunction";
import { RxCross2 } from "react-icons/rx";

const ViewTicketPop = ({ isOpen, closePopUp, isticketId }) => {
  const { ticketById } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getTicketById(isticketId));
  }, [isticketId]);
  return (
    <>
      {isOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center popup-backdrop z-50  sm:px-52  px-6 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <div className="bg-white pb-9  rounded-lg md:w-[90%] w-full  relative p-9  font-poppins ">
            <span onClick={closePopUp} className="absolute right-9 text-[28px] cursor-pointer">
              {" "}
              <RxCross2 />
            </span>
            <span className="flex flex-col justify-start">
              <span
                className={`rounded-2xl px-3 py-1 w-36 text-center text-white text-[16px] ${
                  ticketById.status === "underreview"
                    ? "bg-[#096D98] "
                    : ticketById.status === "resolved"
                    ? "bg-[#09985C]"
                    : "bg-primary"
                }`}
              >
                {ticketById?.status === "resolved"
                  ? "Resolved"
                  : ticketById?.status === "underreview"
                  ? "Under Review"
                  : "NA"}
              </span>
              <p className=" font-DMsans text-sidebar font-semibold text-[16px] pt-6 ">
                {ticketById?.ticketType}
              </p>
              <p className="text-body text-[13px] pr-28">
                {ticketById?.description}
              </p>
              <p className="text-body text-[14px] mt-6">Ticket Details</p>
              <div className="flex justify-between items-start w-full">
                <span className="flex flex-col ">
                  <span className="text-[14px] text-sidebar mt-6 font-medium">
                    Ticket No.
                  </span>
                  <span className="text-[13px] mt-1 text-sidebar  font-normal">
                    {ticketById?.ticketId}
                  </span>
                </span>
                <span className="flex flex-col ">
                  <span className="text-[14px] text-sidebar mt-6 font-medium">
                    Ticket Type
                  </span>
                  <span className="text-[13px] mt-1 text-sidebar  font-normal">
                    {ticketById?.ticketType}
                  </span>
                </span>
                <span className="flex flex-col ">
                  <span className="text-[14px] text-sidebar mt-6 font-medium">
                    Priority Status
                  </span>
                  <span className="text-[13px] mt-1 text-sidebar  font-normal">
                    {ticketById?.priorityStatus}
                  </span>
                </span>
                <span className="flex flex-col ">
                  <span className="text-[14px] text-sidebar mt-6 font-medium">
                    Date Created
                  </span>
                  <span className="text-[13px] mt-1 text-sidebar  font-normal">
                    {formatDate(ticketById?.createdAt)}
                  </span>
                </span>
              </div>
            </span>
            <span className="flex flex-col ">
                  <span className="text-[14px] text-sidebar mt-6 font-medium">
                    Resolved Description
                  </span>
                  <span className="text-[13px] mt-1 text-sidebar  font-normal">
                    {(ticketById?.resolvedText)}
                  </span>
                </span>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewTicketPop;
