import React, { useEffect, useState } from "react";
import Header from "../components/dashboardComp/Header";
import { CustomTableThree, CustomTableTwo } from "../components/Table";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { dnf, profileSkeleton } from "../assets";
import { FaRegEye } from "react-icons/fa";
import { studentById } from "./../features/generalSlice";
import { CustomInput } from "../components/reusable/Input";
import { IoSearchOutline } from "react-icons/io5";
import { applicationTypeOption, statusOption } from "../constant/data";
import Pagination from "../components/dashboardComp/Pagination";
import Loader from "../components/Loader";
import Dnf from "../components/Dnf";
import Sidebar from "../components/dashboardComp/Sidebar";
import { clearApplicationData, getApplications } from "../features/studentSlice";
import ApplicationChoosePop from "../components/dashboardComp/ApplicationChoosePop";

const AllApplication = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isType, setIsType] = useState("");
  const { studentInfoData, applicationData } = useSelector(
    (state) => state.student
  );
  const [isOpenOpt, setIsOpenOpt] = useState(false);
  const studentId = studentInfoData?.data?.studentInformation?._id;
  const [isLoading, setIsLoading] = useState(true);
  const [perPage, setPerPage] = useState(10);
  const totalUsersCount = applicationData?.data?.length || 0;
  const currentPage = applicationData?.pagination?.currentPage || 1;
  const totalPagesCount = applicationData?.pagination?.totalPages || 1;
  const dispatch = useDispatch();
  const closeOpt = () => {
    setIsOpenOpt(false); 
  };

  const handleOpenOpt = () => {
    setIsOpenOpt(true); 
  };
  const handlePerPageChange = (e) => {
    setPerPage(parseInt(e.target.value));
    setPage(1);
  };
  const handleApplicatioTypeChange = (e) => {
    dispatch(clearApplicationData())
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
    dispatch(studentById(studentId));
    dispatch(getApplications({ search, isType, studentId, page, perPage }));
  }, [dispatch, search, studentId, page, perPage, isType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const perPageOptions = [];
  for (let i = 10; i <= Math.min(totalUsersCount, 100); i += 10) {
    perPageOptions.push(i);
  }

  const TABLE_HEAD = ["S.No.", "Application ID","Country" ,"Type", "Status", "Action"];
  
  const TABLE_ROWS = applicationData?.data?.map((data, index) => ({
    sno: (currentPage - 1) * perPage + index + 1,
    id: data?.applicationId || "NA",
    type: data || "NA",
    status: data?.status || "NA",
    appId: data?._id,
  }));

  return (
    <>
      <Header customLink="/agent/shortlist" />
      <span className="fixed overflow-y-scroll scrollbar-hide  bg-white">
        <Sidebar />
      </span>

      {isLoading ? (
        <div className="w-1 ml-[53%] mt-44">
          <Loader />
        </div>
      ) : (
        <>
          <div>
            <span className="flex items-center pt-20 pb-6 md:pl-[18.5%] sm:pl-[27%] bg-white">
              <span>
                <div className="flex items-center gap-4 mt-1 ">
                  <img
                    src={
                      studentInfoData?.data?.studentInformation
                        ?.personalInformation?.profilePicture || profileSkeleton
                    }
                    alt="Profile"
                    className="rounded-md w-28 h-28"
                    onError={profileSkeleton}
                    loading="lazy"
                  />
                  <span className="flex flex-col">
                    <span className="text-primary font-medium text-[13px]">
                      {totalUsersCount || "NA"} Applications
                    </span>
                    <span className="text-sidebar text-[18px] font-medium ">
                      {studentInfoData?.data?.studentInformation
                        ?.personalInformation?.firstName +
                        " " +
                        studentInfoData?.data?.studentInformation
                          ?.personalInformation?.lastName || "NA"}
                    </span>
                    <span className="text-[14px] pt-[1px] text-body font-normal">
                      {studentInfoData?.data?.studentInformation
                        ?.personalInformation?.email || "NA"}
                    </span>
                    <span className="text-[14px] text-body font-normal">
                      {studentInfoData?.data?.studentInformation
                        ?.personalInformation?.phone?.phone || "NA"}
                    </span>
                    <span className="text-[14px] text-body font-normal">
                      ID:{" "}
                      {studentInfoData?.data?.studentInformation?.stId || "NA"}
                    </span>
                  </span>
                </div>
              </span>
            </span>

            <div className="md:ml-[19.5%] sm:ml-[26%] mt-6 md:mr-6 sm:mr-2">
              <span className="flex flex-row items-center mb-3">
                <span className="flex flex-row justify-between w-full items-center">
                  <span className="flex flex-row items-center ">
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
                    <span className="md:px-3 sm:px-1 text-body">entries</span> */}
                    <select
                      className="ml-3 border px-2 py-1 md:w-40 sm:w-24 h-11 rounded outline-none"
                      value={isType}
                      onChange={handleApplicatioTypeChange}
                    >
                      <option value="">Status</option>
                      {statusOption.map((option) => (
                        <option key={option.option} value={option.option}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <span className="flex flex-row items-center md:ml-9 sm:ml-3">
                      <CustomInput
                        className="h-11 md:w-80 sm:w-44  rounded-md text-body placeholder:px-3 pl-7 border border-[#E8E8E8] outline-none"
                        type="text"
                        placeHodler="Search by application ID"
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
                    onClick={handleOpenOpt}
                    className="bg-primary text-white md:px-4 sm:px-2 rounded-md py-2 cursor-pointer"
                  >
                    + Add Application
                  </span>
                </span>
              </span>
            </div>

            {totalUsersCount > 0 ? (
              <>
                <div className="md:ml-[19.5%] sm:ml-[27%] mt-6 w-[85%]  ">
                  <CustomTableTwo
                    tableHead={TABLE_HEAD}
                    tableRows={TABLE_ROWS}
                    SecondLink="/offerLetter-apply"
                    action={"Edit/View"}
                    icon={<FaRegEye />}
                    // link="/offerLetter/edit"
                    customLinkState={TABLE_ROWS?.map((data) => data?._id)}
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
                  bodyText="No Application Data Available for this Student"
                />
              </div>
            )}
          </div>
          
      <ApplicationChoosePop
        isOpenOpt={isOpenOpt}
        closeOpt={closeOpt}
        state={studentId}
      />
        </>
      )}
    </>
  );
};

export default AllApplication;
