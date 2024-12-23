import React, { useEffect, useState } from "react";
import Header from "../components/dashboardComp/Header";
import AdminSidebar from "../components/dashboardComp/AdminSidebar";
import Pagination from "../components/dashboardComp/Pagination";
import { IoSearchOutline } from "react-icons/io5";
import { CountrySelect, CustomInput } from "../components/reusable/Input";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Dnf from "../components/Dnf";
import { getInstitutes, setEmptyInstitute } from "../features/adminSlice";
import { dnf } from "../assets";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { CustomTableTen } from "../components/Table";
import { FaRegEye } from "react-icons/fa";
import { RiEdit2Line } from "react-icons/ri";
import { ImBin } from "react-icons/im";
import { downloadFile } from "../features/adminApi";

const AdminInstitute = () => {
  const role = localStorage.getItem("role");
  const { prefCountryOption } = useSelector((state) => state.general);
  const { allInstitutes } = useSelector((state) => state.admin);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const [downloading, setDownloading] = useState(false);
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [isTypeFilter, setIsFilterType] = useState("");
  const [page, setPage] = useState(1);
  const totalUsersCount = allInstitutes?.data?.totalRecords || 0;
  const currentPage = allInstitutes?.data?.currentPage;
  const totalPagesCount = allInstitutes?.data?.totalPages;
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

  const handleEmpty = () => {
    dispatch(setEmptyInstitute());
  };

  const perPageOptions = [];
  for (let i = 10; i <= Math.min(totalUsersCount, 100); i += 10) {
    perPageOptions.push(i);
  }
  useEffect(() => {
    // setLoading(true);
    dispatch(getInstitutes({ isTypeFilter, search, page, perPage }));

    // setLoading(false);
  }, [isTypeFilter, search, page, perPage]);

  const TABLE_HEAD = ["S.No.", "Institute Name", "Country", "View", "Action"];

  const TABLE_ROWS = allInstitutes?.data?.institutes?.map((data, index) => ({
    sno: (currentPage - 1) * perPage + index + 1,
    name: data?.instituteName || "NA",
    data: data || "NA",
  }));
  // console.log(allInstitutes)

  const downloadAll = async () => {
    try {
      setDownloading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await downloadFile({
        url: "/institute/download-all",
        filename: "Application.csv",
      });
      // toast.info("Downloading will start in few seconds");
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Error downloading");
    } finally {
      setDownloading(false);
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
              Institutions ({totalUsersCount})
            </p>
            <p className="mt-1 font-normal text-body ml-9  mb-2">
              Easily find and manage all your listed institutions.
            </p>
          </span>
        </span>
      </div>
      <span className="flex md:flex-row sm:flex-col md:justify-between  -mt-7   mr-6 md:items-center ">
        <span className="flex flex-row items-center mb-3 m-6 sm:ml-[25%] md:ml-[20%] lg:ml-[18%] gap-3  ">
          {" "}
          <CountrySelect
            notImp={true}
            name="isTypeFilter"
            options={prefCountryOption}
            customClass="bg-white ml-6"
            value={isTypeFilter}
            handleChange={handleTypeFilter}
          />
          <span className="flex flex-row items-center ">
            <CustomInput
              className="h-11 w-80 mt-4 rounded-md text-body placeholder:px-3 pl-7 border border-[#E8E8E8] outline-none"
              type="text"
              placeHodler="Search by User Name & User Id "
              name="search"
              value={search}
              onChange={handleSearchChange}
            />
            <span className="absolute pl-2 mt-4  text-[20px] text-body">
              <IoSearchOutline />
            </span>
          </span>
        </span>
        <span className="flex items-center sm:ml-48 ">
          {role === "0" && (
            <span
              onClick={downloadAll}
              className="bg-primary ml-5  text-white px-4 rounded-md py-2 cursor-pointer"
            >
              {downloading ? "Downloading...." : "Download"}
            </span>
          )}
          <Link
            onClick={handleEmpty}
            to="/add-institute"
            className="bg-primary ml-5  text-white px-4 rounded-md py-2 cursor-pointer"
          >
            + Add Institute
          </Link>
        </span>
      </span>
      {loading ? (
        <div
          className={`w-full  mt-12 ${
            location.pathname === "/student-profile" ? "ml-[45%]" : "ml-[53%]"
          }`}
        >
          <Loader />
        </div>
      ) : TABLE_ROWS?.length > 0 ? (
        <>
          <div className="mt-3 mr-6 md:ml-[19%] sm:ml-[26%]">
            <CustomTableTen
              tableHead={TABLE_HEAD}
              tableRows={TABLE_ROWS}
              action="View"
              linkOne={"/institute-view"}
              icon={<FaRegEye />}
              iconTwo={<RiEdit2Line />}
              iconThree={<ImBin />}
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
            bodyText="No Institutte Available to Show"
          />
        </div>
      )}
    </>
  );
};

export default AdminInstitute;
