import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import Pagination from "../components/dashboardComp/Pagination";
import { CustomTableEight } from "../components/Table";
import { getAllAgentList } from "../features/adminSlice";
import AdminSidebar from "../components/dashboardComp/AdminSidebar";
import Header from "../components/dashboardComp/Header";
import { FaRegEye } from "react-icons/fa";
import { CustomInput } from "../components/reusable/Input";
import { IoSearchOutline } from "react-icons/io5";
import { downloadFile } from "../features/adminApi";

const AgentDirectory = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [perPage, setPerPage] = useState(10);

  // Select data from Redux

  const { getAllAgentData } = useSelector((state) => state.admin);
  console.log(getAllAgentData) 
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
    dispatch(getAllAgentList({ page, perPage, search }));
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


  const downloadAll = async()=>{
    try{
      const res =await  downloadFile({
        url: "/admin/total-agent-download",
        filename: "Agent.csv",
      }) ;
      toast.info("Downloading will start in few seconds") 
    }catch(error){
      console.log(error) 
      toast.error(error.message||"Error downloading") 
    } 
  }
  return (
    <>
      <Header customLink="/agent/shortlist" />
      <div>
        <span className="fixed overflow-y-scroll scrollbar-hide  bg-white ">
          <AdminSidebar />
        </span>
        <div className="md:ml-[17%] ml-[22%] pt-14 font-poppins">
          <p className="md:text-[28px] text-[24px] font-bold text-sidebar mt-6 ml-9">
            Agent Directory
          </p>
        </div>
      </div>
      <div className=" mt-6 mr-6 ">
        <span className="flex flex-row items-center mb-3 ml-[20%]">
          <span className="flex flex-row justify-between w-full items-center">
            <span className="flex flex-row items-center">
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
              <span className="flex flex-row items-center  ml-9">
                <CustomInput
                  className="h-11 w-80 rounded-md text-body placeholder:px-3 pl-7 border border-[#E8E8E8] outline-none"
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
            Download
          </span>
        </span>
      </div>

      <div className="mt-6 mr-6 ml-[19%] ">
        <CustomTableEight
          tableHead={TABLE_HEAD}
          tableRows={TABLE_ROWS}
          action="View"
          linkOne={"/agent-profile"}
          linkTwo={"/admin/agent-student"}
          icon={<FaRegEye />}
          actionThree="View List"
          iconTwo={<FaRegEye />}
          actionTwo={"Remove"}
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
  );
};

export default AgentDirectory;
