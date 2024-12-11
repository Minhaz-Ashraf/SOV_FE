import React, { useEffect, useState } from "react";
import Header from "../components/dashboardComp/Header";
import AdminSidebar from "../components/dashboardComp/AdminSidebar";
import { useDispatch, useSelector } from "react-redux";
import { CustomInput } from "../components/reusable/Input";
import { IoSearchOutline } from "react-icons/io5";
import Pagination from "../components/dashboardComp/Pagination";
import {
  adminApplicationOverview,
  applicationForApproval,
  getStudentById,
} from "../features/adminSlice";
import {
  CustomTableEight,
  CustomTableNine,
  CustomTableTwo,
} from "../components/Table";
import { downloadFile } from "../features/adminApi";
import { toast } from "react-toastify";
import { FaRegEye } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { dnf, profileSkeleton } from "../assets";
import { studentApplications } from "../features/agentSlice";
import { statusApplicationView, statusOption } from "../constant/data";
import { MdOutlineUploadFile } from "react-icons/md";
import Loader from "../components/Loader";
import Dnf from "../components/Dnf";

const StudentApplicationView = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { getUrlData } = useSelector((state) => state.admin);

  const { studentApplicationData } = useSelector((state) => state.agent);
  const studentId = location.state?.id;
  const { getStudentDataById } = useSelector((state) => state.admin);
  const [isType, setIsType] = useState("");
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const totalUsersCount = studentApplicationData?.totalApplications || 0;
  const currentPage = studentApplicationData?.currentPage || 1;
  const totalPagesCount = studentApplicationData?.totalPages || 1;
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
  const handleApplicatioTypeChange = (e) => {
    setIsType(e.target.value);
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
    dispatch(studentApplications({ search, isType, studentId, page, perPage }));
  }, [page, perPage, search, isType, studentId]);

  const TABLE_HEAD = [
    "S.No.",
    "Application ID",
    // "Institute",
    "Country",
    "Type",
    "Status",
    "Upload Document",
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
      studentId: studentId,
    })
  );
  useEffect(() => {
    dispatch(getStudentById(studentId));
  }, [dispatch, studentId]);



  return (
    <>
      <Header customLink="/agent/shortlist" />
      <div>
        <span className="fixed overflow-y-scroll scrollbar-hide  bg-white">
          <AdminSidebar />
        </span>
      </div>
      <div className=" bg-white">
        <div className="flex items-center gap-4 mt-16  md:ml-[18.5%] sm:ml-[25%] py-6">
          <img
            src={
              getStudentDataById?.studentInformation?.personalInformation
                ?.profilePicture || profileSkeleton
            }
            alt="Profile"
            className="rounded-md w-28 h-28"
            onError={profileSkeleton}
            loading="lazy"
          />
          <span className="flex flex-col">
            <span className="text-sidebar text-[18px] font-medium ">
              {getStudentDataById?.studentInformation?.personalInformation
                ?.firstName +
                " " +
                getStudentDataById?.studentInformation?.personalInformation
                  ?.lastName || "NA"}
            </span>
            <span className="text-[14px] pt-[1px] text-body font-normal">
              {getStudentDataById?.studentInformation?.personalInformation
                ?.email || "NA"}
            </span>
            <span className="text-[14px] text-body font-normal">
              {getStudentDataById?.studentInformation?.personalInformation
                ?.phone?.phone || "NA"}
            </span>
            <span className="text-[14px] text-body font-normal">
              ID: {getStudentDataById?.studentInformation?.stId || "NA"}
            </span>
          </span>
        </div>
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
        <select
          className="ml-3 border px-2 py-1 w-40 h-11 rounded outline-none"
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
        <span className="flex flex-row items-center ml-9">
          <CustomInput
            className="h-11 md:w-80 sm:w-48 rounded-md text-body placeholder:px-3 pl-7 border border-[#E8E8E8] outline-none"
            type="text"
            placeHodler="Search by Application Id "
            name="search"
            value={search}
            onChange={handleSearchChange}
          />
          <span className="absolute pl-2 text-[20px] text-body">
            <IoSearchOutline />
          </span>
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

        <CustomTableTwo
          tableHead={TABLE_HEAD}
          tableRows={TABLE_ROWS}
          SecondLink="/offerLetter-apply"
          action={"View"}
          icon={<FaRegEye />}
          // link="/offerLetter/edit"
          ThirdAction={<MdOutlineUploadFile />}
          customLinkState={TABLE_ROWS?.map((data) => data?._id)}
          customData={TABLE_ROWS?.map(
            (data) => data?.type?.studentInformationId
          )}

          customDataTwo={getUrlData?.data?.documents?.map((data) => ({
            studentId: data?.applicationId,
            document: data?.document,
          }))}
          customDataThree={TABLE_ROWS?.map(
            (data) => data?.type?._id
          )}
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

export default StudentApplicationView;
