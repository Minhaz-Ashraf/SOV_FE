import React, { useEffect, useState } from "react";
import Header from "../components/dashboardComp/Header";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../components/dashboardComp/Pagination";
import { CustomInput } from "../components/reusable/Input";
import { IoSearchOutline } from "react-icons/io5";
import { Link,  useNavigate } from "react-router-dom";
import { dnf } from "../assets";
import Dnf from "../components/Dnf";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import AdminSidebar from "../components/dashboardComp/AdminSidebar";
import MemberCard from "../components/dashboardComp/MemberCard";
import { getAllTeamData } from "../features/adminSlice";
import { deleteTeam } from "../features/adminApi";
import socketServiceInstance from "../services/socket";

const TeamList = () => {
  const teamData = useSelector((state) => state.admin.getTeams);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const perPage = 10;
  const [page, setPage] = useState(1);
  const totalUsersCount = teamData?.data?.total || 0;
  const currentPage = teamData?.data?.currentPage;
  const totalPagesCount = teamData?.data?.totalPages;
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  useEffect(() => {
    dispatch(getAllTeamData({ perPage, page, search }));
  }, [perPage, page, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  const deleteMember = async (id) => {
    try {
      const res = await deleteTeam(id);
      dispatch(getAllTeamData());

      toast.success(res.message || "Member Deleted Successfully");
  
      if (socketServiceInstance.isConnected()) {
        //from agent to admin
        const data = { userId: id, reason: "team deleted from admin" };

        socketServiceInstance.socket.emit("DELETE_AUTH_TOKEN", data);
      } else {
        console.error("Socket connection failed, cannot emit notification.");
      }
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(error.message || "something went wrong");
    }
  };

  return (
    <>
      <Header customLink="/agent/shortlist" />
      <div>
        <span className="fixed overflow-y-scroll scrollbar-hide bg-white ">
          <AdminSidebar />
        </span>
        <div className="md:ml-[17%] sm:ml-[23%] pt-14 font-poppins bg-white pb-6">
          <p className="md:text-[28px] sm:text-[22px] font-bold text-sidebar mt-6 ml-9">
            Team Members({totalUsersCount})
          </p>
          <p className="font-normal text-body pr-[20%] text-[16px] ml-9">
            Manage and view team members details in one place.
          </p>
        </div>
        <div className="flex items-center justify-between  md:mr-7 sm:mr-5 md:ml-[19.5%] sm:ml-[27%] mt-6">
          <span className="flex flex-row items-center">
            {" "}
            <span className="flex flex-row items-center ">
              <CustomInput
                className="h-11 md:w-96 sm:w-80 rounded-md text-body placeholder:px-3 pl-7 border border-[#E8E8E8] outline-none"
                type="text"
                placeHodler="Search Member Name, Phone Number, & Email"
                name="search"
                value={search}
                onChange={handleSearchChange}
              />
              <span className="absolute pl-2 text-[20px] text-body">
                <IoSearchOutline />
              </span>
            </span>
          </span>
          <Link to="/admin/add-member" state={"passPage"}>
            <span className="bg-primary text-white rounded-md px-6 py-2 cursor-pointer text-[13px]">
              + Add New Member
            </span>
          </Link>
        </div>

        {isLoading ? (
          <div className="w-full ml-[53%] mt-12">
            <Loader />
          </div>
        ) : !teamData?.data?.teamMembers ? (
          <p className="mt-8 font-medium text-body ml-[25%] mr-[15%]">
            <Dnf
              dnfImg={dnf}
              headingText="Start Your Journey!"
              bodyText="No Member Available to Show"
            />
          </p>
        ) : teamData?.data?.teamMembers.length === 0 ? (
          <p className="mt-8 font-medium text-body ml-[25%] mr-[15%]">
            <Dnf
              dnfImg={dnf}
              headingText="Start Your Journey!"
              bodyText="No Member Available to Show"
            />
          </p>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-1 md:ml-[18.5%] sm:ml-[27%] mt-6 mr-6 gap-3 ">
              {teamData?.data?.teamMembers?.map((data, index) => (
                <MemberCard
                  key={index}
                  name={data?.firstName + " " + data?.lastName}
                  email={data?.email}
                  mobile={data?.phone}
                  profile={data?.profilePicture}
                  defaultId={{
                    id: data._id,
                  }}
                  stId={data?.teamId}
                  deleteteamData={deleteMember}
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

export default TeamList;
