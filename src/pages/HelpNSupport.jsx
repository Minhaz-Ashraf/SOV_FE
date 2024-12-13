import React, { useEffect, useState } from "react";
import Header from "../components/dashboardComp/Header";
import AgentSidebar from "../components/dashboardComp/AgentSidebar";
import {
  CustomTable,
  CustomTableFour,
  CustomTableTwo,
} from "../components/Table";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { studentApplications } from "../features/agentSlice";
import { dnf, profileSkeleton } from "../assets";
import { FaRegEye } from "react-icons/fa";
import { allTicket, studentById } from "./../features/generalSlice";
import { CustomInput, SelectComponent } from "../components/reusable/Input";
import { IoSearchOutline } from "react-icons/io5";
import {
  applicationTypeOption,
  priorityOption,
  statusOption,
  statusTicketOption,
} from "../constant/data";
import Pagination from "../components/dashboardComp/Pagination";
import Loader from "../components/Loader";
import Dnf from "../components/Dnf";
import { generateNewTicket } from "../features/generalApi";
import { toast } from "react-toastify";
import TicketAddPop from "../components/TicketAddPop";
import { formatDate } from "../constant/commonfunction";
import Sidebar from "../components/dashboardComp/Sidebar";
import socketServiceInstance from "../services/socket";

