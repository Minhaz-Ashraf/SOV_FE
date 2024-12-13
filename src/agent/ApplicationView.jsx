import React, { useEffect, useState } from "react";
import Header from "../components/dashboardComp/Header";
import AgentSidebar from "../components/dashboardComp/AgentSidebar";
import { CustomTable, CustomTableTwo } from "../components/Table";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { studentApplications } from "../features/agentSlice";
import { dnf, profileSkeleton } from "../assets";
import { FaRegEye } from "react-icons/fa";
import { studentById } from "./../features/generalSlice";
import { CustomInput, SelectComponent } from "../components/reusable/Input";
import { IoSearchOutline } from "react-icons/io5";
import { applicationTypeOption, statusApplicationView, statusOption } from "../constant/data";
import Pagination from "../components/dashboardComp/Pagination";
import Loader from "../components/Loader";
import Dnf from "../components/Dnf";
import ApplicationChoosePop from "../components/dashboardComp/ApplicationChoosePop";

const ApplicationView = ({stId, adminPath, adminAccess}) => {
  const role = localStorage.getItem("role");
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isType, setIsType] = useState("");
  const { studentApplicationData } = useSelector((state) => state.agent);
  const { studentData } = useSelector((state) => state.general);
  const studentId = 
  location.pathname === "/student-profile" 
    ? stId || (adminPath && adminAccess) || location?.state?.notifyId
    : location?.state?.notify === "notify" ? location?.state?.notifyId : location.state ||  location?.state?.notifyId
