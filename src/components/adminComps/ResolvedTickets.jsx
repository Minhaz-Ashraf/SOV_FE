import React, { useState, useEffect } from "react";
import { CustomTableFive } from "../Table";
import { FaRegEye } from "react-icons/fa";
import { formatDate } from "../../constant/commonfunction";
import Loader from "../Loader";
import Dnf from "../Dnf";
import { dnf } from "../../assets";
import { useDispatch } from "react-redux";
import { setUpdateTicket } from "../../features/adminSlice";

const ResolvedTickets = ({ data, isLoading, currentPage, setPage}) => {
    const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setUpdateTicket("resolved"));
    setPage(1)
  }, [dispatch]);
  const TABLE_HEAD = [
    "S.No.",
    "Ticket ID",
    "User Name",
    "User Id",
    "User Type",
    "Date Created",
    "Priority",
    "Action",
  ];
  const TABLE_ROWS = data?.tickets?.map((ticket, index) => ({
    sno: (currentPage - 1) * 10 + index + 1, 
    ticketNo: ticket?.ticketId || "NA",
    name: ticket?.name || "NA",
    type: ticket?.userType || "NA",
    userId: ticket?.userId || "NA",
    date: formatDate(ticket?.createdDate) || "NA",
    priority: ticket?.priorityStatus || "NA",
    status: ticket?.status || "NA",
    Id: ticket?._id,
  }));

  if (isLoading) {
    return (
      <div className="w-1 ml-[53%] mt-12">
        <Loader />
      </div>
    );
  }

  if (!data?.tickets || data?.tickets?.length === 0) {
    return (
      <div className="mt-8 font-medium text-body ml-[25%] mr-[15%]">
        <Dnf
          dnfImg={dnf}
          headingText="Start Your Journey!"
          bodyText="No Ticket found."
        />
      </div>
    );
  }

  return (
    <div className="mt-6 md:mr-6 sm:ml-5">
      <CustomTableFive
        tableHead={TABLE_HEAD}
        tableRows={TABLE_ROWS}
        action={"View"}
        icon={<FaRegEye />}
      />
    </div>
  );
};

export default ResolvedTickets;