const HelpNSupport = () => {
  const role = localStorage.getItem("role");
  const { agentData } = useSelector((state) => state.agent);
  const [newticketPayload, setNewTicketPayLoad] = useState({
    ticketType: "",
    priorityStatus: "",
    description: "",
    payment: 0,
    status: "",
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isDate, setDate] = useState("");
  const { getAllTicket } = useSelector((state) => state.general);
  const { studentInfoData } = useSelector((state) => state.student);
  const [isLoading, setIsLoading] = useState(true);
  const [perPage, setPerPage] = useState(10);
  const totalUsersCount = getAllTicket?.pagination?.totalTickets || 0;
  const currentPage = getAllTicket?.pagination?.currentPage || 1;
  const totalPagesCount = getAllTicket?.pagination?.totalPages || 1;
  const dispatch = useDispatch();
  const [isPriorityType, setIsPriorityType] = useState("");
  const [isStatusType, setIsStatusType] = useState("");
  const [dateObj, setDateObj] = useState(null); 
  const [applicationIds, setApplicationIds] = useState([]);
  const [isPopUp, setIsPopUp] = useState(false);
  const handlePayloadInput = (e) => {
    const { name, value } = e.target;
    setNewTicketPayLoad((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (!value.trim()) {
      toast.error(`${name} is required`);
    }
  };

  const PopUpOpen = () => {
    setIsPopUp(true);
  };
  const PopUpClose = () => {
    setIsPopUp(false);
  };
  const handlePerPageChange = (e) => {
    setPerPage(parseInt(e.target.value));
    setPage(1);
  };
  const handlePriorityTypeChange = (e) => {
    setIsPriorityType(e.target.value);
    setPage(1);
  };
  const handleStatusTypeChange = (e) => {
    setIsStatusType(e.target.value);
    setPage(1);
  };
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };
  const handleDateChange = (e) => {
    const dateValue = e.target.value; 
    setDate(dateValue); 
    setDateObj(dateValue ? new Date(dateValue) : null); 
    setPage(1); 
  };
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };
  console.log(dateObj, isDate)
  useEffect(() => {
    // dispatch(studentById(studentId));
    dispatch(
      allTicket({ page, perPage, isPriorityType, isStatusType, search, isDate })
    );
  }, [dispatch, page, perPage, isPriorityType, isStatusType, search, isDate]);

  // Generate options for per page dropdown
  const perPageOptions = [];
  for (let i = 10; i <= Math.min(totalUsersCount, 100); i += 10) {
    perPageOptions.push(i);
  }

  // Define table columns
  const TABLE_HEAD = [
    "S.No.",
    "Ticket No.",
    "Ticket Type",
    "Date Created ",
    "Priority",
    "Status",
    "Action",
  ];

  // Prepare table data
  const TABLE_ROWS = getAllTicket?.tickets?.map((data, index) => ({
    sno: (currentPage - 1) * perPage + index + 1,
    ticketNo: data?.ticketId || "NA",
    type: data?.ticketType || "NA",
    date: formatDate(data?.createdAt) || "NA",
    priority: data?.priorityStatus || "NA",
    status: data?.status || "NA",
    Id: data?._id,
  }));
  useEffect(() => {
    if (getAllTicket) {
      const ids = getAllTicket?.tickets?.map((data) => data._id);
      setApplicationIds(ids);
    }
  }, [getAllTicket]);

  const addNewTicket = async () => {
    try {
      const userType = role === "2" ? "agent" : role === "3" ? "student" : null;
      const res = await generateNewTicket(newticketPayload, userType);
      // console.log(res);
     await dispatch(allTicket({}))
      toast.success(res.message || "Ticket created successfully");
      if (role === "2" && res?.statusCode === 201) {
        if (socketServiceInstance.isConnected()) {
          //from agent to admin
          const notificationData = {
            title: "  AGENT_RAISED_TICKET",
            message: `${agentData?.companyDetails?.businessName} ${agentData?.agId} has raised the ticket  ${res.data.ticketId}  `,
            path: "/admin/ticket",
            recieverId: "",
          };

          socketServiceInstance.socket.emit(
            "NOTIFICATION_AGENT_TO_ADMIN",
            notificationData
          );
        } else {
          console.error("Socket connection failed, cannot emit notification.");
        }
      }
      if (role === "3" && res?.statusCode === 201) {
        if (socketServiceInstance.isConnected()) {
          //from student to admin
          const notificationData = {
            title: "  STUDENT_RAISED_TICKET",
            message: `${
              studentInfoData?.data?.studentInformation?.personalInformation
                .firstName +
              " " +
              studentInfoData?.data?.studentInformation?.personalInformation
                .lastName
            }  ${
              studentInfoData?.data?.studentInformation?.stId
            }  has raised the ticket ${res.data.ticketId}  `,
            path: "/admin/ticket",
            recieverId: "",
          };
          socketServiceInstance.socket.emit(
            "NOTIFICATION_STUDENT_TO_ADMIN",
            notificationData
          );
        } else {
          console.error("Socket connection failed, cannot emit notification.");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.messsage || "Something went wrong");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Header customLink="/agent/shortlist" />

      <span className="fixed overflow-y-scroll scrollbar-hide bg-white">
        {role === "2" ? <AgentSidebar /> : <Sidebar />}
      </span>

      <div>
        <span className="flex md:flex-row sm:flex-col items-center mt-20 md:ml-[16.5%] sm:ml-[22%]">
          <span>
            <p className="text-[28px] font-bold text-sidebar mt-2 ml-9">
              Support Requests
            </p>
            <p className="mt-1 md:font-normal sm:font-light text-body md:pr-[8%] sm:pr-[20%] ml-9">
              Stay informed about the progress of your support tickets. View
              details, report issues, and track resolution status.
            </p>
          </span>
        </span>
        <div className="md:ml-[19.5%] sm:ml-[27%] mt-6 mr-6">
          <span className="flex flex-row items-center mb-3">
            <span className="flex flex-row justify-between w-full items-center">
              <span className="flex flex-row items-center ">
                {" "}
                {/* <span className="text-body">Show</span>
                <select
                  className="ml-3 border px-2 py-1 w-10 h-11 rounded outline-none"
                  value={perPage}
                  onChange={handlePerPageChange}
                >
                  {perPageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <span className="px-3 text-body">entries</span> */}
                <select
                  className="ml-3 border px-2 py-1 w-24 h-11 rounded outline-none"
                  value={isStatusType}
                  onChange={handleStatusTypeChange}
                >
                  <option value="">Status</option>
                  {statusTicketOption.map((option) => (
                    <option key={option.option} value={option.option}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <select
                  className="ml-3 border px-2 py-1 w-24 h-11 rounded outline-none"
                  value={isPriorityType}
                  onChange={handlePriorityTypeChange}
                >
                  <option value="">Priority</option>
                  {priorityOption.map((option) => (
                    <option key={option.option} value={option.option}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <CustomInput
                  type="date"
                  placeHodler="Date"
                  className="ml-3 border px-2 py-1 w-36 h-11 rounded outline-none"
                  value={isDate}
                  onChange={handleDateChange}
                />
                <span className="flex flex-row items-center  ml-9">
                  <CustomInput
                    className="h-11 w-80 rounded-md text-body placeholder:px-3 pl-7 border border-[#E8E8E8] outline-none"
                    type="text"
                    placeHodler="Search by Ticket ID"
                    name="search"
                    value={search}
                    onChange={handleSearchChange}
                  />
                  <span className="absolute pl-2 text-[20px] text-body">
                    <IoSearchOutline />
                  </span>
                </span>
              </span>
              <span
                onClick={PopUpOpen}
                className="bg-primary text-white px-4  rounded-md py-2 cursor-pointer"
              >
                + Create Ticket
              </span>
            </span>
          </span>
        </div>
      </div>
      {isLoading ? (
        <div className="w-1 ml-[53%] mt-12">
          <Loader />
        </div>
      ) : getAllTicket?.tickets && getAllTicket?.tickets?.length > 0 ? (
        <>
          <div className="md:ml-[19.5%] sm:ml-[27%]  mt-6 ">
            <CustomTableFour
              tableHead={TABLE_HEAD}
              tableRows={TABLE_ROWS}
              // SecondLink="/offerLetter-apply"
              action={"View"}
              icon={<FaRegEye />}
              // link="/offerLetter/edit"
              // customLinkState={TABLE_ROWS?.map((data) => data?.appId)}
            />
          </div>
          <div className="mt-16 mb-10 ml-20">
            <Pagination
              currentPage={currentPage}
              hasNextPage={currentPage * perPage < totalUsersCount}
              hasPreviousPage={currentPage > 1}
              onPageChange={handlePageChange}
              totalPagesCount={totalPagesCount}
            />
          </div>
        </>
      ) : (
        <div className="mt-8 font-medium text-body ml-[25%] mr-[15%]">
          <Dnf
            dnfImg={dnf}
            headingText="Start Your Journey!"
            bodyText="No Ticket found."
          />
        </div>
      )}

      <TicketAddPop
        handleInput={handlePayloadInput}
        value={newticketPayload}
        closePopUp={PopUpClose}
        isOpen={isPopUp}
        handleFunc={addNewTicket}
      />
    </>
  );
};

export default HelpNSupport;
