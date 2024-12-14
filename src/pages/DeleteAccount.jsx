import React, { useState } from "react";
import AgentSidebar from "../components/dashboardComp/AgentSidebar";
import Header from "../components/dashboardComp/Header";
import { toast } from "react-toastify";
import Sidebar from "../components/dashboardComp/Sidebar";
import socketServiceInstance from "../services/socket";
import { useSelector } from "react-redux";
import { deleteUserById } from "../features/agentApi";
import DeleteAccountPop from "../components/DeleteAccountPop";
import { useNavigate } from "react-router-dom";
import { profileSkeleton } from "../assets";

const DeleteAccount = () => {
  const { agentData } = useSelector((state) => state.agent);

  const { studentInfoData } = useSelector((state) => state.student);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const userId =
    role === "3"
      ? studentInfoData?.data?.studentInformation?._id
      : agentData?.agentId;
  const path =
    role === "2"
      ? `/company/delete-agent/${userId}`
      : role === "3"
      ? `/studentinformation/student-information/${userId}`
      : null;
  const [isOpenPop, setIsOpenPop] = useState(false);
  const openDeletePopup = () => {
    setIsOpenPop(true);
  };

  const closePop = () => {
    setIsOpenPop(false);
  };

  const deleteAccountById = async () => {
    try {
      const res = await deleteUserById(path);
      toast.success(res.message || "Account Deleted Successfully");
      localStorage.removeItem("student");
      localStorage.removeItem("role");
      localStorage.removeItem("userAuthToken");
      if (socketServiceInstance.isConnected()) {
        //from agent to admin
        const data = { userId: userId, reason: "" };

        socketServiceInstance.socket.emit("DELETE_AUTH_TOKEN", data);
      } else {
        console.error("Socket connection failed, cannot emit notification.");
      }
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <>
      <Header customLink="/agent/shortlist" />
      <div>
        <span className="fixed overflow-y-scroll scrollbar-hide bg-white">
          {role === "2" ? <AgentSidebar /> : <Sidebar />}
        </span>
      </div>
      <div className="font-poppins">
        <span className="flex md:flex-row sm:flex-col items-center bg-white mt-16 md:ml-[16.5%] sm:ml-[22%] pb-6">
          <span>
            <p className="text-[28px] font-bold text-sidebar mt-6 ml-9">
              Delete Account
            </p>
            <p className="mt-1 md:font-normal sm:font-light text-body md:pr-[8%] sm:pr-[20%] ml-9">
              Before you delete your account, please note that this action is
              irreversible.
            </p>
          </span>
        </span>

        <div className="bg-white rounded-md mb-20 mt-6 md:ml-[31.5%] md:mr-[16%] px-8 py-6 sm:ml-[26%] font-poppins flex flex-col items-center justify-center">
          <img
            src={
              role === "2"
                ? agentData?.primaryContact?.profilePicture
                : role === "3"
                ? studentInfoData?.data?.studentInformation?.personalInformation
                    ?.profilePicture
                : profileSkeleton
            }
            alt="img"
            className="w-24 h-24 rounded-full"
            onError={(e) => {
              e.target.src = profileSkeleton;
            }}
            loading="lazy"
          />

          <p className="text-sidebar font-normal text-[15px]">
            {" "}
            {role === "2"
              ? agentData?.companyDetails?.businessName
              : role === "3"
              ? studentInfoData?.data?.studentInformation?.personalInformation
                  ?.firstName +
                " " +
                studentInfoData?.data?.studentInformation?.personalInformation
                  ?.lastName
              : null}
          </p>
          <p className="text-sidebar font-normal text-[15px]">
            {" "}
            {role === "2"
              ? agentData?.agentEmail
              : role === "3"
              ? studentInfoData?.data?.studentInformation?.personalInformation
                  ?.email
              : null}
          </p>
          <p className="text-sidebar  text-[22px] font-semibold mt-6">
            {" "}
            Account Deletion
          </p>
          <p className="text-sidebar font-light text-center text-[14px]">
            {" "}
            This action can be reverse anytime. All your data, including profile
            information and activity history, will be restored.
          </p>
          <span
            onClick={openDeletePopup}
            className="text-white cursor-pointer bg-primary text-center py-2 px-6 rounded-md mt-9"
          >
            Delete
          </span>
        </div>
      </div>
      <DeleteAccountPop
        closePop={closePop}
        isOpenPop={isOpenPop}
        handleFunc={deleteAccountById}
      />
    </>
  );
};

export default DeleteAccount;
