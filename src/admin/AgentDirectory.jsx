import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import Pagination from "../components/dashboardComp/Pagination";
import { CustomTableEight } from "../components/Table";
import { getAllAgentList, setNullStudentDirectory } from "../features/adminSlice";
import AdminSidebar from "../components/dashboardComp/AdminSidebar";
import Header from "../components/dashboardComp/Header";
import { FaRegEye } from "react-icons/fa";
import { CustomInput } from "../components/reusable/Input";
import { IoSearchOutline } from "react-icons/io5";
import { downloadFile } from "../features/adminApi";
import Dnf from "../components/Dnf";
import { dnf } from "../assets";
import Loader from "../components/Loader";

const AgentDirectory = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1)
  const [downloading, setDownloading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [perPage, setPerPage] = useState(10);

  // Select data from Redux

  const { getAllAgentData } = useSelector((state) => state.admin);
  console.log(getAllAgentData);
  const totalUsersCount = getAllAgentData?.data?.pagination?.totalAgents || 0;
  const currentPage = getAllAgentData?.data?.pagination?.currentPage || 1;
  const totalPagesCount = getAllAgentData?.data?.pagination?.totalPages || 1;

  const perPageOptions = Array.from(
    { length: Math.min(totalUsersCount, 100) / 10 },
    (_, i) => (i + 1) * 10
  );

  const handlePerPageChange = (e) => {
    setPerPage(parseInt(e.target.value));
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (pageNumber) => setPage(pageNumber);

  useEffect(() => {
    // setLoading(true);
    dispatch(getAllAgentList({ page, perPage, search }));

    // setLoading(false);
  }, [dispatch, page, perPage, search]);

  const TABLE_HEAD = [
    "S.No.",
    "Agent Name",
    "Id",
    "Email Id",
    "Phone Number",
    "View",
    "Student List",
    "Action",
  ];

  const TABLE_ROWS = getAllAgentData?.data?.agents?.map((data, index) => ({
    sno: (currentPage - 1) * perPage + index + 1,
    name: data?.name || "NA",
    stId: data?.agId || "_",
    email: data?.email || "NA",
    phone: data?.phone,
    viewList: data || "NA",
    data: data || "NA",
  }));

  const downloadAll = async () => {
    try {
      setDownloading(true)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const res = await downloadFile({
        url: "/admin/total-agent-download",
        filename: "Agent.csv",
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
        <span className="fixed overflow-y-scroll scrollbar-hide  bg-white ">
          <AdminSidebar />
        </span>
        <div className="md:ml-[17%] ml-[22%] pt-14 font-poppins">
          <p className="md:text-[28px] text-[24px] font-bold text-sidebar mt-6 ml-9">
            Agent Directory ({totalUsersCount})
          </p>
          <p className="text-sidebar text-[15px]  md:ml-9  sm:ml-20">
          Manage and view agent details in one place.
          </p>
        </div>
      </div>
      <div className=" mt-6 mr-6 ">
        <span className="flex flex-row items-center mb-3 ml-[20%]">
          <span className="flex flex-row justify-between w-full items-center">
            <span className="flex flex-row items-center">
             
              <span className="flex flex-row items-center  sm:ml-9 md:-ml-2">
                <CustomInput
                  className="h-11 md:w-80 sm:w-60 rounded-md  text-body placeholder:px-3 pl-7 border border-[#E8E8E8] outline-none"
                  type="text"
                  placeHodler="Search by agent Id and agent name"
                  name="search"
                  value={search}
                  onChange={handleSearchChange}
                />
                <span className="absolute pl-2 text-[20px] text-body">
                  <IoSearchOutline />
                </span>
              </span>
            </span>
            <span>
              <Link
                to="/login"
                className="bg-primary text-white px-4 rounded-md py-2 cursor-pointer"
              >
                + Add Agent
              </Link>
            </span>
          </span>
          <span
            onClick={downloadAll}
            className="bg-primary ml-5 text-white px-4 rounded-md py-2 cursor-pointer"
          >
            {downloading ? "Downloading...." : "Download"}
          </span>
        </span>
      </div>
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

            <CustomTableEight
              tableHead={TABLE_HEAD}
              tableRows={TABLE_ROWS}
              action="View"
              linkOne={"/agent-profile"}
              linkTwo={"/admin/agent-student"}
              icon={<FaRegEye />}
              actionThree="View List"
              iconTwo={<FaRegEye />}
              actionTwo={"Delete"}
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
        <div className="md:ml-[13%] sm:ml-[19%]">
          <Dnf
            dnfImg={dnf}
            headingText="Start Your Journey!"
            bodyText="No Agent Data Available"
          />
        </div>
      )}
    </>
  );
};

export default AgentDirectory;
