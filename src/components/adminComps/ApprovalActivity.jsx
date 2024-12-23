import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegEye } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";

import { getTeamApplication, getTeamApproval, getTeamTickets } from "../../features/adminSlice";
import { CustomTableTen, CustomTableThirteen, CustomTableTwelve } from "../Table";
import Dnf from "../Dnf";
import Pagination from "../dashboardComp/Pagination";
import { CustomInput } from "../reusable/Input";
import { priorityOption, statusOption, userType } from "../../constant/data";
import { formatDate } from "./../../constant/commonfunction";
import { dnf } from "../../assets";

const ApprovalActivity = ({id}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isType, setIsType] = useState("");
  const [dateObj, setDateObj] = useState(null);
  const [isDate, setDate] = useState("");
  const [isPriorityType, setIsPriorityType] = useState("");

  const { getApprovalActivityData } = useSelector((state) => state.admin);
  const [isLoading, setIsLoading] = useState(true);
  const [perPage, setPerPage] = useState(10);
  const totalUsersCount = getApprovalActivityData?.totalUsers || 0;
  const currentPage = getApprovalActivityData?.currentPage  || 1;
  const totalPagesCount =
    getApprovalActivityData?.totalPages || 1;
  const dispatch = useDispatch();

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    setDate(dateValue);
    setDateObj(dateValue ? new Date(dateValue) : null);
    setPage(1);
  };
  const handlePriorityTypeChange = (e) => {
    setIsPriorityType(e.target.value);
    setPage(1);
  };
  const handleTypeChange = (e) => {
    setIsType(e.target.value);
    setPage(1);
  };
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  useEffect(() => {
    dispatch(getTeamApproval({id, page, perPage, isType, search }));
  }, [id, page, perPage, isType, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const TABLE_HEAD = [
    "S.No.",
    "User Name",
    "User Id",
    "User Type",
    "Status",
  ];

  const TABLE_ROWS = getApprovalActivityData?.data?.map(
    (data, index) => ({
      sno: (currentPage - 1) * perPage + index + 1,
      id: data?.agId || data?.stId || "NA",
      name: data?.firstName + " " + data?.lastName || "NA",
      type: data?.type || "NA",
      status: data?.status || "NA",
    })
  );

  return (
    <>
      <div>
        <div className=" ml-6 mt-6 ">
          <span className="flex flex-row w-full items-center">
          
            <select
              className="ml-3 border px-2 py-1 md:w-40 sm:w-24 h-11 rounded outline-none"
              value={isType}
              onChange={handleTypeChange}
            >
              <option value="">User Type</option>
              {userType.map((option) => (
                <option key={option.option} value={option.option}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="flex flex-row items-center sm:ml-3">
              <CustomInput
                className="h-11 md:w-80 sm:w-44  rounded-md text-body placeholder:px-3 pl-7 border border-[#E8E8E8] outline-none"
                type="text"
                placeHodler="Search by User ID"
                name="search"
                value={search}
                onChange={handleSearchChange}
              />
              <span className="absolute pl-2 text-[20px] text-body">
                <IoSearchOutline />
              </span>
            </span>
          </span>
        </div>
        {(Array.isArray(getApprovalActivityData?.data) && getApprovalActivityData?.data?.length > 0)? 
          <>
            <div className=" md:mx-6 mt-6  sm:ml-6 ">
              <CustomTableThirteen tableHead={TABLE_HEAD} tableRows={TABLE_ROWS} />
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
      :
      <div className="mt-8 font-medium text-body ml-[15%] md:mr-[15%]">
            <Dnf
              dnfImg={dnf}
              headingText="No Data Available!"
              bodyText="No Activity Available to show"
            />
          </div>
        }
      </div>
    </>
  );
};

export default ApprovalActivity;
