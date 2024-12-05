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
import {  CustomTableNine } from "../components/Table";
import { downloadFile } from "../features/adminApi";
import { toast } from "react-toastify";
import { FaRegEye } from "react-icons/fa";

const ApplicationList = () => {
  const dispatch = useDispatch();
  const { applications } = useSelector((state) => state.admin);
  const {} = useSelector((state) => state.admin);
  const { getApplicationOverview } = useSelector((state) => state.admin);
  const { updateState, tabType } = useSelector((state) => state.admin);
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [isTypeFilter, setIsFilterType] = useState("");
  const [page, setPage] = useState(1);
  const totalUsersCount = getApplicationOverview?.data?.totalCount || 0;
  const currentPage = getApplicationOverview?.data?.currentPage;
  const totalPagesCount = getApplicationOverview?.data?.totalPages;

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
    dispatch(adminApplicationOverview({ page, perPage, search, isTypeFilter }));
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
    name: data?.firstName +" "+ data?.lastName  || "NA",
    stId: data?.stId || "_",
    submittedby: data?.submittedBy || "_",
    total: data?.institutionCount || "_",
    underreview: data?.underReviewCount || "_",
    approved: data?.approvedCount || "_",
    action: data?.action || "NA",
    data: data || "NA"
  }));
// console.log(getApplicationOverview)
  const downloadAll = async () => {
    try {
      await downloadFile({
        url: "/admin/total-application-download",
        filename: "Application.csv",
      });
      toast.info("Downloading will start in few seconds");
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Error downloading");
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
              Application Review ({totalUsersCount})
            </p>
            <p className="mt-1 font-normal text-body ml-9 pr-[30%] mb-2">
              Review your agents and students applications here. Stay updated on
              their status and view detailed forms for each submission.
            </p>
          </span>
        </span>
      </div>
      <span className="flex flex-row items-center justify-between mr-6">
        <span className="flex flex-row items-center mb-3 m-6 mt-6 sm:ml-[27%] md:ml-[19%] ">
          {" "}
          <span className="text-body">Show</span>
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
          <span className="px-3 text-body">entries</span>
          <select
            className="ml-3 border px-2 py-1 w-40 h-11 rounded outline-none"
            onChange={handleTypeFilter}
            value={isTypeFilter}
          >
            <option value="" className="text-body">
              Submitted By
            </option>
            <option value="student">Student</option>
            <option value="company">Agent</option>
          </select>
          <span className="flex flex-row items-center ml-9">
            <CustomInput
              className="h-11 md:w-80 sm:w-48 rounded-md text-body placeholder:px-3 pl-7 border border-[#E8E8E8] outline-none"
              type="text"
              placeHodler="Search by User Name & Application Id "
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
          className="bg-primary ml-5 text-white px-4 rounded-md py-2 cursor-pointer"
        >
          Download
        </span>
      </span>
      <div className="mt-3 mr-6 ml-[19%] ">
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
  );
};

export default ApplicationList;
