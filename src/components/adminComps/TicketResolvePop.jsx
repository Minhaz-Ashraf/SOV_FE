import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTicketById } from "../../features/adminSlice";
import { formatDate } from "./../../constant/commonfunction";
import { RxCross2 } from "react-icons/rx";

const TicketResolvePop = ({ isOpen, closePopUp, isticketId, handleStatus }) => {
  const { ticketById } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const [isResolvedText, setResolvedText] = useState();
  const [isSolution, setIsSolution] = useState();

  const handleInput = (event) => {
    setResolvedText(event.target.value);
  };

  const handleSolution = (event) => {
    setIsSolution(event.target.value);
  };
  useEffect(() => {
    dispatch(getTicketById(isticketId));
  }, [isticketId]);

  useEffect(()=>{
   setIsSolution(ticketById?.solutionText || "")
   setResolvedText(ticketById?.resolvedText|| "")
  },[ticketById]) 
  return (
    <>
      {isOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center popup-backdrop z-50  sm:px-20  px-6 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <div className="bg-white pb-9  rounded-lg md:w-[90%] w-full  relative p-9  font-poppins">
          <span onClick={closePopUp} className="absolute top-2 right-3 text-[30px] cursor-pointer text-primary"><RxCross2 /></span>
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
              <p className="text-sidebar font-semibold text-[14px] mt-4">Ticket Details</p>
              <div className="flex justify-between items-start w-full">
                <span className="flex flex-col ">
                  <span className="text-[14px] text-sidebar mt-2 font-medium">
                    Ticket No.
                  </span>
                  <span className="text-[13px] mt-1 text-sidebar  font-normal">
                    {ticketById?.ticketId}
                  </span>

                  <span className="text-[14px] text-sidebar mt-6 font-medium">
                    Phone No.
                  </span>
                  <span className="text-[13px] mt-1 text-sidebar  font-normal">
                    {ticketById?.phone}
                  </span>
                </span>
                <span className="flex flex-col ">
                  <span className="text-[14px] text-sidebar mt-2 font-medium">
                  {ticketById?.createdById?.startsWith("AG-") ? "Agent Name" : "Student Name"}  
                  </span>
                  <span className="text-[13px] mt-1 text-sidebar  font-normal">
                    {ticketById?.name}
                  </span>

                  <span className="text-[14px] text-sidebar mt-6 font-medium">
                    Priority Status
                  </span>
                  <span className="text-[13px] mt-1 text-sidebar  font-normal">
                    {ticketById?.priorityStatus}
                  </span>
                </span>
                <span className="flex flex-col ">
                  <span className="text-[14px] text-sidebar mt-2 font-medium">
                  {ticketById?.createdById?.startsWith("AG-") ? "Agent Id" : "Student Id"}  
                  </span>
                  <span className="text-[13px] mt-1 text-sidebar  font-normal">
                    {ticketById?.createdById}
                  </span>

                  <span className="text-[14px] text-sidebar mt-6 font-medium">
                    Date Created
                  </span>
                  <span className="text-[13px] mt-1 text-sidebar  font-normal">
                    {formatDate(ticketById?.createdAt)}
                  </span>
                </span>
                <span className="flex flex-col ">
                  <span className="text-[14px] text-sidebar mt-2 font-medium">
                    Email
                  </span>
                  <span className="text-[13px] mt-1 text-sidebar  font-normal">
                    {ticketById?.email}
                  </span>
                </span>
              </div>
              <span className="text-[14px] text-sidebar mt-4 font-medium">
                Solution to show the user?
              </span>
              <textarea
                name="isResolvedText"
                value={isResolvedText}
                className="border border-md h-16 mt-2 px-3 py-3 outline-none text-sidebar text-[14px]"
                placeholder="Write Here"
                onChange={handleInput}
                disabled={ticketById?.status === "resolved"}
              ></textarea>
              <span className="text-[14px] text-sidebar mt-6 font-medium">
                Describe How You Resolved the Issue?
              </span>
              <textarea
                name="isSolution"
                value={isSolution}
                className="border border-md h-16 mt-2 px-3 py-3 outline-none text-sidebar text-[14px]"
                placeholder="Write Here"
                onChange={handleSolution}
                disabled={ticketById?.status === "resolved"}
              ></textarea>
            
              <div className="flex flex-row items-center justify-end mt-6 gap-4 text-[14px]">
              {ticketById?.status === "underreview" && <><span
                  onClick={closePopUp}
                  className="border text-primary rounded-md px-6 py-2 cursor-pointer"
                >
                  Cancel
                </span>
               
                <span
                onClick={() => handleStatus("resolved", isSolution, isResolvedText, isticketId)}

                  className="bg-primary text-white rounded-md px-6 py-2 cursor-pointer"
                >
                  Resolved
                </span>
                </> 
                }
              </div>
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default TicketResolvePop;