// console.log(location)
  const [isLoading, setIsLoading] = useState(true);
  const [perPage, setPerPage] = useState(10);
  const totalUsersCount = studentApplicationData?.totalApplications || 0;
  const currentPage = studentApplicationData?.currentPage || 1;
  const totalPagesCount = studentApplicationData?.totalPages || 1;
  const dispatch = useDispatch();
  const [applicationIds, setApplicationIds] = useState([]);
  const [isOpenOpt, setIsOpenOpt] = useState(false);
  // const availableApplications =  studentApplicationData?.applications?.filter(

  // )

  const closeOpt = () => {
    setIsOpenOpt(false); // Close the popup
  };

  const handleOpenOpt = () => {
    setIsOpenOpt(true); // Open the popup
  };

  const handlePerPageChange = (e) => {
    setPerPage(parseInt(e.target.value));
    setPage(1);
  };
  const handleApplicatioTypeChange = (e) => {
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
    dispatch(studentApplications({ search, isType, studentId, page, perPage }));
  }, [dispatch, search, studentId, page, perPage, isType]);

  // Generate options for per page dropdown
  const perPageOptions = [];
  for (let i = 10; i <= Math.min(totalUsersCount, 100); i += 10) {
    perPageOptions.push(i);
  }

  // Define table columns
  const TABLE_HEAD = [
    "S.No.",
    "Application ID",
    // "Institute", 
    "Country",
    "Type",
    "Status",
    "Action",
  ];

  // Prepare table data
  const TABLE_ROWS = studentApplicationData?.applications?.map(
    (data, index) => ({
      sno: (currentPage - 1) * perPage + index + 1,
      id: data?.applicationId || "NA",
      institute: data?.preferences?.institution || "NA",
      country: data?.preferences?.country || "NA",
      type: data || "NA",
      status: data?.status || "NA",
      appId: data?._id,
    })
  );
  useEffect(() => {
    if (studentApplicationData?.applications) {
      const ids = studentApplicationData.applications.map((data) => data._id);
      setApplicationIds(ids);
    }
  }, [studentApplicationData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {location.pathname === "/student-profile" ? (
        ""
      ) : (
        <>
          <Header customLink="/agent/shortlist" />

          <span className="fixed overflow-y-scroll scrollbar-hide  bg-white">
            <AgentSidebar />
          </span>
        </>
      )}

      <div>
        {location.pathname === "/student-profile" ? (
          ""
        ) : (
          <>
            <span className="flex items-center pt-20 pb-6 md:pl-[18.5%] sm:pl-[27%] bg-white">
              <span>
                <div className="flex items-center gap-4 mt-1 ">
                  <img
                    src={
                      studentData?.studentInformation?.personalInformation
                        ?.profilePicture || profileSkeleton
                    }
                    alt="Profile"
                    className="rounded-md w-28 h-28"
                    onError={profileSkeleton}
                    loading="lazy"
                  />
                  <span className="flex flex-col">
                    <span className="text-primary font-medium text-[13px]">
                      {totalUsersCount || "0"} Applications
                    </span>
                    <span className="text-sidebar text-[18px] font-medium ">
                      {studentData?.studentInformation?.personalInformation
                        ?.firstName +
                        " " +
                        studentData?.studentInformation?.personalInformation
                          ?.lastName || "NA"}
                    </span>
                    <span className="text-[14px] pt-[1px] text-body font-normal">
                      {studentData?.studentInformation?.personalInformation
                        ?.email || "NA"}
                    </span>
                    <span className="text-[14px] text-body font-normal">
                      {studentData?.studentInformation?.personalInformation
                        ?.phone?.phone || "NA"}
                    </span>
                    <span className="text-[14px] text-body font-normal">
                      ID: {studentData?.studentInformation?.stId || "NA"}
                    </span>
                  </span>
                </div>
              </span>
            </span>
          </>
        )}
        <div
          className={`mt-6 mr-6 ${
            location.pathname === "/student-profile"
              ? "ml-6"
              : "md:ml-[19.5%]  sm:ml-[27%]"
          }`}
        >
          <span className="flex flex-row items-center mb-3">
            <span className="flex flex-row justify-between w-full items-center">
              <span className="flex flex-row items-center ">
                {" "}
            
                <select
                  className="ml-3 border px-2 py-1 md:w-40 sm:w-20 h-11 rounded outline-none"
                  value={isType}
                  onChange={handleApplicatioTypeChange}
                >
                  <option value="">Status</option>
                  {statusApplicationView.map((option) => (
                    <option key={option.option} value={option.option}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span className="flex flex-row items-center  ml-9">
                  <CustomInput
                    className="h-11 md:w-80 sm:w-60 rounded-md text-body placeholder:px-3 pl-7 border border-[#E8E8E8] outline-none"
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
              {!adminPath && 
              <Link
                onClick={handleOpenOpt}
                className="bg-primary text-white px-4  rounded-md py-2"
              >
                + Add Application
              </Link>}
            </span>
          </span>
        </div>
      </div>
      {isLoading ? (
        <div className={`w-1  mt-12 ${
            location.pathname === "/student-profile" ? "ml-[45%]" : "ml-[53%]"
          }`}>
          <Loader />
        </div>
      ) : studentApplicationData?.applications &&
        studentApplicationData?.applications?.length > 0 ? (
        <>
          <div className={`  mt-6 mr-6 ${
            location.pathname === "/student-profile" ? "ml-6" : "ml-[19%]"
          }`}>
            <CustomTableTwo
              tableHead={TABLE_HEAD}
              tableRows={TABLE_ROWS}
              SecondLink="/offerLetter-apply"
              action={  role === "0" ? "View": "Edit/View"}
              icon={<FaRegEye />}
              // link="/offerLetter/edit"
              customLinkState={TABLE_ROWS?.map((data) => data?._id)}
            />
          </div>
          <div className={`mt-16 mb-10  ${
            location.pathname === "/student-profile" ? "-ml-20" : "ml-20"
          }`}>
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
        <div
          className={`mt-8 font-medium text-body  mr-[15%] ${
            location.pathname === "/student-profile" ? "ml-6" : "ml-[25%]"
          }`}
        >
          <Dnf
            dnfImg={dnf}
            headingText="Start Your Journey!"
            bodyText="No Application Data Available for this Student"
          />
        </div>
      )}

      <ApplicationChoosePop
        isOpenOpt={isOpenOpt}
        closeOpt={closeOpt}
        state={studentData?.studentInformation?._id}
      />
    </>
  );
};

export default ApplicationView;
