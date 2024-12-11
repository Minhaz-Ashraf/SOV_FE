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
import { applicationForApproval } from "../features/adminSlice";
import { uploadApplications } from "../features/adminApi";
import { useLocation, useSearchParams } from "react-router-dom";

const ApplicationReview = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const { applications } = useSelector((state) => state.admin);
  const { updateState, tabType } = useSelector((state) => state.admin);
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [isTypeFilter, setIsFilterType] = useState("")
  const [page, setPage] = useState(1);
  const totalUsersCount = applications?.totalRecords || 0;
  const currentPage = applications?.currentPage;
  const totalPagesCount = applications?.totalPages;
 
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "pending");
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  // const handlePerPageChange = (e) => {
  //   setPerPage(parseInt(e.target.value));
  //   setPage(1);
  // };
  
  // const handleTypeFilter = (e) =>{
  //   setIsFilterType(e.target.value)
  //   setPage(1);
  // }

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const perPageOptions = [];
  for (let i = 10; i <= Math.min(totalUsersCount, 100); i += 10) {
    perPageOptions.push(i);
  }
  useEffect(() => {
    if(tabType === "underreview" || tabType === "approved" || tabType === "rejected"){
      setPage(1);

    dispatch(applicationForApproval({tabType, page, perPage, search, isTypeFilter}));
    }
  }, [page, perPage, updateState, tabType, search, isTypeFilter]);

  const tabs = [
    {
      name: "pending",
      label: "Pending",
      component: Pending,
      props: { data: applications },
    },
    {
      name: "approved",
      label: "Approved",
      component: Approved,
      props: { data: applications },
    },
    {
      name: "rejected",
      label: "Rejected",
      component: Rejected,
      props: { data: applications },
    },
  ];
  useEffect(() => {
    // Check the pathname and reset the active tab if needed
    if (location.pathname !== "/admin/applications-review") {
      setActiveTab("pending");
      setSearchParams({ tab: "pending" }); // Update the search params
    } else {
      setActiveTab(searchParams.get("tab") || "pending"); // Set from search params
    }
  }, [location.pathname, searchParams]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setSearchParams({ tab: tabName });
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
            <p className="text-[28px] font-bold text-sidebar mt-6 ml-9">
              Application Review
            </p>
            <p className="mt-1 font-normal text-body ml-9 pr-[30%]">
              Review your agents and students applications here. Stay updated on
              their status and view detailed forms for each submission.
            </p>
          </span>
        </span>
      </div>
      <span className="flex flex-row items-center mb-3 m-6 mt-6 sm:ml-[27%] md:ml-[19%] ">
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
        {/* <select
          className="ml-3 border px-2 py-1 w-40 h-11 rounded outline-none"
           onChange={handleTypeFilter}
           value ={isTypeFilter}
        >
          <option value="" className="text-body">
            User Type
          </option>
          <option value="student">Student</option>
          <option value="company">Agent</option>
        </select> */}
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
      <div className="sm:ml-14 md:ml-0">
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} setActiveTab={setActiveTab} />
      </div>
{applications?.applications  ?  

      <div className="mt-12 mb-10 ">
        <Pagination
          currentPage={currentPage}
          hasNextPage={currentPage * perPage < totalUsersCount}
          hasPreviousPage={currentPage > 1}
          onPageChange={handlePageChange}
          totalPagesCount={totalPagesCount}
        />
      </div> : null}
    </>
  );
};

export default ApplicationReview;
