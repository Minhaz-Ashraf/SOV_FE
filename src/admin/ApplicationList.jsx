import React, { useEffect, useState } from "react";
import Header from "../components/dashboardComp/Header";
import AdminSidebar from "../components/dashboardComp/AdminSidebar";
import TabBar from "../components/dashboardComp/TabBar";
import Pending from "../components/adminComps/Pending";
import { useDispatch, useSelector } from "react-redux";
import { CustomInput } from "../components/reusable/Input";
import { IoSearchOutline } from "react-icons/io5";
import Approved from "../components/adminComps/Approved";
import Rejected from "../components/adminComps/Rejected";
import Pagination from "../components/dashboardComp/Pagination";
import {
  adminApplicationOverview,
  applicationForApproval,
} from "../features/adminSlice";
import { CustomTableNine } from "../components/Table";
import { downloadFile } from "../features/adminApi";
import { toast } from "react-toastify";
import { FaRegEye } from "react-icons/fa";
import { dnf } from "../assets";
import Dnf from "../components/Dnf";
import Loader from "../components/Loader";

const ApplicationList = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  // const { applications } = useSelector((state) => state.admin);
  // const {} = useSelector((state) => state.admin);
  const { getApplicationOverview } = useSelector((state) => state.admin);
  // const { updateState, tabType } = useSelector((state) => state.admin);
  const [downloading, setDownloading] = useState(false);
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [isTypeFilter, setIsFilterType] = useState("");
  const [page, setPage] = useState(1);
  const totalUsersCount = getApplicationOverview?.data?.totalCount || 0;
  const currentPage = getApplicationOverview?.data?.currentPage;
  const totalPagesCount = getApplicationOverview?.data?.totalPages;
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handlePerPageChange = (e) => {
    setPerPage(parseInt(e.target.value));
    setPage(1);
  };

  const handleTypeFilter = (e) => {
    setIsFilterType(e.target.value);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const perPageOptions = [];
  for (let i = 10; i <= Math.min(totalUsersCount, 100); i += 10) {
    perPageOptions.push(i);
  }
  useEffect(() => {
    // setLoading(true);
    dispatch(adminApplicationOverview({ page, perPage, search, isTypeFilter }));
  
    // setLoading(false);
  }, [page, perPage, search, isTypeFilter]);

  const TABLE_HEAD = [
    "S.No.",
    "Sudent Name",
    "Student Id",
    "Submitted by",
    "Total Applications",
    "Under Review",
    "Approved",
    "Action",
  ];

  const TABLE_ROWS = getApplicationOverview?.data?.data?.map((data, index) => ({
    sno: (currentPage - 1) * perPage + index + 1,
    name: data?.firstName + " " + data?.lastName || "NA",
    stId: data?.stId || "0",
    submittedby: data?.submittedBy || "0",
    total: data?.institutionCount || "0",
    underreview: data?.underReviewCount || "0",
    approved: data?.approvedCount || "0",
    action: data?.action || "NA",
    data: data || "NA",
  }));
  // console.log(getApplicationOverview)
  const downloadAll = async () => {
    try {
      setDownloading(true)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await downloadFile({
        url: "/admin/total-application-download",
        filename: "Application.csv",
      });
      // toast.info("Downloading will start in few seconds");
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Error downloading");
    }finally{
      setDownloading(false)
      
    }
  };
  return (
    <>
      <Header customLink="/agent/shortlist" />
      <div>
        <span className="fixed overflow-y-scroll scrollbar-hide  bg-white">
          <AdminSidebar />
        </span>
      </div>
      <div className=" bg-white">
        <span className="flex items-center pt-16 md:ml-[16.5%] sm:ml-[22%]  ">
          <span>
            <p className="text-[28px] font-bold text-sidebar mt-4 ml-9">
              Applications ({totalUsersCount})
            </p>
            <p className="mt-1 font-normal text-body ml-9 pr-[30%] mb-2">
              Review your agents and students applications here. Stay updated on
              their status and view detailed forms for each submission.
            </p>
          </span>
        </span>
      </div>
      <span className="flex md:flex-row sm:flex-col md:items-center sm:items-start justify-between mr-6">
        <span className="flex flex-row items-center mb-3 m-6 mt-6 sm:ml-[27%] md:ml-[19%] ">
          {" "}
         
          <select
            className="ml-3 border px-2 py-1 w-40 h-11 rounded outline-none"
            onChange={handleTypeFilter}
            value={isTypeFilter}
          >
            <option value="" className="text-body">
              Submitted By
            </option>
            <option value="student">Student</option>
            <option value="agent">Agent</option>
          </select>
          <span className="flex flex-row items-center ml-9">
            <CustomInput
              className="h-11 md:w-80 sm:w-40 rounded-md text-body placeholder:px-3 pl-7 border border-[#E8E8E8] outline-none"
              type="text"
              placeHodler="Search by User Name & User Id "
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
          onClick={downloadAll}
          className="bg-primary ml-5 sm:ml-[27%] text-white px-4 rounded-md py-2 cursor-pointer"
        >
                    {downloading ? "Downloading...." : "Download"}

        </span>
      </span>
      {loading ? (
        <div
          className={`w-1  mt-12 ${
            location.pathname === "/student-profile" ? "ml-[45%]" : "ml-[53%]"
          }`}
        >
          <Loader />
        </div>
      ) : TABLE_ROWS?.length > 0 ? (
        <>
          <div className="mt-3 mr-6 md:ml-[19%] sm:ml-[26%]">
            <CustomTableNine
              tableHead={TABLE_HEAD}
              tableRows={TABLE_ROWS}
              action="View List"
              linkOne={"/admin/student-applications"}
              icon={<FaRegEye />}
            />
          </div>

          <div className="mt-12 ml-52 mb-10">
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
        <div className="ml-52">
          <Dnf
            dnfImg={dnf}
            headingText="Start Your Journey!"
            bodyText="No Application Data Available "
          />
        </div>
      )}
    </>
  );
};

export default ApplicationList;
