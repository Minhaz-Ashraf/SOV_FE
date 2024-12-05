import React, { useState, useEffect } from "react";
import { CustomTableFive } from "../Table";
import { FaRegEye } from "react-icons/fa";
import { formatDate } from "../../constant/commonfunction";
import Loader from "../Loader";
import Dnf from "../Dnf";
import { dnf } from "../../assets";
import { setUpdateTicket } from "../../features/adminSlice";
import { useDispatch } from "react-redux";

const PendingTicket = ({ data, isLoading }) => {
const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setUpdateTicket("underreview"));
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
console.log(isLoading)
  const TABLE_ROWS = data?.tickets?.map((ticket, index) => ({
    sno: index + 1,
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
      <div className="mt-8 font-medium text-body ml-[22%] mr-[15%]">
        <Dnf
          dnfImg={dnf}
          headingText="Start Your Journey!"
          bodyText="No Ticket found."
        />
      </div>
    );
  }

  return (
    <div className="mt-6 mr-6">
      <CustomTableFive
        tableHead={TABLE_HEAD}
        tableRows={TABLE_ROWS}
        action={"View"}
        icon={<FaRegEye />}
      />
    </div>
  );
};

export default PendingTicket;
