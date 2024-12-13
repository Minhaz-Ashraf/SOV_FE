import React, { useEffect, useState } from "react";
import Header from "../components/dashboardComp/Header";
import AdminSidebar from "../components/dashboardComp/AdminSidebar";
import TabBar from "../components/dashboardComp/TabBar";
import { useDispatch, useSelector } from "react-redux";
import { CustomInput } from "../components/reusable/Input";
import { IoSearchOutline } from "react-icons/io5";
import Pagination from "../components/dashboardComp/Pagination";
import { getAllTickets } from "../features/adminSlice";
import pendingTicket from "../components/adminComps/pendingTicket";
import { priorityOption } from "../constant/data";
import Loader from "../components/Loader";
import ResolvedTickets from "../components/adminComps/ResolvedTickets";
import { downloadFile } from "../features/adminApi";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";

const TicketSupport = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { ticketAll } = useSelector((state) => state.admin);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isDate, setDate] = useState("");
  const [perPage, setPerPage] = useState(10);
  const totalUsersCount = ticketAll?.totalTickets || 0;
  const currentPage = ticketAll?.currentPage || 1;
  const totalPagesCount = ticketAll?.totalPages || 1;
  const [isPriorityType, setIsPriorityType] = useState("");
  const [loading, setLoading] = useState(true);
  const { updateTicketTab } = useSelector((state) => state.admin);
  const [dateObj, setDateObj] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "pending"
  );
  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    setDate(dateValue);
    setDateObj(dateValue ? new Date(dateValue) : null);
    setPage(1);
  };
  const handlePerPageChange = (e) => {
    setPerPage(parseInt(e.target.value));
    setPage(1);
  };
  const handlePriorityTypeChange = (e) => {
    setIsPriorityType(e.target.value);
    setPage(1);
  };
  // console.log(isDate)

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const perPageOptions = [];
  for (let i = 10; i <= Math.min(totalUsersCount, 100); i += 10) {
    perPageOptions.push(i);
  }
  useEffect(() => {
    // setLoading(true);
    dispatch(
      getAllTickets({
        page,
        perPage,
        isPriorityType,
        search,
        updateTicketTab,
        dateObj,
      })
    );
    // setLoading(false);
  }, [
    dispatch,
    page,
    perPage,
    isPriorityType,
    search,
    updateTicketTab,
    dateObj,
  ]);

  const tabs = [
    {
      name: "pending",
      label: "Pending",
      component: pendingTicket,
      props: {
        data: ticketAll,
        isLoading: loading,
        currentPage: currentPage,
        setPage: setPage,
      },
    },
    {
      name: "resolved",
      label: "Resolved",
      component: ResolvedTickets,
      props: { data: ticketAll, currentPage: currentPage, setPage: setPage },
    },
  ];

  // console.log(ticketAll?.tickets?.length)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const downloadAll = async () => {
    try {
      setDownloading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const res = await downloadFile({
        url: "/ticket/download-all",
        filename: "Tickets.csv",
      });
      // toast.info("Downloading will start in few seconds");
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Error downloading");
    } finally {
      setDownloading(false);
    }
  };
  useEffect(() => {
    if (location.pathname !== "/admin/ticket") {
      setActiveTab("pending");
      setSearchParams({ tab: "pending" });
    } else {
      setActiveTab(searchParams.get("tab") || "pending");
    }
  }, [location.pathname, searchParams]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setSearchParams({ tab: tabName });
  };
  return (
    <>
      <Header />
      <div>
        <span className="fixed overflow-y-scroll scrollbar-hide  bg-white">
          <AdminSidebar />
        </span>
      </div>
      <div className=" bg-white">
        <span className="flex items-center pt-16 md:ml-[16.5%] sm:ml-[22%]  ">
          <span>
            <p className="text-[28px] font-bold text-sidebar mt-6 ml-9">
              Ticket Support ({totalUsersCount}){" "}
            </p>
            <p className="mt-1 font-normal text-body ml-9 pr-[30%]">
              Review your agents and students tickets here. Stay updated on
              status and view detailed issues for each ticket raised.
            </p>
          </span>
        </span>
      </div>
      <div className="md:ml-[19.5%] sm:ml-[27%] mt-6 mr-6">
        <span className="flex  md:flex-row sm:flex-col md:justify-between sm:justify-start md:items-center sm:items-start">
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
            </span>
          </span>
          <span
            onClick={downloadAll}
            className="bg-primary px-6  rounded-md text-white cursor-pointer py-2"
          >
            {downloading ? "Downloading...." : "Download"}
          </span>
        </span>
      </div>
      {loading ? (
        <div className="w-1 ml-[53%] mt-12">
          <Loader />
        </div>
      ) : (
        <>
          <div className="sm:ml-14 md:ml-0">
            <TabBar
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              setActiveTab={setActiveTab}
            />
          </div>

          <div className="mt-12 mb-10 ml-52">
            <Pagination
              currentPage={currentPage}
              hasNextPage={currentPage * perPage < totalUsersCount}
              hasPreviousPage={currentPage > 1}
              onPageChange={handlePageChange}
              totalPagesCount={totalPagesCount}
            />
          </div>
        </>
      )}
    </>
  );
};

export default TicketSupport;
