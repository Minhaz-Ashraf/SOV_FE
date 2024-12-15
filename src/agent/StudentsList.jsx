import React, { useEffect, useState } from "react";
import Header from "../components/dashboardComp/Header";
import AgentSidebar from "../components/dashboardComp/AgentSidebar";
import StudentCards from "../components/dashboardComp/StudentCards";
import { useDispatch, useSelector } from "react-redux";
import { allStudent, allStudentCount } from "../features/agentSlice";
import Pagination from "../components/dashboardComp/Pagination";
import { CustomInput } from "../components/reusable/Input";
import { IoSearchOutline } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import { dnf, noInstitute } from "../assets";
import Dnf from "../components/Dnf";
import Loader from "../components/Loader";
import { deleteStudentById } from "../features/agentApi";
import { toast } from "react-toastify";
import { clearStudentInformation } from "../features/studentSlice";

const StudentsList = () => {
  const studentData = useSelector((state) => state.agent.totalStudents);
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [listUpdated, setListUpdated] = useState(false);
  const [page, setPage] = useState(1);
  const prefCountry = location?.state?.country;
  const prefInstitute = location?.state?.institute;
  const totalUsersCount = studentData?.totalRecords || 0;
  const currentPage = studentData?.currentPage;
  const totalPagesCount = studentData?.totalPages;
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handlePerPageChange = (e) => {
    setPerPage(parseInt(e.target.value));
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
    dispatch(allStudent({ perPage, page, search }));
    dispatch(allStudentCount());
  }, [perPage, page, search, listUpdated ]);

  const handleListUpdate = () => {
    setListUpdated((prev) => !prev);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  const deleteStudent = async (id) => {
    try {
      const res = await deleteStudentById(id);
      handleListUpdate();
      toast.success(res.message || "Student deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.message || "something went wrong");
    }
  };
  const locatStorageDelete = ()=>{
    localStorage.removeItem("form");
    localStorage.removeItem("student");
    dispatch(clearStudentInformation())

  }
  return (
    <>
      <Header customLink="/agent/shortlist" />
      <div>
        <span className="fixed overflow-y-scroll scrollbar-hide bg-white ">
          <AgentSidebar />
        </span>
        <div className="md:ml-[17%] sm:ml-[23%] pt-14 font-poppins bg-white pb-6">
          <p className="md:text-[28px] sm:text-[22px] font-bold text-sidebar mt-6 ml-9">
            Student Directory ({totalUsersCount})
          </p>
          <p className="font-normal text-body pr-[20%] text-[16px] ml-9">
            Manage and view student details in one place.
          </p>
        </div>
        <div className="flex items-center justify-between  md:mr-7 sm:mr-5 md:ml-[19.5%] sm:ml-[27%] mt-6">
          <span className="flex flex-row items-center">
            {" "}
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
            <span className="flex flex-row items-center ">
              <CustomInput
                className="h-11 md:w-96 sm:w-80 rounded-md text-body placeholder:px-3 pl-7 border border-[#E8E8E8] outline-none"
                type="text"
                placeHodler="Search Student, Phone Number, & Email"
                name="search"
                value={search}
                onChange={handleSearchChange}
              />
              <span className="absolute pl-2 text-[20px] text-body">
                <IoSearchOutline />
              </span>
            </span>
          </span>
          <Link onClick={locatStorageDelete} to="/student-form/1" state={"passPage"}>
            <span className="bg-primary text-white rounded-md px-6 py-2 cursor-pointer text-[13px]">
              + Add New Student
            </span>
          </Link>
        </div>

        {isLoading ? (
          <div className="w-1 ml-[53%] mt-12">
            <Loader />
          </div>
        ) : !studentData?.students ? (
          <p className="mt-8 font-medium text-body ml-[25%] mr-[15%]">
          <Dnf
            dnfImg={dnf}
            headingText="Start Your Journey!"
            bodyText="No Student Available to show"
          />
          </p>
        ) : studentData?.students.length === 0 ? (
          <p className="mt-8 font-medium text-body ml-[25%] mr-[15%]">
          <Dnf
            dnfImg={dnf}
            headingText="Start Your Journey!"
            bodyText="No Student Available to show"
          />
          </p>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-1 md:ml-[18.5%] sm:ml-[27%] mt-6 mr-6 gap-3 ">
              {studentData?.students?.map((data, index) => (
                <StudentCards
                  key={index}
                  name={
                    data?.personalInformation?.firstName +
                    " " +
                    data?.personalInformation?.lastName
                  }
                  email={data?.personalInformation?.email}
                  mobile={data?.personalInformation?.phone?.phone}
                  profile={data?.personalInformation?.profilePicture}
                  link="/student-profile"
                  defaultId={{
                    id: data._id,
                    prefCountry: prefCountry,
                    prefInstitute: prefInstitute,
                  }}
                  stId={data?.stId}
                  application={data?.applicationCount}
                  deleteStudentData={deleteStudent}
                  page={data?.pageCount}
                  edit={true}
                />
              ))}
            </div>
            <div className="mt-12 mb-10">
              <Pagination
                currentPage={currentPage}
                hasNextPage={currentPage * perPage < totalUsersCount}
                hasPreviousPage={currentPage > 1}
                onPageChange={handlePageChange}
                totalPagesCount={totalPagesCount}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default StudentsList;
