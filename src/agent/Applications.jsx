import React, { useEffect, useState } from "react";
import AgentSidebar from "../components/dashboardComp/AgentSidebar";
import Header from "../components/dashboardComp/Header";
import { CustomTable } from "../components/Table";
import { FaRegEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { allApplication, applictionOverview } from "../features/agentSlice";
import { CustomInput } from "../components/reusable/Input";
import { IoSearchOutline } from "react-icons/io5";
import Pagination from "../components/dashboardComp/Pagination";
import Loader from "../components/Loader";
import { Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import Dnf from "../components/Dnf";
import { dnf } from "../assets";
import ApplicationChoosePop from "../components/dashboardComp/ApplicationChoosePop";

const Applications = () => {
  const { applicationOverviewData } = useSelector((state) => state.agent);
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1); // Track the current page
  const [isLoading, setIsLoading] = useState(true);
  const totalUsersCount = applicationOverviewData?.pagination?.totalResults || 0;
  const currentPage = applicationOverviewData?.pagination?.currentPage;
  const totalPagesCount = applicationOverviewData?.pagination?.totalPages;

  const TABLE_ROWS = applicationOverviewData?.studentOverview?.map(
    (data, index) => ({
      SNO: (currentPage - 1) * perPage + index + 1,
      name: data?.firstName || 0,
      id: data?.stId || 0,
      total: data?.totalCount || 0,
      underReview: data?.underReviewCount || 0,
      approved: data?.approvedCount || 0,
      customLinkState: data?.studentInformationId,
  
    })
  );

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handlePerPageChange = (e) => {
    setPerPage(parseInt(e.target.value));
    setPage(1);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); 
  };

  const perPageOptions = [];
  for (let i = 10; i <= Math.min(totalUsersCount, 100); i += 10) {
    perPageOptions.push(i);
  }
  console.log(search);
  useEffect(() => {
    dispatch(applictionOverview({ search, perPage, page }));
  }, [dispatch, search, perPage, page]);

  const TABLE_HEAD = [
    "S.No.",
    "Student Name",
    "ID",
    "Total Application",
    "Under Review",
    "Approved",
    "Action",
    "Apply",
  ];
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Header customLink="/agent/shortlist" />
      <div>
        <span className="fixed overflow-y-scroll scrollbar-hide  bg-white">
          <AgentSidebar />
        </span>
      </div>
      <div className="bg-white">
        <span className="flex items-center pt-20 md:ml-[16.5%] sm:ml-[23%] ">
          <span>
            <p className="md:text-[28px] text-[22px] font-bold text-sidebar mt-6 ml-9">
              Application Overview ({totalUsersCount})
            </p>
            <p className="mt-1 font-normal text-body pr-[20%] ml-9">
              Track your college applications here. Stay updated on their status
              and view detailed forms for each submission.
            </p>
          </span>
        </span>
      </div>
      <span className="flex flex-row items-center justify-start md:ml-[19.5%] sm:ml-[28%] mt-6">
        {/* <span className="text-body">Show</span>
        <select
          className="ml-3 border px-2 py-1 w-10 rounded outline-none"
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
        <span className="flex flex-row items-center  ml-9">
          <CustomInput
            className="h-11 w-80 rounded-md text-body placeholder:px-3 pl-7 border border-[#E8E8E8] outline-none"
            type="text"
            placeHodler="Search Student name and ID"
            name="search"
            value={search}
            onChange={handleSearchChange} // Update search on input change
          />
          <span className="absolute pl-2 text-[20px] text-body">
            <IoSearchOutline />
          </span>
        </span>
      </span>
      {isLoading ? (
        <div className="w-1 ml-[53%] mt-12">
          <Loader />
        </div>
      ) : applicationOverviewData?.studentOverview &&
        applicationOverviewData?.studentOverview?.length > 0 ? (
        <>
          <div className="md:ml-[19.5%] sm:ml-[28%] mt-6 z-0 ">
            <CustomTable
              tableHead={TABLE_HEAD}
              tableRows={TABLE_ROWS} 
              SecondAction="Apply Application"
              customClass="border border-primary  px-2 rounded-xl text-primary font-normal text-[12px] py-1"
              // SecondLink="/offerLetter-apply"
              action={"View List"}
              link={"/agent/application/lists"}
              icon={<FaRegEye />}
            />
          </div>
          <div className="mt-16 mb-10">
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
            bodyText="No Applications Available to Show"
          />
        </div>
      )}
  
    </>
  );
};

export default Applications;

export const ExtraField = () => {
  return (
    <td className="p-4">
      <Typography
        as="a"
        href="#"
        variant="small"
        color="blue-gray"
        className="font-medium"
      >
        <Link
          to="/agent/application/lists"
          // state={customLinkState}
          className="flex flex-row items-center gap-2"
        >
          {" "}
          <span className="text-primary">
            <FaRegEye />
          </span>{" "}
          <span className="font-body">View List</span>
        </Link>
      </Typography>
    </td>
  );
};
